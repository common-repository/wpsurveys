(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  var Question = ctx.QuestionModel;

  var SurveyViewTemplate = _.template($("script#survey-view").html());

  ctx.SurveyView = Backbone.View.extend({
    tagName: "div",
    events: {
      "answered": function(ev) {
        if (this.checkAnswered()) {
          this.createResults();
        }
        this.updateArrows();
      },
      "click .back:not(.fade)": function() {
        this.questionIndex--;
        this.updateArrows();
        this.showQuestion();
      },
      "click .forth:not(.fade)": function() {
        this.questionIndex++;
        this.updateArrows();
        this.showQuestion();
      }
    },
    updateArrows: function() {
      if (this.questionIndex <= 0) {
        this.questionIndex = 0;
        $(this.el).find(".back").addClass("fade");
      } else {
        $(this.el).find(".back").removeClass("fade");
      }
      if (this.answered && this.model.get("is_test")) {
        if (this.questionIndex >= this.questions.length) {
          this.questionIndex = this.questions.length;
          $(this.el).find(".forth").addClass("fade");
        } else {
          $(this.el).find(".forth").removeClass("fade");
        }
      } else {
        var canProceed = !!this.questions.models[this.questionIndex].get("answer");
        if (this.model.get("finished")) {
          canProceed = true;
        }
        if (this.questionIndex >= this.questions.length - 1 || !canProceed) {
          if (this.questionIndex >= this.questions.length) {
            this.questionIndex = this.questions.length - 1;
          }
          $(this.el).find(".forth").addClass("fade");
        } else {
          $(this.el).find(".forth").removeClass("fade");
        }
      }
    },
    initialize: function(arg) {
      this.parentElement = arg.parent;
      this.questionViews = [];
      this.questionIndex = 0;
      this.questions = new ctx.QuestionCollection(this.model.get("questions") || []);
      this.questions.comparator = function(a,b) {
        return a.get("order") - b.get("order")
      };
      this.questions.sort();
      this.answered = true;
      var self = this;
      this.questions.forEach(function(q){
        if (!self.answered) {
          return;
        }
        if (!q.get("answer"))  {
          self.answered = false;
        } else {
          self.questionIndex++;
        }
      });
      if (this.answered)  {
        self.questionIndex = this.questions.length;
      }
      this.render();
    },
    render: function() {
      this.parentElement.innerHTML = "";
      $(SurveyViewTemplate({survey: this.model})).appendTo(this.el);
      var self = this;
      this.questions.each(function(q) {
        q.survey = self.model;
        self.appendQuestionView(q);
      });
      this.showQuestion();
      $(this.el).appendTo(this.parentElement);
      $(this.el).addClass("survey-view");

      if (ctx.isEmpty(this.model.get("title"))){
        $(this.el).find("#survey-title h1").hide();
      }

      if (this.model.get("is_test")) {
        $(this.el).addClass("test");
      }
      if (this.questions.models.length === 1) {
        $(this.el).find(".survey-buttons").hide();
      } else {
        $(this.el).find(".from_questions").text(this.questions.models.length);
      }
      if (!this.model.get("admin_preview")) {
        $(this.el).find(".preview-label").hide();
      }
      if(this.model.get("published")) {
        $(this.el).find(".not-published").hide();
      }
      this.updateArrows();
      if (this.answered && this.model.get("is_test")) {
          this.createResults();
      }
    },
    checkAnswered: function() {
      if (!this.model.get("is_test")) {
        return false;
      }
      var self = this;
      this.answered = true;
      this.questions.forEach(function(q){
        if (!self.answered) {
          return;
        }
        if (!q.get("answer"))  {
          self.answered = false;
        }
      });
      return self.answered;
    },
    createResults: function() {
      if (!this.model.get("is_test")) {
        return false;
      }
      var self = this;
      var rightAnswers = 0;
      this.questions.forEach(function(q) {
        q.survey = self.model;
        var QuestionResultView = ctx.QuestionResultView;
        var view = new QuestionResultView({model: q});
        if (q.get("right_option") == q.get("answer")) {
          rightAnswers++;
        }
        self.questionViews.push(view);
        $(view.el).appendTo($(self.el).find("#survey-results"));
      });
      $(self.el).find("#survey-results-stat .right-answers").text(rightAnswers);
      $(self.el).find("#survey-results-stat .questions-number").text(this.questions.length);
      $(this.el).find(".success-rate .val").text(Math.floor(rightAnswers*100/this.questions.length));
    },
    showQuestion: function() {
      if (this.currentQuestionView) {
        $(this.currentQuestionView.el).hide();
      }
      if (!this.model.get("is_test")) {
        this.questionIndex = this.questionIndex % this.questions.length;
      }
      if (this.questionIndex === this.questions.length && this.answered) {
        $(this.el).find("#survey-results").show();
        $(this.el).find(".success-rate").show();
        $(this.el).find(".question_counter").hide();
      } else {
        $(this.el).find("#survey-results").hide();
        $(this.el).find(".success-rate").hide();
        $(this.el).find(".question_counter").show();
        $(this.el).find(".question_index").text(this.questionIndex+1);
        this.currentQuestionView = this.questionViews[this.questionIndex];
        $(this.currentQuestionView.el).show();
      }
    },
    appendQuestionView: function(q) {
      q.survey = this.model;
      var QuestionView = ctx.QuestionView;
      var view = new QuestionView({model: q});
      this.questionViews.push(view);
      $(view.el).hide();
      $(view.el).appendTo($(this.el).find("#survey-main"));
    }
  });
});
})(jQuery);
