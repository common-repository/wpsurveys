(function($) {
  $(() => {
  var ctx = window.SurveyContext;

  var AdminBreadcrumbs = _.template($("script#admin-breadcrumbs").html());

  ctx.BreadCrumbsView = Backbone.View.extend({
    initialize: function(arg) {
      this.parentEl = arg.parentEl;
      this.render();
    },
    events: {
        "click #list": "goToSurveyList",
        "click #survey": function() {
          ctx.editSurvey(this.survey);
        }
    },
    render: function() {
      $(AdminBreadcrumbs({})).appendTo(this.el);
      $(this.el).addClass("admin-breadcrumbs").appendTo(this.parentEl);
      this.$list = $(this.el).find("#list");
      this.$survey = $(this.el).find("#survey");
      this.$subpage = $(this.el).find("#survey-subpage");
      this.$saved = $(this.el).find(".saved");
    },
    updateCrumbs: function() {
      this.$survey.find(".val").text(this.survey.get("wp_id")+" ("+(this.survey.get("is_test")?"test":"questionary")+")");
      this.$survey.show();
      if (this.page) {
        this.$subpage.show();
        this.$subpage.find(".val").text(this.page);
      } else {
        this.$subpage.hide();
      }
    },
    showStatistics: function(m) {
        return this.setSurvey(m,"statistics");
    },
    showPreview: function(m) {
        return this.setSurvey(m,"preview");
    },
    setSurvey: function(m,page) {
      if (this.survey) {
        this.stopListening(this.survey,"change:wp_id");
        this.stopListening(this.survey,"sync");
        this.stopListening(this.survey,"change:is_test");
      }
      this.survey = m;
      var self = this;
      this.listenTo(this.survey,"change:is_test",function() {
        self.updateCrumbs();
      });
      this.listenTo(this.survey,"change:wp_id",function() {
        self.updateCrumbs();
      });
      this.listenTo(this.survey,"sync",function() {
        clearTimeout(self.savedFadeoutTimeout);
        self.savedFadeoutTimeout = setTimeout(function() {
          self.$saved.removeClass("flash");
        },3000);
        self.$saved.addClass("flash");
      });
      this.page = page;
      this.updateCrumbs();
      if (this.page) {
        this.$survey.removeClass("active");
        this.$list.removeClass("active");
        this.$subpage.addClass("active");
      } else {
        this.$survey.addClass("active");
        this.$list.removeClass("active");
        this.$subpage.removeClass("active");
      }

    },
    goToSurveyList: function() {
      this.survey = null;
      this.$list.addClass("active");
      ctx.showFullList();
      this.$survey.hide();
      this.$subpage.hide();
    }
  });

  ctx.navigation = new (ctx.BreadCrumbsView)({
    parentEl: $(".wps-surveys #navigation")
  });
});
})(jQuery);
