(function($) {
  $(() => {
  var ctx = window.SurveyContext;
  var ImageRatioHelperTemplate = _.template($("script#ratio-helper").html());
  var ratioPrecision = 1000;
  var round = function(val,part) {
    return Math.round(val*part)/part;
  }
  var wrapRatioChange = function(self,cb) {
    if (self.handleImageRatio) {
      return;
    }
    self.handleImageRatio = Math.floor(Math.random()*100000);
    $(self.parentElement).addClass("ratio");
    var imageOffset = self.parentElement.offset();
    var prevX = false, prevY = false, xDiff = false, yDiff = false;
    $(document).on("mousemove."+self.handleImageRatio,function(ev){
      var x = ev.pageX - imageOffset.left, y = ev.pageY - imageOffset.top;
      if (prevX !== false) {
        xDiff = x-prevX;
        yDiff = y-prevY;
        prevX = x;
        prevY = y;
      } else {
        prevX = x;
        prevY = y;
        return;
      }
      var lastChange = false;
      if (x < 0) {
        x = 0;
        lastChange = true;
      }
      if (x > self.imageWidth) {
        x = self.imageWidth;
        lastChange = true;
      }
      if (y < 0) {
        y = 0;
        lastChange = true;
      }
      if (y > self.imageHeight) {
        y = self.imageHeight;
        lastChange = true;
      }
      if (lastChange && self.lastChangeForOutbound) {
        return;
      }
      self.lastChangeForOutbound = lastChange;
      cb(xDiff,yDiff);
    });
    $(document).one("mouseup",function() {
      $(document).off("mousemove."+self.handleImageRatio);
      self.handleImageRatio = null;
      $(self.parentElement).removeClass("ratio");
    });
  };

  var getNewImageSize = function(self,newWidth,newHeight,maxWidth,maxHeight,ratio,xVSy) {
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
    }
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }
    if (xVSy) {
      newHeight = newWidth/ratio;
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight*ratio;
      }
    } else {
      newWidth = newHeight*ratio;
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth/ratio;
      }
    }
    return {
      newWidth: newWidth,
      newHeight: newHeight
    };
  }

  ctx.ImageRatioHelper = Backbone.View.extend({
    initialize: function(arg) {
      this.parentElement = arg.parentElement;
      this.ratioXInput = arg.ratioXInput;
      this.ratioYInput = arg.ratioYInput;
      this.freezeInput = arg.freezeInput;
      var parentRemove = arg.parentView.remove;
      var self = this;
      arg.parentView.remove = function() {
        self.remove();
        parentRemove.apply(this,arguments);
      }
      this.render();
    },
    events: {
      "mousedown .position-window": function(ev){
        var self = this;
        this.setImageSize();
        var ratio = parseFloat(this.ratioXInput.val())/parseFloat(this.ratioYInput.val());
        wrapRatioChange(this,function(xDiff,yDiff){
          var top = self.imagePositionTop,
              left = self.imagePositionLeft,
              right = self.imagePositionRight,
              bottom = self.imagePositionBottom;
          if (top + yDiff/self.imageHeight > 0 && bottom - yDiff/self.imageHeight > 0) {
            top += yDiff/self.imageHeight;
            bottom -= yDiff/self.imageHeight;
          }
          if (left + xDiff/self.imageWidth > 0 && right - xDiff/self.imageWidth > 0) {
            left += xDiff/self.imageWidth;
            right -= xDiff/self.imageWidth;
          }
          self.setImagePosition(top,left,right,bottom);
        });
      },
      "mousedown .handle": function(ev) {
        this.setImageSize();
        var ratio = parseFloat(this.ratioXInput.val())/parseFloat(this.ratioYInput.val());
        var el = $(ev.currentTarget);
        var self = this;
        wrapRatioChange(this,function(xDiff,yDiff){
          var newHeight = self.imageHeight, newWidth = self.imageWidth;
          var top = self.imagePositionTop,
              left = self.imagePositionLeft,
              right = self.imagePositionRight,
              bottom = self.imagePositionBottom;
          if (el.hasClass("left-top")) {
            x = self.imagePositionLeft*self.imageWidth + xDiff;
            y = self.imagePositionTop*self.imageHeight + yDiff;
            if (self.freezeInputState) {
              var maxWidth = (1-self.imagePositionRight)*self.imageWidth;
              var maxHeight = (1-self.imagePositionBottom)*self.imageHeight;
              newWidth = (1-self.imagePositionRight)*self.imageWidth - x;
              newHeight = (1-self.imagePositionBottom)*self.imageHeight - y;
              var n = getNewImageSize(self,newWidth,newHeight,maxWidth,maxHeight,ratio,Math.abs(xDiff) >= Math.abs(yDiff));
              y = (1-self.imagePositionBottom)*self.imageHeight - n.newHeight;
              x = (1-self.imagePositionRight)*self.imageWidth - n.newWidth;
            }
            top = y/self.imageHeight;
            left = x/self.imageWidth;
          } else if (el.hasClass("right-top")) {
            x = (1-self.imagePositionRight)*self.imageWidth + xDiff;
            y = self.imagePositionTop*self.imageHeight + yDiff;
            if (self.freezeInputState) {
              var maxWidth = (1-self.imagePositionLeft)*self.imageWidth;
              var maxHeight = (1-self.imagePositionBottom)*self.imageHeight;
              newWidth = x - self.imagePositionLeft*self.imageWidth;
              newHeight = (1-self.imagePositionBottom)*self.imageHeight - y;
              var n = getNewImageSize(self,newWidth,newHeight,maxWidth,maxHeight,ratio,Math.abs(xDiff) >= Math.abs(yDiff));
              x = self.imagePositionLeft*self.imageWidth + n.newWidth;
              y = (1-self.imagePositionBottom)*self.imageHeight - n.newHeight;
            }
            top = y/self.imageHeight;
            right = (self.imageWidth-x)/self.imageWidth;
          } else if (el.hasClass("right-bottom")) {
            x = (1-self.imagePositionRight)*self.imageWidth + xDiff;
            y = (1-self.imagePositionBottom)*self.imageHeight + yDiff;
            if (self.freezeInputState) {
              var maxWidth = (1-self.imagePositionLeft)*self.imageWidth;
              var maxHeight = (1-self.imagePositionTop)*self.imageHeight;
              newWidth = x - self.imagePositionLeft*self.imageWidth;
              newHeight = y - self.imagePositionTop*self.imageHeight;
              var n = getNewImageSize(self,newWidth,newHeight,maxWidth,maxHeight,ratio,Math.abs(xDiff) >= Math.abs(yDiff));
              x = self.imagePositionLeft*self.imageWidth + n.newWidth;
              y = self.imagePositionTop*self.imageHeight + n.newHeight;
            }
            right = (self.imageWidth-x)/self.imageWidth;
            bottom = (self.imageHeight-y)/self.imageHeight;
          } else if (el.hasClass("left-bottom")) {
            x = self.imagePositionLeft*self.imageWidth + xDiff;
            y = (1-self.imagePositionBottom)*self.imageHeight + yDiff;
            if (self.freezeInputState) {
              var maxWidth = (1-self.imagePositionRight)*self.imageWidth;
              var maxHeight = (1-self.imagePositionTop)*self.imageHeight;
              newWidth = (1 - self.imagePositionRight)*self.imageWidth - x;
              newHeight = y - self.imagePositionTop*self.imageHeight;
              var n = getNewImageSize(self,newWidth,newHeight,maxWidth,maxHeight,ratio,Math.abs(xDiff) >= Math.abs(yDiff));
              x = (1 - self.imagePositionRight)*self.imageWidth - n.newWidth;
              y = self.imagePositionTop*self.imageHeight + n.newHeight;
            }
            left = x/self.imageWidth;
            bottom = (self.imageHeight-y)/self.imageHeight;
          }
          self.setImagePosition(top,left,right,bottom);
        });
      }
    },
    render: function() {
      var self = this;
      $(ImageRatioHelperTemplate({})).appendTo(this.el);
      $(this.el).addClass("ratio-helper").appendTo(this.parentElement);

      this.ratioLeftBack = $(this.el).find(".left");
      this.ratioRightBack = $(this.el).find(".right");
      this.ratioTopBack = $(this.el).find(".top");
      this.ratioBottomBack = $(this.el).find(".bottom");
      this.ratioLeftTop = $(this.el).find(".left-top");
      this.ratioRightTop = $(this.el).find(".right-top");
      this.ratioRightBottom = $(this.el).find(".right-bottom");
      this.ratioLeftBottom = $(this.el).find(".left-bottom");
      this.ratioWindow = $(this.el).find(".position-window");

      this.setImageSize();
      self.freezeInputState = true;
      $(this.ratioXInput).add(this.ratioYInput).on("input",function(ev) {
        self.freezeInputState = true;
        $(self.freezeInput).attr("checked","checked");
        self.updateRatio(ev);
        self.setRatio();
      });
      $(this.freezeInput).on("change",function(ev){
        self.freezeInputState = $(self.freezeInput).filter(":checked").length !== 0;
      })
    },
    setImageSize: function( ) {
      this.imageWidth = this.parentElement.find("#image-el").width();
      this.imageHeight = this.parentElement.find("#image-el").height();
    },
    setRatio: function() {
      var x = parseFloat($(this.ratioXInput).val()) || 1;
      var y = parseFloat($(this.ratioYInput).val()) || 1;
      this.setImageSize();
      var new_height = this.imageHeight;
      var new_width = this.imageWidth;
      var left = 0, right = 0, bottom = 0, top = 0;
      if (x > y) {
        new_height = this.imageWidth*y/x;
      } else {
        new_width = this.imageHeight*x/y;
      }
      if (new_width > this.imageWidth) {
        new_width = this.imageWidth;
        new_height = this.imageWidth*y/x;
      }
      if (new_height > this.imageHeight) {
        new_height > this.imageHeight;
        new_width = this.imageHeight*x/y;
      }
      bottom = top = (this.imageHeight - new_height)/this.imageHeight/2;
      left = right = (this.imageWidth - new_width)/this.imageWidth/2;
      this.setImagePosition(top,left,right,bottom);
    },
    updateRatio: function(ev) {
      var dotFlag = false;
      var val = $(ev.currentTarget).val().split("").filter(function(l){
        if (l === ".") {
          if (dotFlag) {
            return false;
          }
          dotFlag = true;
          return true;
        } else {
          return /\d/.test(l);
        }
      }).join("");
      val = val.replace(/^0+/g,"0");
      if (val[0] === "0" && val[1] !== ".") {
        val = val.substring(1);
      }
      $(ev.currentTarget).val(val || 0);
    },
    setImagePosition: function(top,left,right,bottom) {
      if (top < 0) { top = 0; }
      if (top > 1) { top = 1; }
      if (left < 0) { left = 0; }
      if (left > 1) { left = 1; }
      if (right < 0) { right = 0; }
      if (right > 1) { right = 1; }
      if (bottom < 0) { bottom = 0; }
      if (bottom > 1) { bottom = 1; }

      this.imagePositionTop = top;
      this.imagePositionLeft = left;
      this.imagePositionRight = right;
      this.imagePositionBottom = bottom;

      if (top >= (1-bottom) || left >= (1-right)) {
        return;
      }

      this.ratioLeftTop.css({
        left: round(this.imagePositionLeft*100,10) + "%",
        top: round(this.imagePositionTop*100,10) + "%"
      });
      this.ratioRightTop.css({
        right: round(this.imagePositionRight*100,10) + "%",
        top: round(this.imagePositionTop*100,10) + "%"
      });
      this.ratioLeftBottom.css({
        left: round(this.imagePositionLeft*100,10) + "%",
        bottom: round(this.imagePositionBottom*100,10) + "%"
      });
      this.ratioRightBottom.css({
        right: round(this.imagePositionRight*100,10) + "%",
        bottom: round(this.imagePositionBottom*100,10) + "%"
      });
      this.ratioLeftBack.css({
        top: round((this.imagePositionTop)*100,10) + "%",
        bottom: round((this.imagePositionBottom)*100,10) + "%",
        right: round((1-this.imagePositionLeft)*100,10) + "%"
      });
      this.ratioRightBack.css({
        top: round((this.imagePositionTop)*100,10) + "%",
        bottom: round((this.imagePositionBottom)*100,10) + "%",
        left: round((1-this.imagePositionRight)*100,10) + "%"
      });
      this.ratioTopBack.css({
        bottom: round((1-this.imagePositionTop)*100,10) + "%",
      });
      this.ratioBottomBack.css({
        top: round((1-this.imagePositionBottom)*100,10) + "%",
      });

      this.ratioWindow.css({
        top: round(this.imagePositionTop*100,10) + "%",
        left: round(this.imagePositionLeft*100,10) + "%",
        right: round(this.imagePositionRight*100,10) + "%",
        bottom: round(this.imagePositionBottom*100,10) + "%",
      });

      var ratioX = (1-right-left)*this.imageWidth;
      var ratioY = (1-top-bottom)*this.imageHeight;

      if (!this.freezeInputState) {
        var ratio = ratioX/ratioY;
        if (ratio > 1) {
          this.ratioXInput.val(round(ratio,ratioPrecision));
          this.ratioYInput.val(1);
        } else {
          this.ratioXInput.val(1);
          this.ratioYInput.val(round(1/ratio,ratioPrecision));
        }
      }
      if (!this.blockEvent) {
        this.trigger("updated");
      }
    },
    updateImage: function(ratio,position) {
      if (ratio > 1) {
        this.ratioXInput.val(round(ratio,ratioPrecision));
        this.ratioYInput.val(1);
      } else {
        this.ratioXInput.val(1);
        this.ratioYInput.val(round(1/ratio,ratioPrecision));
      }
      this.setImageSize();
      var prevRatioState = this.freezeInputState;
      this.freezeInputState = true;
      var ratioX = (1-position.right-position.left)*this.imageWidth;
      var ratioY = (1-position.bottom-position.top)*this.imageHeight;
      var ratio = round(ratio,ratioPrecision);
      var ratioXY = round(ratioX/ratioY,ratioPrecision);
      if (ratio !==ratioXY) {
        this.setRatio();
      } else {
        this.setImagePosition(position.top,position.left,position.right,position.bottom);
      }
      this.freezeInputState = prevRatioState;
    },
    getImagePosition: function() {
      return {
        top: this.imagePositionTop,
        bottom: this.imagePositionBottom,
        left: this.imagePositionLeft,
        right: this.imagePositionRight
      }
    },
    getRatio: function() {
      var ratioX = (1-this.imagePositionRight-this.imagePositionLeft)*this.imageWidth;
      var ratioY = (1-this.imagePositionBottom-this.imagePositionTop)*this.imageHeight;
      return ratioX/ratioY;
    }
  });

});
})(jQuery);
