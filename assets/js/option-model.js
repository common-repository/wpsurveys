(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  ctx.OptionModel = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {
      if (!this.question || !this.question.get("_id")) {
        throw new Error("Question of this option is not saved yet");
      }
      var id = this.get("_id");
      return ctx.URL("/question/"+this.question.get("_id")+"/options/"+(id > -1?id+"/":""));
    },
    attributes: {
      "oprder": Number,
      "text": String
    }
  });
  ctx.OptionCollection = Backbone.Collection.extend({
    model: ctx.OptionModel
  });
});
})(jQuery);
