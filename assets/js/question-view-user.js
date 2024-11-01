(function($) {
  $(() => {

  var ctx = window.SurveyContext;

  var showComment = function(isRight) {
    var comment = isRight?this.model.get("comment_right"):this.model.get("comment_wrong");
    if (ctx.isEmpty(comment)) {
      return;
    }
    $(this.el).find(".answer-comment").html(comment);
    $(this.el).find(".answer-comment-container").show();
  };

  var QuestionResultViewTemplate = _.template($("script#question-view-results").html());
  ctx.QuestionResultView = Backbone.View.extend({
    initialize: function() {
      if (!this.model.survey.get("is_test")) {
        return;
      }
      this.options = this.model.get("options");
      this.render();
    },
    showComment: showComment,
    render: function() {
      $(QuestionResultViewTemplate({
        question: this.model
      })).appendTo(this.el);
      var right = _.where(this.options,{
        _id: this.model.get("right_option")
      })[0];
      var your = _.where(this.options,{
        _id: this.model.get("answer")
      })[0];
      if (right === your) {
        $(this.el).find(".option.wrong").remove();
        $(this.el).find(".option.right").html(right.text);
        this.showComment(true);
      } else {
        $(this.el).find(".option.right").html(right.text);
        $(this.el).find(".option.wrong").html(your.text);
        this.showComment(false);
      }

      $(this.el).addClass("question-view-results");
    }
  });

  var QuestionViewTemplate = _.template($("script#question-view").html());
  ctx.QuestionView = Backbone.View.extend({
    initialize: function(arg) {
      this.preview = arg.preview;
      this.render();
    },
    events: {
      "click .option": function(ev) {
        if (this.model.get("answer") !== undefined || this.model.survey.get("finished")) {
          return;
        }
        var self = this;
        var optId = $(ev.currentTarget).attr("_id");
        var surveys = $(this.el).parents(".wps-surveys").get(0);
        ctx.wait(" ",surveys);
        ctx.ajaxPost("/u/option/"+optId+"/vote").then(function(resp) {
          self.model.set("summary",resp.summary);
          for(var i = 0; i < resp.options.length; ++i) {
            var opt = resp.options[i];
            var qOpt = _.where(self.model.attributes.options,{
              _id: opt._id
            })[0];
            qOpt.votes = opt.votes;
          }
          self.model.set("answer",Number(resp.answer));
          $(self.el).addClass("answered");
          self.showResults();
          $(self.el).trigger("answered");
          ctx.stopWaiting(surveys);
        },function(){
          ctx.stopWaiting(surveys);
          console.error(arguments)
        })
      }
    },
    showComment: showComment,
    showResults: function() {
      var summary = this.model.get("summary");
      var options = this.model.get("options");
      var myAnswer = this.model.get("answer");
      for(var i = 0; i < options.length; ++i) {
        var opt = options[i];
        var $opt = $(this.el).find(".option[_id="+opt._id+"]");
        $opt.find(".rate").show();
        var percent = opt.votes*100/(summary || 1);
        $opt.find(".rate .bar").css("width",percent+"%");
        $opt.find(".rate .stat").text(Math.floor(percent)+"%");
        $(this.el).find(".summary .val").text(this.model.get("summary"));
        if (myAnswer == opt._id) {
          $opt.addClass("my-answer");
          if (this.model.survey.get("is_test")) {
            if (this.model.get("right_option") == myAnswer) {
              $opt.addClass("right");
              this.showComment(true);
            } else {
              $opt.addClass("wrong");
              this.showComment(false);
            }
          }
        } else {
          if (this.model.get("right_option") == opt._id) {
            $opt.addClass("right");
          }
          $opt.removeClass("my-answer");
        }
      }
    },
    render: function() {
      var options = this.model.get("options");
      options.sort(function(a,b) {
        return a.order - b.order;
      });
      $(QuestionViewTemplate({
        question: this.model,
        options: options
      })).appendTo(this.el);
      var style = false;
      try {
        style = JSON.parse(this.model.get("image_style"))
      } catch(e) {
        style = {};
      }
      style = _.defaults(style,{
        top: 0, left: 0, right: 0, bottom: 0
      });
      $(this.el).find(".summary .val").text(this.model.get("summary") || 0);
      if (this.model.get("image")) {
        var ratio = this.model.survey.get("image_ratio");
        var height = this.model.survey.get("image_height");
        var scale = 1/(1 - style.right - style.left);
        var backSize = 100*scale;
        $(this.el).find("#image").css({
          height: height+"px",
          width: (height*ratio)+"px"
        });
        var top = (scale-1)*50-scale*style.top*100;
        var left = (scale-1)*50-style.left*scale*100;
        $(this.el).find("#image img").css({
          transform: "translate("+left+"%,"+top+"%) scale("+scale+")"
        });
      } else {
        $(this.el).find("#image-container").hide();
      }
      if (!this.preview && (this.model.get("answer") !== undefined || this.model.survey.get("finished"))) {
        $(this.el).addClass("answered");
        this.showResults();
      }
      $(this.el).addClass("question-view");
    }
  });
});
})(jQuery);
