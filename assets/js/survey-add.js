(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  var Survey = ctx.SurveyModel;

  ctx.getNewSurveyId = function() {
    var c = 1;
    while (ctx.surveys.where({
      "wp_id": "survey-"+c
    }).length > 0) {
      c++;
    }
    return { counter: c, wp_id: "survey-"+c };
  };
  $(".wps-surveys").delegate(".wps-add-survey","click",function(ev) {
    ctx.wait("Creating new survey");
    var newWPId = ctx.getNewSurveyId();
    var s = new Survey({
      title: "Survey #"+newWPId.counter,
      wp_id: newWPId.wp_id,
      public: false,
      theme: "default",
      questions: [],
      _tempId_: ctx.getTempId()
    });
    s._new_= true;
    s.save(null,{
      success: function() {
        ctx.stopWaiting();
        ctx.surveys.add(s);
        ctx.editSurvey(s);
      }
    });
  });
});
})(jQuery);
