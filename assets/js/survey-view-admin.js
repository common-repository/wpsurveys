(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  var SurveyItemTemplate = _.template($("script#survey-table-item").html());
  var PublicSurveyItemTemplate = _.template($("script#public-survey-table-item").html());
  var Question = ctx.QuestionModel;
  var Survey = ctx.SurveyModel;

  var fromNow = function(d) {
    let diff = parseInt((Date.now() - new Date(d).getTime())/1000);
    if (diff < 30) {
      return "a few seconds ago";
    }
    if (diff < 60) {
      return diff+" seconds ago";
    }
    if (diff < 120) {
      return "a minute ago";
    }
    if (diff < 3600) {
      return Math.floor(diff/60) + " minutes ago";
    }
    if (diff < 7200) {
      return "an hour ago";
    }
    if (diff < 3600*24) {
      return Math.floor(diff/3600) + " hours ago";
    }
    return new Date().toLocaleDateString();
  };

  var waitForAllDataSaved = function(call,waitForChange,glassText) {
    var self = this;
    ctx.wait(glassText || "Saving in progress");
    ctx.requestXHRStackComplete(function() {
      try {
        call().then(function() {},function() {
          ctx.stopWaiting();
        });
      } catch(e) {
          ctx.stopWaiting();
      }
      if (waitForChange) {
        self.model.once(waitForChange,function() {
          ctx.stopWaiting();
        });
      } else {
        ctx.stopWaiting();
      }
    });
  };

  var listItemEvents = {
    "click #title .val": function() {
      this.trigger("selected");
    },
    "click #wp_id .wps-button-copy": function(ev) {
      this.model.copyWpId(ev.currentTarget);
      ev.preventDefault();
      ev.stopPropagation();
    },
    "click .survey-actions #edit": function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      this.trigger("selected");
    },
    "click .survey-actions #stat": function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      ctx.surveyStat(this.model);
    },
    "click .survey-actions #preview": function(ev) {
      ev.stopPropagation();
      this.trigger("preview");
    },
    "click .survey-actions #publish": function(ev) {
      var self = this;
      ev.stopPropagation();
      this.waitForAllDataSaved(function() {
        return self.model.publish();
      },"change:published","Publishing survey");
    },
    "click .survey-actions #finish": function(ev) {
      ev.stopPropagation();
      var self = this;
      this.waitForAllDataSaved(function() {
        return self.model.finish();
      },"change:finished","Finishing survey");
    },
    "click .survey-actions #restart": function(ev) {
      ev.stopPropagation();
      var self = this;
      this.waitForAllDataSaved(function() {
        return self.model.restart();
      },"change:finished","Restarting survey");

    },
    "click .survey-actions #delete": function(ev) {
      ev.stopPropagation();
      this.model.destroy();
    },
    "click .survey-actions #copy": function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      this.model.copy().then(function(newModel) {
        ctx.surveys.add(newModel);
        ctx.editSurvey(newModel);
      });
    },
  };

  ctx.SurveyListItemView = Backbone.View.extend({
    tagName: "tr",
    events: listItemEvents,
    waitForAllDataSaved: waitForAllDataSaved,
    initialize: function(arg) {
      this.render();
    },
    render: function() {
      $(SurveyItemTemplate({survey: this.model})).appendTo(this.el);
      $(this.el).addClass("survey-table-item");
      var self = this;
      this.listenTo(this.model,"change",function() {
          self.update();
          self.trigger("updated");
      });
      this.update();
    },
    update: function() {
      var title = $("<div />").html(this.model.get("title")).text();
      if (!title) {
        title = "~ No title ~";
        $(this.el).addClass("no-title")
      }
      $(this.el).find("#title .val").text(title);
      $(this.el).find("#wp_id .val").text(this.model.get("wp_id"));
      $(this.el).find("#published").text(this.model.get("published"));
      $(this.el).find("#type").text(this.model.get("is_test")?"T":"Q").attr("title",this.model.get("is_test")?"Test":"Questionary");
      var status = this.model.getStatusString();
      $(this.el).find("#status").text(status);
      $(this.el).attr("status",status);
      var questions = (this.model.get("questions") || []);
      var summary = 0;
      questions.forEach(function(q) {
        summary += q.summary;
      });
      $(this.el).find("#votes").text(summary);
      $(this.el).find("#questions").text(questions.length);
    }
  });

  // public-survey-table-item

  ctx.PublicSurveyListItemView = ctx.SurveyListItemView.extend({
    events: _.extend(listItemEvents,{}),
    render: function() {
      $(PublicSurveyItemTemplate({survey: this.model})).appendTo(this.el);
      $(this.el).addClass("survey-table-item");
      var self = this;
      this.listenTo(this.model,"change",function() {
          self.update();
          self.trigger("updated");
      });
      this.update();
    }
  });

  var SurveyParamsTemplate = _.template($("script#survey-params").html());
  ctx.SurveyParamsView = Backbone.View.extend({
    tagName: "div",
    events: {
      "id-wrong": function(ev,token) {
        this.errorCounter = this.errorCounter || [];
        if (this.errorCounter.indexOf(token) === -1) {
          this.errorCounter.push(token);
        }
        $(this.el).addClass("wrong");
      },
      "id-clear": function(ev,token) {
        this.errorCounter = this.errorCounter || [];
        if (this.errorCounter.indexOf(token) !== -1) {
          this.errorCounter.splice(this.errorCounter.indexOf(token),1);
        }
        if (this.errorCounter.length === 0) {
          $(this.el).removeClass("wrong");
        }
      },
      "click #question-list a": function() {
        this.addQuestion();
      },
      "input #survey-editor-bar input, input#title": "updateSurvey",
      "saved": function() {
        this.updateSurvey();
      },
      "click #stat": function() {
        ctx.surveyStat(this.model);
      },
      "click #publish": function() {
        if ($(this.el).hasClass("wrong")) {
          return;
        }
        var self = this;
        this.waitForAllDataSaved(function() {
          return self.model.publish().then(function(){
            self.setPublished();
            $(self.el).find(".wps-button-copy").addClass("flash").one("mouseout",function(){
              $(this).removeClass("flash");
            });
          });
        },"change:published","Publishing survey");
      },
      "click #finish": function() {
        if ($(this.el).hasClass("wrong")) {
          return;
        }
        var self = this;
        this.waitForAllDataSaved(function() {
          return self.model.finish().then(function(){
            self.setFinished();
          });
        },"change:finished","Finishing survey");
      },
      "click #restart": function() {
        if ($(this.el).hasClass("wrong")) {
          return;
        }
        var self = this;
        this.waitForAllDataSaved(function() {
          return self.model.restart().then(function(){
            self.setDraft();
          });
        },"change:finished","Restarting survey");
      },
      "click #set-public": function() {
        if ($(this.el).hasClass("wrong")) {
          return;
        }
        if (!this.model.get("published")) {
          return;
        }
        var self = this;
        this.waitForAllDataSaved(function() {
          return self.model.setPublic().then(function(){
            self.setPublic();
          });
        },"change:public_id","Setting survey as public");
      },
      "view_appended": "setReadOnly",
      "click .survey-element-id .wps-button-copy": function(ev) {
        this.model.copyWpId(ev.currentTarget);
      },
      "click #survey-editor-bar .survey-status #delete": function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        var self = this;
        this.waitForAllDataSaved(function() {
          return self.model.destroy({
            success: function() {
              ctx.navigation.goToSurveyList();
              self.remove();
            }
          });
        },"sync","Deleting survey");
      },
      "change .type input[type='radio']": function(ev) {
        $(this.el).removeClass("questionary").removeClass("test").addClass($(ev.currentTarget).attr("id"));
      }
    },
    waitForAllDataSaved: waitForAllDataSaved,
    initialize: function(arg) {
      this.errorToken = Math.random();
      this.selectedQuestion = null;
      this.questionViews = [];
      this.questions = new ctx.QuestionCollection(this.model.get("questions") || []);
      this.questions.comparator = function(a,b) {
        return a.get("order") - b.get("order")
      };
      this.questions.sort();
      var self = this;
      this.saveSurvey = _.debounce(function() {
        var now = new Date();
        self.model.save(null,{
          success: function() {
            self.$lastEdit.text(fromNow(now));
            self.$lastEdit.addClass("just-saved");
            setTimeout(function(){
              self.$lastEdit.removeClass("just-saved");
            },10);
          },
          error: function() {
            // todo save error
          }
        });
      },500);
      this.render();
    },
    render: function() {
      var self = this;
      $(SurveyParamsTemplate({survey: this.model})).appendTo(this.el);
      $(this.el).addClass("survey-params");
      $(this.el).find("#survey-editor-bar #wp_id").val(this.model.get("wp_id"));
      $(this.el).find("#title").val(this.model.get("title"));

      if (self.model.isOwner()) {
        $(self.el).addClass("owner")
      }

      if (self.model.isPublic()) {
        $(self.el).addClass("public")
      }

      if (self.model.isDemo()) {
        $(self.el).addClass("demo")
      }

      if (self.model.get("is_test")) {
        $(self.el).find(".type input#test").attr("checked","checked");
        $(this.el).addClass("test");
      } else {
        $(self.el).find(".type input#questionary").attr("checked","checked");
        $(this.el).addClass("questionary");
      }
      this.$lastEdit = $(this.el).find("#survey-last-edit");
      var created = this.model.get("created");
      var published = this.model.get("published");
      var finished = this.model.get("finished");
      if (!created) {
        this.model.set("created",new Date().toISOString());
        this.model.set("last_update",new Date().toISOString())
      }
      $(this.el).find("#survey-created").text(this.model.getCreatedString());
      this.$lastEdit.text(fromNow(new Date(this.model.get("last_update"))));
      this.lastUpdateInterval = setInterval(function() {
        self.$lastEdit.text(fromNow(new Date(self.model.get("last_update"))));
      },5000);
      this.questions.each(function(q) {
        self.appendQuestionView(q);
      });
      if (this.questions.length == 0) {
        this.addQuestion();
      } else {
        var current = this.questions.where({
          wp_id: ctx.getCurrentQuestion()
        })[0];
        this.selectQuestion(current || this.questions.models[0]);
      }
      $(this.el).addClass('draft');
      $(this.el).find("#survey-status").text(this.model.getStatusString());
      if (this.model.get("finished")) {
        this.setFinished();
      } else if (this.model.get("published")) {
        this.setPublished();
      }
      this.model.on("change:questions",function() {
        if (_.where(self.model.get("questions"),{
          _id: self.selectedQuestion.model.get("_id")
        }).length === 0) {
          if (self.questions.length > 0) {
            self.selectQuestion(self.questions.models[0]);
          }
        }
      });
      this.model.on("change",function(){
        $(self.el).find("#survey-status").text(self.model.getStatusString());
      });
      ctx.addHTMLEditorFields(this,function() {
        self.updateSurvey();
      });
    },
    setDraft: function() {
      $(this.el).removeClass("readonly").addClass('draft');
      $(this.el).find("input,textarea,button,.wps-button").removeAttr("readonly");
      $(this.el).find("#survey-question-view #image").each(function(i,el) {
        var oldplaceholder = $(el).attr("default-placeholder") || "";
        $(el).attr("placeholder",oldplaceholder);
      });
      $(this.el).removeClass("published").removeClass("finished");
    },
    setPublic: function() {
      $(this.el).addClass('public');
    },
    setReadOnly: function() {
      $(this.el).addClass("readonly").removeClass('draft');
      $(this.el).find("input,textarea,button,.wps-button").attr("readonly","readonly");
      $(this.el).find("#survey-question-view #image").each(function(i,el) {
        var oldplaceholder = $(el).attr("placeholder") || "";
        $(el).attr("default-placeholder",oldplaceholder);
        $(el).attr("placeholder","No question image");
      });
    },
    setPublished: function() {
      this.setReadOnly();
      $(this.el).addClass("published").removeClass("finished");
    },
    setFinished: function() {
      this.setReadOnly();
      $(this.el).removeClass("published").addClass("finished");
    },
    appendQuestionView: function(q) {
      q.survey = this.model;
      var QuestionItemView = ctx.QuestionItemView;
      var view = new QuestionItemView({model: q});
      var self = this;
      this.questionViews.push(view);
      view.on("selected",function() {
        self.selectQuestion(q);
      });
      $(view.el).appendTo($(self.el).find("#question-list ul"));
    },
    selectQuestion: function(q) {
      if (this.selectedQuestion) {
        this.selectedQuestion.remove();
      }
      this.questionViews.forEach(function(view) {
        if (view.model === q) {
          view.select();
        } else {
          view.deselect();
        }
      });
      var QuestionEditor = ctx.QuestionEditor;
      this.selectedQuestion = new QuestionEditor({model: q});
      $(this.selectedQuestion.el).appendTo($(this.el).find("#survey-question-view"));
      ctx.updateHrefHash(this.model,q);
    },
    addQuestion: function() {
      var maxOrder = -1;
      this.questions.each(function(m){
        if (m.get("order") > maxOrder) {
          maxOrder = m.get("order");
        }
      });
      while(this.questions.where({
        wp_id: "question-"+(maxOrder+2)
      }).length > 0) {
        maxOrder++;
      };
      var q = new Question({
        text: "Question #"+(maxOrder+2),
        order: maxOrder+1,
        wp_id: "question-"+(maxOrder+2),
        image: "",
        survey: this.model.get("_id") || this.model.get("_tempId_"),
        _tempId_: ctx.getTempId()
      });
      this.questions.add(q);
      this.appendQuestionView(q);
      this.selectQuestion(q);
      var self = this;
      if (q.survey.get("_id")) {
        q.save();
      } else {
        this.model.once("sync",function() {
          q.save(null,{
            success: function() {
              this.model.addQuestion(q.attributes);
              self.saveSurvey();
            }
          })
        });
      }
    },
    updateSurvey: function(ev) {
      ev && ev.stopPropagation();
      var self = this;
      var wp_id = $(this.el).find("#survey-editor-bar input#wp_id").val();
      var symbols = /[a-z0-9\-]/i;
      var spaces = /\s/;
      wp_id = wp_id.split("").map(function(a){
        if (spaces.test(a)) {
          return "-";
        }
        return symbols.test(a)?a:"";
      }).join("").toLowerCase().replace(/-+/g,"-");
      var surveysByWPId = ctx.surveys.where({
        wp_id: wp_id
      });
      surveysByWPId = surveysByWPId.filter(function(s) {
        return s.get("_id") !== self.model.get("_id");
      });
      if (surveysByWPId.length !== 0) {
        $(this.el).find("#survey-editor-bar input#wp_id").addClass("wrong");
        $(this.el).trigger("id-wrong",this.errorToken);
        return;
      } else {
        $(this.el).find("#survey-editor-bar input#wp_id").removeClass("wrong");
        $(this.el).trigger("id-clear",this.errorToken);
      }
      $(this.el).find("#survey-editor-bar input#wp_id").val(wp_id);
      this.model.set("wp_id",wp_id);
      this.model.set("is_test",$(this.el).find(".type input#test:checked").length === 1);
      this.model.set("image_ratio",this.selectedQuestion.getImageRatio());
      this.model.set("image_height",this.selectedQuestion.getImageHeight());
      this.model.set("title",$(this.el).find("[html-editor]#title").val());
      this.saveSurvey();
    },
    remove: function() {
      (this.questionViews || []).forEach(function(view) {
        view.remove();
      });
      this.selectedQuestion && this.selectedQuestion.remove();
      clearInterval(this.lastUpdateInterval);
      Backbone.View.prototype.remove.apply(this,arguments);
    }
  });
});
})(jQuery);
