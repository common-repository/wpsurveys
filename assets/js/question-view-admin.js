(function($) {
  $(() => {
  let ctx = window.SurveyContext;

  let QuestionItemTemplate = _.template($("script#question-list-item").html());
  let HtmlEditorView = ctx.HtmlEditor;
  ctx.QuestionItemView = Backbone.View.extend({
    tagName: "li",
    events: {
      "click .item": function() {
        this.trigger("selected");
      },
      "click .actions #delete": function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        let self = this;
        if (this.model.survey.get("questions").length === 1) {
          return;
        }
        this.model.destroy({
          success: function() {
            self.model.survey.deleteQuestion(self.model.get("_id"));
            self.remove();
          }
        })
      }
    },
    initialize: function(question) {
      this.render();
      let self = this;
      this.listenTo(this.model,"change:wp_id",function() {
        self.render();
      })
    },
    render: function() {
      $(this.el).children().remove();
      $(QuestionItemTemplate({question: this.model})).appendTo(this.el);
      $(this.el).addClass("question-list-item");
    },
    select: function() {
      $(this.el).addClass("selected");
    },
    deselect: function() {
      $(this.el).removeClass("selected");
    }
  });

  let QuestionEditorTemplate = _.template($("script#question-editor").html());
  ctx.QuestionEditor = Backbone.View.extend({
    tagName: "div",
    events: {
      "click #tab-selector .nav-item": function(ev) {
        let forTarget = $(ev.currentTarget).attr("for");
        let $target = $(this.el).find(".survey-editor-tab#"+forTarget);
        $target.siblings().hide();
        $target.show();

        $(this.el).find("#tab-selector .nav-link").removeClass("active");
        $(ev.currentTarget).find(".nav-link").addClass("active");
        if (forTarget === "question-preview") {
          if (this.previewView) {
            this.previewView.remove();
          }
          this.model.set("answer",undefined);
          this.previewView = new (ctx.QuestionView)({
            model: this.model,
            preview: true
          });
          $(this.previewView.el).appendTo($target);
        }
      },
      "click #option-list a#add-option": "addOption",
      "click #choose-from-library": "chooseImage",
      "input #image": "setImage",
      "input input, textarea": "updateQuestion",
      "saved .option-list-item": function() {
        $(self.el).trigger("saved");
      },
    },
    remove: function() {
        if (this.previewView) {
          this.previewView.remove();
        }
        return Backbone.View.prototype.remove.apply(this,arguments);
    },
    initialize: function(question) {
      this.errorToken = Math.random();
      this.optionViews = [];
      this.options = new (ctx.OptionCollection)(this.model.get("options"));
      this.options.comparator = function(a,b) {
        return a.get("order") - b.get("order")
      };
      this.options.sort();
      let self = this;
      this.saveQuestion = _.debounce(function() {
          const options = this.model.attributes.options;
          this.model.attributes.options = null;
          this.model.save(null,{
            success: function() {
              $(self.el).trigger("saved");
            }
          });
          this.model.attributes.options = options;

      },500);
      this.render();
    },
    render: function() {
      let self = this;
      $(QuestionEditorTemplate({question: this.model})).appendTo(this.el);
      $(this.el).addClass("question-editor");
      this.options.each(function(o) {
        o.question = self.model;
        self.addOptionView(o);
      });
      if (this.options.length === 0) {
        this.addOption();
      }
      this.updateOptions();
      $(this.el).trigger("view_appended");


      this.ratioXInput = $(this.el).find(".image-params #ratio-x");
      this.ratioYInput = $(this.el).find(".image-params #ratio-y");
      this.ratioFreezeInput = $(this.el).find(".image-params #ratio-freeze");
      this.heightInput = $(this.el).find(".image-params #height");

      this.heightInput.val(this.model.survey.get("image_height"));

      $(this.el).find("textarea#text").val(this.model.get("text") || "<br>");
      $(this.el).find("textarea#comment-for-wrong").val(this.model.get("comment_wrong") || "<br>");
      $(this.el).find("textarea#comment-for-right").val(this.model.get("comment_right") || "<br>");

      $(this.el).find(".image-block").hide();
      $(this.el).find("#invalid-image-message").hide();

      setTimeout(function(){
        self.ratioHelper = new (ctx.ImageRatioHelper)({
          parentElement: $(self.el).find("#image-container"),
          ratioXInput: self.ratioXInput,
          ratioYInput: self.ratioYInput,
          freezeInput: self.ratioFreezeInput,
          parentView: self
        });
        if (self.model.get("image")) {
          self.setImage();
        }
        self.listenTo(self.ratioHelper,"updated",_.debounce(function(){
          self.updateQuestion();
        },100));
        self.selectOption();
      },1);

      ctx.addHTMLEditorFields(this);
    },
    updateOptions: function() {
      this.model.set("options",this.options.models.map(function(o) {
        return o.attributes;
      }));
    },
    addOptionView: function(o) {
      let view = new (ctx.OptionItemView)({model:o});
      let self = this;
      this.optionViews.push(view);
      $(view.el).appendTo($(self.el).find("#option-list ul"));
      this.listenTo(view,"updated",function() {
        self.updateOptions();
      });
      this.listenTo(view,"destroyed",function() {
        if (o.get("_id") === self.model.get("right_option")) {
          self.model.set("right_option",null);
          self.selectOption();
        };
        this.updateOptions();
      });
    },
    addOption: function() {
      let maxOrder = -1;
      this.options.each(function(m) {
        if (m.get("order") > maxOrder) {
          maxOrder = m.get("order");
        }
      })
      let o = new (ctx.OptionModel)({
        text: "Option #"+(maxOrder+2),
        order: maxOrder+1,
        question: this.model.get("_id") || this.model.get("_tempId_"),
        _tempId_: ctx.getTempId()
      });
      o.question = this.model;
      this.options.add(o);
      this.updateOptions();
      this.addOptionView(o);
      let self = this;
      if (o.question.get("_id")) {
        o.save(null,{
          success: function() {
            $(self.el).trigger("saved");
            self.model.addOption(o.attributes);
          }
        });
      } else {
        this.model.once("sync",function() {
          o.set("question",self.model.get("_id"));
          o.save(null,{
            success: function() {
              $(self.el).trigger("saved");
              self.model.addOption(o);
            }
          });
        });
      }
    },
    selectOption: function() {
      if ($(this.el).find("#option-list ul input[type='radio']:checked").length === 0) {
        let optId = this.model.get("right_option");
        if (optId) {
          $(this.el).find("#option-list ul li [option-id='"+optId+"'] input").click();
        } else {
          $(this.el).find("#option-list ul li:first-child input[type='radio']").click();
        }
      } else {
        this.updateQuestion();
      }
    },
    chooseImage: function() {
      let self = this;
      let frame = wp.media({});
      frame.on('select',function() {
        let selected = frame.state().get('selection').first().toJSON();
        $(self.el).find("#image").val(selected.url).trigger("input");
      });
      frame.open();
    },
    hideImageParams: function() {
      if (this.model.get("image")) {
        $(this.el).find("#invalid-image-message").show();
      } else {
        $(this.el).find("#invalid-image-message").hide();
      }
      $(this.el).find(".image-block").hide();
    },
    showImageParams: function() {
      $(this.el).find(".image-block").show();
      $(this.el).find("#invalid-image-message").hide();
    },
    bindImagePosition: function() {
      let self = this;
      setTimeout(function(){
        let style = self.model.get("image_style");
        try {
          style = JSON.parse(style);
        } catch(e) {
          style = {};
        }
        style = _.defaults(style, {top: 0, left: 0, right: 0, bottom: 0 });
        let ratio = parseFloat(self.model.survey.get("image_ratio")) || 1;
        self.ratioHelper.updateImage(ratio,style);
      });
    },
    setImage: function(ev) {
      if (ev) {
        ev.stopPropagation();
      }
      let val = $(this.el).find("#image").val();
      let self = this;
      $(this.el).find("#image-el").attr("src",val).one("load",function(){
        self.showImageParams();
        self.bindImagePosition();
      }).one("error",function(){
        self.hideImageParams();
      });
    },
    getImageRatio: function() {
      return this.ratioHelper.getRatio() || 1;
    },
    getImageHeight: function() {
      return parseInt(this.heightInput.val()) || 300;
    },
    updateQuestion: function(ev) {
      if (ev) {


        ev.stopPropagation();
      }
      if (this.model.survey.isReadOnly()) {
        return;
      }
      let self = this;
      let wp_id = $(this.el).find("input#wp_id").val();
      let symbols = /[a-z0-9\-]/i;
      let spaces = /\s/;
      wp_id = wp_id.split("").map(function(a){
        if (spaces.test(a)) {
          return "-";
        }
        return symbols.test(a)?a:"";
      }).join("").toLowerCase().replace(/-+/g,"-");
      $(this.el).find("input#wp_id").val(wp_id)

      let questionsByWpId = _.where(this.model.survey.get("questions"),{
        wp_id: wp_id
      }).filter(function(q) {
          return q._id !== self.model.get("_id");
      });
      if (questionsByWpId.length > 0) {
        $(this.el).trigger("id-wrong",this.errorToken);
        $(this.el).find("input#wp_id").addClass("wrong");
        return;
      } else {
        $(this.el).trigger("id-clear",this.errorToken);
        $(this.el).find("input#wp_id").removeClass("wrong");
      }

      let rightOpt = $(this.el).find("#option-list ul li input[type='radio']:checked").parents("[option-id]").attr("option-id");
      this.model.set("right_option",rightOpt);
      this.model.set("wp_id",wp_id);
      this.model.set("image",$(this.el).find("input#image").val());
      this.model.set("text",$(this.el).find("textarea#text").val()) || "<span></span>";
      this.model.set("comment_wrong",$(this.el).find("textarea#comment-for-wrong").val());
      this.model.set("comment_right",$(this.el).find("textarea#comment-for-right").val());
      if (this.ratioHelper) {	
        this.model.set("image_style",JSON.stringify(this.ratioHelper.getImagePosition()));
      } else {
        this.model.set("image_style",JSON.stringify({ top: 0, bottom: 0, left: 0, right: 0 }));
      }
      this.saveQuestion();
      this.trigger("updated");
    }
  });
});
})(jQuery);
