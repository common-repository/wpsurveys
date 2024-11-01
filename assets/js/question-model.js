(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  ctx.QuestionModel = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {
      if (!this.survey || !this.survey.get("_id")) {
        throw new Error("Survey of question is not saved yet");
      }
      var id = this.get("_id");
      return ctx.URL("/surveys/"+this.survey.get("_id")+"/questions/"+((id > -1)?id+"/":""));
    },
    isAnswered: function() {
      return this.get("answer");
    },
    isAnsweredRight: function() {
      return this.get("answer") == this.get("right_option");
    },
    attributes: {
      "oprder": Number,
      "text": String
    },
    addOption: function(option) {
      var options = this.get("options");
      var existFlag = false;
      options = options.map(function(opt) {
        if (opt._id === option._id) {
          existFlag = true;
          return option;
        } else {
          return opt;
        }
      });
      if (!existFlag) {
        options = [option].concat(options);
      }
      this.set("options",options);
    },
    deleteOption: function(optionId) {
      var options = this.get("options");
      this.set("options",options.filter(function(o){
        return o._id != optionId;
      }));
    },
  });
  ctx.QuestionCollection = Backbone.Collection.extend({
    model: ctx.QuestionModel
  });
});
})(jQuery);
