(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  var QuestionStatTemplate = _.template($("script#question-stat").html());
  var QuestionBarTemplate = _.template($("script#question-bar").html());
  // var SummarySurveyStatsTemplate = _.template($("script#summary-survey-stats").html());
  var SummarySurveyStatsBarTemplate = _.template($("script#summary-survey-stats-bar").html());
  var SurveyStatTemplate = _.template($("script#survey-stat").html());
  // var SurveyStatRawLogTemplate = _.template($("script#survey-stat-log").html());

  const MONTHES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHES_FULL = [
    'January','February','March',
    'April','May','June',
    'Jule','August','September',
    'October','November','December'
  ];
  const TZ_OFFSET = new Date().getTimezoneOffset()*60*1000;

  var appendZeroBefore = function(val) {
    if (val < 10) {
      return "0"+val;
    } else {
      return val.toString();
    }
  }

  var getText = function(t) {
    return $("<div>"+t+"</div>").text();
  };

  var stringifyTimeVals = function(p) {
    p = new Date(parseInt(p)+TZ_OFFSET);
    if (p.getHours() !== 0) {
      return appendZeroBefore(p.getHours()) +":"+appendZeroBefore(p.getMinutes());
    } else if (p.getDate() !== 1 ){
      return MONTHES[p.getMonth()]+"'"+p.getDate();
    } else if (p.getMonth() !== 0 ) {
      return MONTHES_FULL[p.getMonth()];
    } else {
      return p.getFullYear();
    }
  };

  var QuestionStatView = Backbone.View.extend({
    initialize: function() {
      this.render();
    },
    render: function() {
      var options = this.model.get("options");
      var summary = this.model.get("summary");
      options.sort(function(a,b) {
        return a.order - b.order;
      });

      $(QuestionStatTemplate({
        question: this.model,
        options: options,
        summary: summary
      })).appendTo(this.el);

      for(var i = 0; i < options.length; ++i) {
        var opt = options[i];
        var $opt = $(this.el).find(".option[_id="+opt._id+"]");
        $opt.find(".rate").show();
        var percent = opt.votes*100/(summary || 1);
        $opt.find(".rate .bar").css("width",percent+"%");
        $opt.find(".rate .stat").text(Math.floor(percent)+"%");
      }
      if (!this.model.get("image")) {
        $(this.el).addClass("no-image");
      }
      $(this.el).addClass("question-stat");

      var style = false;
      try {
        style = JSON.parse(this.model.get("image_style"))
      } catch(e) {
        style = {};
      }
      style = _.defaults(style,{
        top: 0, left: 0, right: 0, bottom: 0
      });

      var ratio = this.model.survey.get("image_ratio");
      var height = 150;
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

      var self = this;
      options.forEach(function(opt) {
        var oText = $("<div />").html(opt.text).text();
        $(self.el).find("#opt-text-"+opt._id).text(oText);
      });
    }
  });

  ctx.SurveyStatView = Backbone.View.extend({
    initialize: function() {
      this.render();
    },
    events: {
      "click .nav .nav-link": function(ev) {
        this.$nav.find(".nav-link").removeClass("active");
        $(ev.currentTarget).addClass("active");
        $(this.el).find(".stats-page").hide();
        $(this.el).find("#"+$(ev.currentTarget).attr("for")).show();
      }
    },
    render: function() {
      var self = this;
      $(SurveyStatTemplate({})).appendTo(this.el);
      $(this.el).addClass("survey-stat");
      this.$stats = $(this.el).find("#survey-vote-stats");
      this.$history = $(this.el).find("#survey-history");

      this.$nav = $(this.el).find("#stats-nav");

      // this.$rawLogs = $(this.el).find("#raw-logs-lines");

      this.questions = new ctx.QuestionCollection(this.model.get("questions") || []);
      this.questions.comparator = function(a,b) {
        return a.get("order") - b.get("order")
      };
      this.questions.sort();

      this.update();
    },
    update: function() {
      var self = this;
      this.model.requests().then(function(reqs){
        let requests = new (ctx.RequestParser)(self.model,reqs);
        $(new SummaryStatsBar({
          model: self.model,
          requests: requests,
          questions: self.questions
        }).el).appendTo(self.$stats);
        self.questions.each(function(q) {
          q.survey = self.model;
          $(new QuestionStatsBar({
            model: q
          }).el).appendTo(self.$stats);
        });
      //   ret.forEach(function(el) {
      //     $(SurveyStatRawLogTemplate(el)).appendTo(self.$rawLogs).addClass('survey-stat-log');
      //   });
      });
    }
  });

  var SummaryStatsBar = Backbone.View.extend({
    initialize: function(arg) {
      _.extendOwn(this,arg);
      this.render();
    },
    events: {
      "click .stats-collapse": function() {
        $(this.el).toggleClass("collapsed");
      }
    },
    getSummaryVotes: function(q) {
      return q.get("options").reduce(function(votes,o) {
        return votes + o.votes;
      },0);
    },
    getVotesAfterPreviousPublish: function() {
        const publish = this.requests.getLastPublish();
        if (!publish) {
          return this.requests.groupPerPeriod(Date.now(),null,[]);
        }
        const reqFilter = ctx.RequestParser.regSurveyOptionUserVote;
        let votes = this.requests.getActionsForPeriod(publish.ts,null,[reqFilter]);
        votes = this.requests.filterByStatusCode(200,votes[reqFilter]);
        return this.requests.groupPerPeriod(publish,null,votes);
    },
    getPopularAnswersForQuestion: function(q) {
      return q.get("options").reduce(function(popular,o) {
        if (popular.length === 0) {
          popular.push(o);
        } else if (o.votes > 0) {
          if (o.votes > popular[0].votes) {
            popular = [o];
          } else if (o.votes === popular[0].votes) {
            popular.push(o);
          }
        }
        return popular;
      },[]);
    },
    getText: getText,
    render: function() {
      $(SummarySurveyStatsBarTemplate(this)).appendTo(this.el);
      const votesPeriods = this.getVotesAfterPreviousPublish();
      const periods = Object.keys(votesPeriods);
      const votes = periods.map((p,i) => {
        return votesPeriods[p].length;
      });
      this.$timeline = $(this.el).find("#timeline");
      this.timelineChart = new Chart(this.$timeline[0].getContext('2d'),{
        type: 'bar',
        data: {
          labels: periods.map(stringifyTimeVals),
          datasets: [{
            label: "# of votes",
            data: votes,
            backgroundColor: "rgba(0,100,255,.1)",
            borderColor: "rgba(0,100,255,1)",
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              afterBuildTicks: (axis,tick) => {
                tick = tick.filter((val) => {
                  return (parseFloat(val) % 1) == 0;
                });
                return tick;
              },
              afterDataLimits: (axis) => {
                axis.max += Math.ceil(axis.max/10);
              },
              ticks: {
                beginAtZero: true
              }
            }]
          }
         }
      })
    }
  });

  var QuestionStatsBar = Backbone.View.extend({
    initialize: function() {
      this.render();
    },
    events: {
      "click .stats-collapse": function() {
        $(this.el).toggleClass("collapsed");
      }
    },
    render: function() {
      $(QuestionBarTemplate(this)).appendTo(this.el);
      $(this.el).addClass("question-bar collapsed");
      $(new QuestionStatView({
        model: this.model
      }).el).appendTo($(this.el).find(".stats-block-body"));
    },
    getText: getText
  });

  var QuestionFullStats = Backbone.View.extend({
    initialize: function() {
      this.render();
    },
    render: function() {
      // $(SurveyStatTemplate({})).appendTo(this.el);
    }
  });
});
})(jQuery);
