(function($) {
  $(() => {
  var ctx = window.SurveyContext;

  var ListItemView = ctx.SurveyListItemView;
  var PublicListItemView = ctx.PublicSurveyListItemView;
  var ParamsView = ctx.SurveyParamsView;

  var $listPage = $(".wps-surveys .wps-page#list");
  var $editPage = $(".wps-surveys .wps-page#edit");
  var $statPage = $(".wps-surveys .wps-page#stat");
  var $aboutPage = $(".wps-surveys .wps-page#about");

  var showPage = function(el) {
    el.siblings().hide();
    el.show();
  };

  $(".wps-surveys .wps-back").click(function() {
    showPage($listPage);
  });

  var adminPath = document.location.toString();
  var pageLink = adminPath.substring(adminPath.indexOf(document.location.pathname)+document.location.pathname.length);

  $("a[href*='"+pageLink+"']").click(function(ev){
    ev.stopPropagation();
    ev.preventDefault();
    ctx.showFullList();
    return false;
  });

  showPage($listPage);

  var $privateSurveyContainer = $(".wps-surveys #private-surveys-list");
  var $privateSurveyList = $(".wps-surveys #private-surveys-list #private-list");
  var $privateEmptyList = $(".wps-surveys #private-surveys-list #private-list #empty_list");
  var $publicAndDemoSurveyContainer = $(".wps-surveys #public-and-demo-surveys-list");
  var $demoSurveyList = $(".wps-surveys #public-and-demo-surveys-list #demo-list");
  var $demoEmptyList = $(".wps-surveys #public-and-demo-surveys-list #demo-list #empty_list");
  var $publicSurveyList = $(".wps-surveys #public-and-demo-surveys-list #public-list");
  var $publicEmptyList = $(".wps-surveys #public-and-demo-surveys-list #public-list #empty_list");
  var $surveyParams = $(".wps-surveys #block_survey_view");

  $publicAndDemoSurveyContainer.hide();

  var selectedSurveyView = false;

  var showFullList = function() {
    privateItemViews.forEach(function(view) {
      $(view.el).hide();
    });
    $editPage.hide();
    $statPage.hide();
  }

  ctx.showFullList = function() {
    showPage($listPage);
    ctx.updateHrefHash();
  }
  ctx.surveyStat = function(model) {
    if (selectedSurveyView) {
      selectedSurveyView.remove();
    }
    selectedSurveyView = new (ctx.SurveyStatView)({model: model});
    $(selectedSurveyView.el).appendTo($surveyParams);
    showPage($editPage);
    ctx.navigation.showStatistics(model);
  }
  ctx.editSurvey = function(model) {
    $(".wps-surveys .wps-filter").find("#all").click();
    if (selectedSurveyView) {
      selectedSurveyView.remove();
    }
    selectedSurveyView = new ParamsView({model: model});
    $(selectedSurveyView.el).appendTo($surveyParams);
    showPage($editPage);
    ctx.navigation.setSurvey(model);
  };

  var privateItemViews = [];
  ctx.surveys = new (ctx.SurveyCollection)();
  // ctx.publicSurveys = new (ctx.PublicSurveyCollection)();
  ctx.demoSurveys = new (ctx.DemoSurveyCollection)();
  ctx.surveys.comparator = function(a,b) {
      return new Date(a.get("created")) > new Date(b.get("created"))?1:-1;
  };
  var surveysPerStatus = _.debounce(function() {
    var drafts = 0;
    var published = 0;
    var finished = 0;
    ctx.surveys.each(function(model,i) {
      if (!model.get("published") && !model.get("finished")) {
        drafts++;
      } else if (model.get("published") && !model.get("finished")) {
        published++;
      } else {
        finished++;
      }
    });
    $(".wps-surveys .wps-filter #all span.val").text(ctx.surveys.length);
    $(".wps-surveys .wps-filter #draft span.val").text(drafts);
    $(".wps-surveys .wps-filter #published span.val").text(published);
    $(".wps-surveys .wps-filter #finished span.val").text(finished);
    $(".wps-surveys .wps-filter #public_and_demo span.val").text(/*ctx.publicSurveys.length+*/ctx.demoSurveys.length);
  //  $(".wps-surveys .wps-filter .selected").click();
  },100);

  var bindListItem = function(listItem,model) {
    listItem.on("selected",function(){
      ctx.editSurvey(model);
    });
    listItem.on("stat",function(){
      ctx.surveyStat(model);
    })
  }

  // var publicItemViews = [];
  // ctx.publicSurveys.on("update",function() {
  //   publicItemViews.forEach(function(view) {
  //     view.remove();
  //   });
  //   publicItemViews = [];
  //   $publicEmptyList.show();
  //   ctx.publicSurveys.each(function(model,i) {
  //       $publicEmptyList.hide();
  //       var newLi = new PublicListItemView({model: model})
  //       $publicSurveyList.prepend(newLi.el);
  //       publicItemViews.push(newLi);
  //       bindListItem(newLi,model);
  //   });
  //   surveysPerStatus();
  // });

  var demoItemViews = [];
  ctx.demoSurveys.on("update",function() {
    demoItemViews.forEach(function(view) {
      view.remove();
    });
    demoItemViews = [];
    $demoEmptyList.show();
    ctx.demoSurveys.each(function(model,i) {
        $demoEmptyList.hide();
        var newLi = new PublicListItemView({model: model})
        $demoSurveyList.prepend(newLi.el);
        demoItemViews.push(newLi);
        bindListItem(newLi,model);
    });
    surveysPerStatus();
  });

  ctx.surveys.on("update",function() {
    privateItemViews.forEach(function(view) {
      view.remove();
    });
    privateItemViews = [];

    ctx.surveys.each(function(model,i) {
        $privateEmptyList.hide();
        var newLi = new ListItemView({model: model})
        $privateSurveyList.prepend(newLi.el);
        privateItemViews.push(newLi);
        bindListItem(newLi,model);
        newLi.on("updated",function() {
          surveysPerStatus();
        });
    });
    surveysPerStatus();
  });

  $(".wps-surveys .wps-filter").find("#finished, #all, #draft, #published, #public_and_demo").click(function(ev) {
    $(ev.currentTarget).addClass("selected").siblings().removeClass("selected");
  });

  $(".wps-surveys .wps-filter").find("#public_and_demo").click(function(ev) {
    ctx.demoSurveys.fetch();
    $publicAndDemoSurveyContainer.show();
    $privateSurveyContainer.hide();
  });

  $(".wps-surveys .wps-filter").find("#finished, #all, #draft, #published").click(function(ev) {
    $publicAndDemoSurveyContainer.hide();
    $privateSurveyContainer.show();
    var id = ev.currentTarget.id;
    var $toShow;
    if(id === "all") {
      $toShow = $privateSurveyList.children().not($privateEmptyList);
    } else {
      $toShow = $privateSurveyList.find("tr[status^='"+id+"']");
    }
    $toShow.each(function(i,el) {
      $(el).find("td:first-child").text(i+1);
    })
    $toShow.show();
    $privateSurveyList.children().not($toShow).hide();
    if ($toShow.length === 0) {
      $privateEmptyList.show();
    } else {
      $privateEmptyList.hide();
    }
  });

  ctx.surveys.fetch({
    success: function() {
      ctx.stopWaiting();
      if (ctx.surveys.models.length == 0) {
        $(".wps-surveys .wps-filter").find("#public_and_demo").click();
      }
      // ctx.publicSurveys.fetch();
      ctx.demoSurveys.fetch();
      var current = ctx.surveys.where({
        wp_id: ctx.getCurrentSurvey()
      })[0];
      if (current) {
        ctx.editSurvey(current);
      }
    },
    error: function() {
  		$.post( ajaxurl, { action: 'survey_register' } , function(resp) {
        try {
          var ret = JSON.parse(resp);
          if (ret.status === "OK") {
            ctx.surveys.fetch({
              success: function() {
                ctx.stopWaiting();
              }
            });
          }
        } catch(e) {
          console.error(e);
        }
  		});
    }
  });

});
})(jQuery);
