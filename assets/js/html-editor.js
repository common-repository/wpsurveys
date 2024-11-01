(function($) {
$(() => {
  var ctx = window.SurveyContext;
  var HtmlEditorTemplate = _.template($("script#html-editor").html());
  var HtmlEditor = Backbone.View.extend({
    events: {
      "mousedown .html-editor-input": "focus"
    },
    initialize: function(arg) {
      this.input = arg.input;
      this.$inputContainer = $(this.input).parent();
      if (this.$inputContainer.hasClass("html-editor-container")) {
        return;
      }
      this.change = arg.change;
      this.parentView = arg.view;
      var remove = this.parentView.remove;
      var self = this;
      this.parentView.remove = function() {
        self.remove();
        remove.apply(self.parentView,arguments);
      }
      this.render();
    },
    render: function () {
      this.$inputContainer.addClass("html-editor-container");
      $(HtmlEditorTemplate({})).appendTo(this.el);
      $(this.el).addClass("html-editor");
      $(this.el).appendTo(this.$inputContainer);
      this.$inputEl = $(this.el).find(".html-editor-input");
      var val = this.sanitize($(this.input).val());
      this.prevVal = val;
      this.$inputEl.html(val);
    },
    focus: function() {
      if (this.$inputContainer.parents(".published").length > 0 ||
          this.$inputContainer.parents(".finished").length > 0) {
        return;
      }
      this.$inputContainer.addClass("focus");
      this.$inputEl.hide();
      $(this.input).show();
      $(this.input).richText({
        heading: false,
        table: false,
        imageUpload: false,
        fileUpload: false,
        videoEmbed: false,
        urls: false,
        code: true
      });
      var self = this;
      this.currentEvId = Math.floor(Math.random()*Math.pow(2,32));
      $(window).on("mousedown."+this.currentEvId,function(ev) {
        if ($(ev.target).parents(".html-editor-container").get(0) !== self.$inputContainer.get(0)) {
          self.blur();
        }
      });
      setTimeout(function() {
        var f = _.debounce(function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          self.update();
        },100);
        self.input = self.$inputContainer.find("[html-editor]").get(0);
        self.$inputContainer.find(".richText .richText-editor").on("keyup",f);
        self.$inputContainer.find(".richText .richText-initial").on("keyup",f);
        self.$inputContainer.find(".richText").on("mouseup",_.debounce(function() {
          self.update();
        },100));
      },1);
    },
    blur: function () {
      $(window).off("mousedown."+this.currentEvId);
      this.$inputContainer.find("[html-editor]").off("input."+this.currentEvId);
      this.$inputContainer.removeClass("focus");
      $(this.input).unRichText();
      this.update();
      this.$inputEl.show();
      $(this.input).hide();
    },
    sanitize: function(val) {
      return val.replace(/<\s*script.*?>/g,"")
                .replace(/<\s*\/\s*script.*?>/g,"")
                .replace(/<\s*style.*?>/g,"")
                .replace(/<\s*\/\s*style.*?>/g,"")
                .replace(/^\s+/g,"").replace(/\s+$/g,"");
    },
    update: function() {
      var val = this.sanitize($(this.input).val());
      if (val === this.prevVal) {
        return;
      }
      this.prevVal = val;
      $(this.input).val(val);
      this.$inputEl.html(val);
      if (this.change) {
        this.change();
      } else {
        $(this.input).trigger("input");
      }
    }
  });

  ctx.addHTMLEditorFields = function(view,change) {
    $(view.el).find("[html-editor]").each(function(i,el) {
      new HtmlEditor({
        input: el,
        view: view,
        change: change
      });
    });
  };
});
})(jQuery);
