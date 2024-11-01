(function($) {
  $(() => {
  var ctx = window.SurveyContext;

  var ATTR = "wps-surveys";
  $(function() {
    $("["+ATTR+"]").each(function(i,el) {
      $(el).addClass("wps-surveys loading");
      var $wpsBody = $("<div class='wps-body' />").appendTo(el);
      $("<div class='load-glass' />").appendTo(el);
      var name = $(el).attr(ATTR);
      var s = new (ctx.SurveyModel)({
        "wp_id": name
      });
      s.fetch({
        success: function() {
          ctx.stopWaiting(el);
          $(el).removeClass("loading");
          new (ctx.SurveyView)({
            model: s,
            parent: $wpsBody.get(0)
          });
        },
        error: function() {
          ctx.stopWaiting(el);
          $(el).removeClass("loading");
          el.innerHTML = "Can't load survey '"+name+"'";
        }
      });
      setTimeout(function(){
        ctx.wait(" ",el);
      },1);
    });
  })
});
})(jQuery);
