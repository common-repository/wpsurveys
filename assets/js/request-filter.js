(function($) {
  $(() => {
  // var reqType = [
  //   (r'/surveys/(.*)/questions/(.*)/', QuestionController),
  //     (r'/surveys/(.*)/questions/', QuestionController),
  //     (r'/surveys/(.*)/publish', PublishSurveyController),
  //     (r'/surveys/(.*)/finish', FinishSurveyController),
  //     (r'/surveys/(.*)/restart', RestartSurveyController),
  //     (r'/surveys/(.*)/requests',RequestController),
  //     (r'/surveys/(.*)/',SurveyController),
  //     (r'/surveys/',SurveyController),
  //     (r'/question/(.*)/options/(.*)/', OptionController),
  //     (r'/question/(.*)/options/', OptionController),
  //     (r'/u/surveys/(.*)/',UserSurveyController),
  //     (r'/u/option/(.*)/vote',OptionVoteController),
  // ]
  //
  // }

  ctx.RequestParser = function(survey,requests) {
    this.requests = requests;
    this.requests.forEach((req) => {
        req.ts = new Date(req.ts);
    })
    this.survey = survey;
    // [
    //   ctx.RequestParser.regSurveyCreated,
    //   ctx.RequestParser.regSurveyPublished,
    //   ctx.RequestParser.regSurveyRestarted,
    //   ctx.RequestParser.regSurveyFinished,
    //   ctx.RequestParser.regSurveyDeleted,
    //   ctx.RequestParser.regSurveyQuestionEdit,
    //   ctx.RequestParser.regSurveyOptionUserVote,
    //   ctx.RequestParser.regSurveyQuestionCreated,
    //   ctx.RequestParser.regSurveyQuestionDeleted
    // ].forEach((filter) => {
    //   console.log(filter,this.requests.filter((req) => {
    //     return filter.test(req.request);
    //   }).map((req) => req.request));
    // });
  };
  _.extend(ctx.RequestParser.prototype,{
    getRestarts: function() {

    },
    groupPerPeriod: function(from,till,reqs,timeInterval) {
      if (from.ts) {
        from = new Date(from.ts);
      }
      if (till) {
        if (till.ts) {
          till = till.ts;
        }
        till = new Date(till);
      } else {
        till = new Date();
      }
      till = new Date(till).getTime();
      from = new Date(from).getTime();
      let period = parseInt((till - from)/1000/3600);

      if (!timeInterval) {
        if (period < 24) {
          timeInterval = 1000*3600
        } else if (period < 24*7) {
          timeInterval = 1000*3600*4
        } else if (period < 3*24*30) {
          timeInterval = 1000*3600*24;
        } else {
          timeInterval = 1000*3600*24*7;
        }
      }

      let ret = {};
      let ts = Math.floor(from/timeInterval)*timeInterval;
      let endTs = Math.floor(till/timeInterval)*timeInterval;
      if (endTs < ts+10*timeInterval) {
        endTs += 24*timeInterval;
      }
      do {
        ret[ts] = [];
        ts += timeInterval;
      } while (ts < (endTs+timeInterval));

      reqs.forEach((req) => {
        let reqTS = Math.floor(req.ts.getTime()/timeInterval)*timeInterval;
        if (reqTS in ret) {
          ret[reqTS].push(req);
        }
      });
      return ret;
    },
    getActionsForPeriod: function(dateAfter,dateBefore,filters) {
      dateAfter = new Date(dateAfter);
      if (!dateBefore) {
        dateBefore = new Date();
      } else {
        dateBefore = new Date(dateBefore);
      }
      let ret = {};
      filters.forEach((f) => {
        ret[f] = ret[f] || [];
      });
      this.requests.forEach((req) => {
        if (req.ts < dateAfter || req.ts > dateBefore) {
          return;
        }
        filters.forEach((f) => {
          if (f.test(req.request)) {
            ret[f].push(req);
          }
        })
      })
      return ret;
    },
    filterByStatusCode: function(statusCode,reqs) {
      return reqs.filter((req) => {
        return req.status_code === statusCode;
      });
    },
    getEditActions: function() {

    },
    getLastPublish: function() {
      let publishes = this.getPublishes();
      return publishes.shift();
    },
    getPublishes: function() {
      return this.requests.filter((req) => {
        return ctx.RequestParser.regSurveyPublished.test(req.request);
      });
    },
    getFinishes: function() {

    },
  });
  _.extendOwn(ctx.RequestParser,{
    regSurveyCreated: /^POST\:\/surveys\/\?/,
    regSurveyQuestionCreated: /^POST\:\/surveys\/\d+\/questions\/\?/,
    regSurveyQuestionDeleted: /^DELETE\:\/surveys\/\d+\/questions\/\d+\/\?/,
    regSurveyQuestionEdit: /^PUT\:\/surveys\/\d+\/questions\/\d+\/\?/,
    regSurveyPublished: /^POST\:\/surveys\/\d+\/publish\?/,
    regSurveyRestarted: /^POST\:\/surveys\/\d+\/restart\?/,
    regSurveyFinished: /^POST\:\/surveys\/\d+\/finish\?/,
    regSurveyDeleted:  /^DELETE\:\/surveys\/\d+\/\?/,
    regSurveyOptionUserVote: /^POST\:\/u\/option\/\d+\/vote\?/,
  })
});
})(jQuery);
