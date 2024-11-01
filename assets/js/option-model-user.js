(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  ctx.OptionModel = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {},
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
