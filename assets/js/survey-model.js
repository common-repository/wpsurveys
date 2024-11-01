(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  ctx.SurveyModel = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {
      var id = this.get("_id");
      return ctx.URL("/surveys/"+(id?id+"/":""));
    },
    copyWpId: function(el) {
      ctx.copyToClipboard("[ wps-surveys "+this.get("wp_id")+" ]");
      if (el) {
        $(el).text("copied!");
        $(el).one("mouseout",function() {
          $(el).text("copy")
        });
      }
    },
    destroy: function() {
        if (confirm("All survey data will be deleted. Proceed? ")) {
          return Backbone.Model.prototype.destroy.apply(this,arguments);
        } else {
          return Promise.reject();
        }
    },
    addQuestion: function(question) {
      var questions = this.get("questions");
      var existFlag = false;
      questions = questions.map(function(q) {
        if (q._id === question._id) {
          existFlag = true;
          return question;
        } else {
          return q;
        }
      });
      if (!existFlag) {
        questions = [question].concat(questions);
      }
      this.set("questions",questions);
    },
    deleteQuestion: function(questionId) {
      var questions = this.get("questions");
      this.set("questions",questions.filter(function(q){
        return q._id != questionId;
      }));
    },
    publish: function(err,success) {
      var id = this.get("_id");
      var self = this;
      return ctx.ajaxPost("/surveys/"+id+"/publish").then(function(ret) {
        self.set("published",ret.published);
      });
    },
    finish: function() {
      var id = this.get("_id");
      var self = this;
      return ctx.ajaxPost("/surveys/"+id+"/finish").then(function(ret) {
        self.set("finished",ret.finished);
      });
    },
    requests: function() {
      var id = this.get("_id");
      var self = this;
      return ctx.ajaxGet("/surveys/"+id+"/requests");
    },
    setPublic: function() {
      if (confirm("It will be impossible to edit or delete this survey after making it public.\nDo you want to proceed?","Yes","No")) {
        var id = this.get("_id");
        var self = this;
        return ctx.ajaxPost("/surveys/"+id+"/setpublic").then(function(ret) {
          if (self.get("public_id") == ret.public_id) {
            self.trigger("change:public_id");
          } else {
            self.set("public_id",ret.public_id);
          }
        });
      }
    },
    copy: function() {
      var wp_id = this.get("wp_id");
      var self = this;
      var newSurveyID = ctx.getNewSurveyId()
      return ctx.ajaxPost("/surveys/"+wp_id+"/copy",{
        wp_id: newSurveyID.wp_id
      }).then(function(newModelAttrs) {
        return new (ctx.SurveyModel)(newModelAttrs);
      });
    },
    restart: function() {
      var id = this.get("_id");
      var self = this;
      if (confirm("All survey results will be discarded. Do you want to proceed?","Yes","No")) {
        return ctx.ajaxPost("/surveys/"+id+"/restart").then(function(ret) {
          var questions = (self.get("questions") || []);
          questions.forEach(function(q) {
            q.summary = 0;
            q.options.forEach(function(o) {
              o.votes = 0;
            })
          });
          self.set({
            "published": null,
            "finished": null,
            "questions":questions
          });
        });
      } else {
        return Promise.reject();
      }
    },
    getCreatedString: function() {
      var created = new Date(this.get("created"));
      var now = new Date();
      if (now.toLocaleDateString() === created.toLocaleDateString()) {
        return created.toLocaleTimeString();
      } else {
        return created.toLocaleDateString();
      }
    },
    getStatusString: function() {
      if (this.isDemo()) {
        return "demo survey"
      }
      var statusDate = this.get("finished") || this.get("published");
      var status = this.get("finished")?"finished: ":"published: ";
      if (statusDate) {
        statusDate = new Date(statusDate);
        var now = new Date();
        if (now.toLocaleDateString() === statusDate.toLocaleDateString()) {
          statusDate = statusDate.toLocaleTimeString();
        } else {
          statusDate = statusDate.toLocaleDateString();
        }
        return status + statusDate;
      } else {
        return "draft";
      }
    },
    isOwner: function() {
      return this.get("ours");
    },
    isDemo: function() {
      return this.get("demo");
    },
    isPublic: function() {
      return this.get("published") && (this.get("public_id") || this.get("demo"));
    },
    isReadOnly: function() {
      return this.get("finished") || this.get("published");
    }
  });

  ctx.SurveyCollection = Backbone.Collection.extend({
    model: ctx.SurveyModel,
    url: function() {
      return ctx.URL("/surveys/");
    }
  });
  ctx.PublicSurveyCollection = Backbone.Collection.extend({
    model: ctx.SurveyModel,
    url: function() {
      return ctx.URL("/public-surveys/");
    }
  });
  ctx.DemoSurveyCollection = Backbone.Collection.extend({
    model: ctx.SurveyModel,
    url: function() {
      return ctx.URL("/demo-surveys/");
    }
  });
});
})(jQuery);
