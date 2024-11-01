(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  var OptionItemTemplate = _.template($("script#option-list-item").html());

  ctx.OptionItemView = Backbone.View.extend({
    tagName: "li",
    className: "wrong-option",
    events: {
      "click input[type='radio']": function(ev) {
          $("input[type='radio'][name='"+$(ev.currentTarget).attr("name")+"']").not(ev.currentTarget).trigger("deselect");
          $(this.el).addClass("right-option").removeClass("wrong-option");
          $(this.el).attr("title","Right answer");
          $(ev.currentTarget).attr("checked","checked");
      },
      "deselect input[type='radio']": function(ev) {
          $(this.el).addClass("wrong-option").removeClass("right-option");
          $(this.el).attr("title","Wrong answer");
      },
      "click .actions #delete": function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        var self = this;
        if ((this.model.question.get("options") || []).length < 2) {
          return;
        }
        $(this.el).remove();
        self.trigger("destroyed");
        this.model.destroy({
          success: function() {
            self.model.question.deleteOption(self.model.get("_id"));
            self.remove();
          }
        })
      }
    },
    initialize: function() {
      var self = this;
      this.saveOption = _.debounce(function(){
        self.model.save(null,{
          success: function() {
            $(self.el).trigger("saved");
          }
        });
      },500);
      this.render();
    },
    render: function() {
      $(OptionItemTemplate({
        option: this.model,
        question: this.model.question
      })).appendTo(this.el);
      $(this.el).addClass("option-list-item");
      $(this.el).trigger("view_appended");
      $(this.el).find("textarea").val(this.model.get("text"));
      var self = this;
      ctx.addHTMLEditorFields(this, function() {
        self.updateOption();
      });

      if (this.model.question.survey.get("is_test")) {
        $(this.el).attr("title","Wrong answer");
      }

      this.listenTo(this.model.question.survey,"change:is_test",function(){
        if (self.model.question.survey.get("is_test")) {
          var checked = $(self.el).find("input[type='radio']:checked").length === 1;
          $(self.el).attr("title",checked?"Right answer":"Wrong answer");
        } else {
          $(self.el).removeAttr("title");
        }
      });

      if (!this.model.question.get("_id")) {
        this.model.question.once("sync",function() {
          $(self.el).find("input[type='radio']").attr("name","right-answer-for-"+self.model.question.get("_id"));
        });
      }
      if (!this.model.get("_id")) {
        this.model.once("sync",function() {
          $(self.el).find("[option-id]").attr("option-id",self.model.get("_id"));
          self.trigger("updated");
        });
      }
    },
    updateOption: function(ev) {
      ev && ev.stopPropagation();
      this.model.set("text",$(this.el).find("[html-editor]").val());
      this.saveOption();
      this.trigger("updated");
    }
  });
});
})(jQuery);
