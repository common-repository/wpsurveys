(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  ctx.SurveyModel = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {
      return ctx.URL("/u/surveys/"+this.get("wp_id")+"/");
    }
  });
});
})(jQuery);
