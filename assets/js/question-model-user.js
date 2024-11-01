(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  ctx.QuestionModel = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {},
    attributes: {
      "oprder": Number,
      "text": String
    }
  });
  ctx.QuestionCollection = Backbone.Collection.extend({
    model: ctx.QuestionModel
  });
});
})(jQuery);
