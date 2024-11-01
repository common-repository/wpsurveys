(function($) {
  $(() => {
  window.SurveyContext = window.SurveyContext || {};
  var ctx = window.SurveyContext;

  var tempIdCounter = 0;

  ctx.wait = function(text,el) {
    var $wps = $(el || ".wps-surveys");
    $wps.addClass("waiting");
    $wps.children(".load-glass").text(text || "Waiting something");
  };

  ctx.stopWaiting = function(el) {
    $(el || ".wps-surveys").removeClass("waiting");
  };

  ctx.getTempId = function() {
    return Date.now() + "_"+(tempIdCounter++);
  };

  var internetConnectionFlashTimeout = null;
  ctx.handleInternetConnection = function(addr,e) {
    console.error(addr,e);
    $(".wps-surveys .internet-issue").addClass("flash");
    clearInterval(internetConnectionFlashTimeout);
    internetConnectionFlashTimeout = setTimeout(function() {
      $(".wps-surveys .internet-issue").removeClass("flash");
    },3000);
  };

  ctx.selected = {};

  ctx.copyToClipboard = function(str) {
    var txt = document.createElement("textarea");
    txt.style.position = 'fixed';
    txt.style.left = "-9999999px";
    document.body.appendChild(txt);
    txt.value = str;
    txt.select();
    var stat = document.execCommand('copy');
    document.body.removeChild(txt);
  }

  var lastSurvey, lastQuestion;

  var _updateHrefHash = function() {
    var hash = encodeURIComponent(lastSurvey.get("wp_id"))+"/";
    if (lastQuestion) {
      hash += encodeURIComponent(lastQuestion.get("wp_id"));
    }
    document.location.hash = hash;
  }

  ctx.updateHrefHash = function(survey,question) {
    lastSurvey && lastSurvey.off("change:wp_id",_updateHrefHash);
    lastQuestion && lastQuestion.off("change:wp_id",_updateHrefHash);
    if (!survey) {
      document.location.hash = '';
      return;
    }
    lastSurvey = survey;
    lastQuestion = question;
    survey.on("change:wp_id",_updateHrefHash);
    question && question.on("change:wp_id",_updateHrefHash);
    _updateHrefHash();
  };

  ctx.getCurrentSurvey = function() {
    return document.location.hash.replace(/^#/,"").split("/")[0] || undefined;
  }

  ctx.getCurrentQuestion = function() {
    return document.location.hash.replace(/^#/,"").split("/")[1] || undefined;
  }

  var updateCORSOptions = function(options) {
      options = options || {};
      options.crossDomain = true;
      // options.xhrFields = options.xhrFields || {};
      // options.xhrFields.withCredentials = true;
      options.headers = options.headers || {};
      options.headers['Survey-Origin'] = ctx.SURVEY_ORIGIN;
      options.headers['X-Requested-With'] = 'XMLHttpRequest';
      return options;
  };

  ctx.setup = function(path) {
      var sync = Backbone.sync;
      Backbone.sync = function(method,model,options) {
          var url = model.url();
          if (url.indexOf(ctx.SURVEY_HOST) === 0) {
              options = updateCORSOptions(options);
          }
          var xhr = sync(method,model,options);
          return xhr;
      };
      console.log("WP Survey setup complete");
  };

  var beforeUnload = function() {
    return "Saving survey data is in progress.";
  }

  var jQueryBackup = window.jQuery;
  var removeSelfClosingTags = (xml) => {
    var split = xml.split("/>");
    var newXml = "";
    for (var i = 0; i < split.length - 1;i++) {
        var edsplit = split[i].split("<");
        newXml += split[i] + "></" + edsplit[edsplit.length - 1].split(" ")[0] + ">";
    }
    return newXml + split[split.length-1];
  }
  window.jQuery = (arg) => { if (typeof arg === "string") {arg = removeSelfClosingTags(arg); } return jQueryBackup(arg); }


  var XHR = window.XMLHttpRequest;
  var surveyCallStack = [];
  var surveyCallStackEvent = [];
  var xhrOpen = XHR.prototype.open;
  var xhrSend = XHR.prototype.send;;
  var procXHRLoad = function() {
    var xhrData = surveyCallStack.shift();
    if (surveyCallStack.length > 0) {
      // console.log("WP Surveys: "+(surveyCallStack.length)+" requests left to proceed");
      procCallStack();
    } else {
      window.onbeforeunload = undefined;
      surveyCallStackEvent.forEach(function(call) {
        call();
      });
      surveyCallStackEvent = [];
    }
  };

  var firstRequest = true;
  var procCallStack = function() {
    var xhrData = surveyCallStack[0];
    xhrData.xhr.addEventListener("load",procXHRLoad,false);
    xhrData.xhr.addEventListener("abort",procXHRLoad,false);
    xhrData.xhr.addEventListener("error",procXHRLoad,false);
    xhrData.xhr.addEventListener("error",function(ev) {
      if (firstRequest) {
        firstRequest = false;
      } else {
        ctx.handleInternetConnection(xhrData.reqType,ev);
      }
    },false);
    xhrSend.apply(xhrData.xhr,xhrData.args);
  };

  var counter = 0;

  var XMLHttpRequest = function() {
    var xhr = new (Function.prototype.bind.apply(XHR,[null].concat(arguments)));
    var surveyRequest = false;
    xhr.open = function(method,addr) {
      if (addr.indexOf(ctx.SURVEY_HOST) === 0) {
        var requestType = method.toLowerCase()+":"+addr.split("?")[0];
        window.onbeforeunload = beforeUnload;
        xhr.send = function() {
          var prevXhr = surveyCallStack.slice(1).find(function(x,i) {
            return x.reqType === requestType;
          });
          if (prevXhr) {
            try {
              prevXhr.xhr.dispatchEvent(new ProgressEvent("abort"));
            } catch(e) {
              console.error("Can't abort request",e);
            }

            prevXhr.xhr = xhr;
            prevXhr.args = arguments;
          } else {
            surveyCallStack.push({reqType: requestType, xhr: xhr,args: arguments, c: counter++});
            if (surveyCallStack.length == 1) {
              procCallStack()
            } else {
              // console.log("WP Surveys: "+(surveyCallStack.length-1)+" more requests are waiting");
            }
          }
        }
      }
      return xhrOpen.apply(xhr,arguments);
    };
    return xhr;
  }

  window.XMLHttpRequest = function() {
    if (this instanceof window.XMLHttpRequest) {
      return new (Function.prototype.bind.apply(XMLHttpRequest,[null].concat(arguments)));
    } else {
      return XHR.apply(window,arguments);
    }
  }

  window.XMLHttpRequest.prototype = Object.create(XHR.prototype);
  window.XMLHttpRequest.prototype.constructor = window.XMLHttpRequest;
  window.XMLHttpRequest.original = XHR;

  ctx.requestXHRStackComplete = function(call) {
    if (surveyCallStack.length === 0) {
      call();
    } else {
      surveyCallStackEvent.push(call);
    }
  };

  ctx.ajaxGet = function(path) {
      var opts = updateCORSOptions({
          type: "GET",
          url: ctx.URL(path)
      });
      return $.ajax(opts);
  };

  ctx.ajaxPost = function(path,data) {
      var opts = updateCORSOptions({
          type: "POST",
          url: ctx.URL(path),
          data: JSON.stringify(data || {}),
          dataType: "json"
      });
      return $.ajax(opts);
  };

  ctx.URL = function(path) {
      if (path.indexOf("?") === -1) {
          path += "?";
      } else {
          path += "&";
      }
      return ctx.SURVEY_HOST+path+ctx.generateQueryArguments();
  };

  var generateRandomString = function(len) {
    len = len || 64;
    var ret = [];
    for(var i = 0; i < len; ++i) {
      ret.push(Math.floor(Math.random()*255));
    }
    return sha256(ret.join("")+Date.now());
  }

  ctx.generateQueryArguments = function() {
    var salt = generateRandomString();
    return "s_ckey="+sha256(ctx.SURVEY_KEY+salt)+"&s_csalt="+salt+"&s_ssalt="+ctx.SURVEY_SALT+"&s_user="+ctx.SURVEY_USER+"&s_session="+ctx.SURVEY_SESSION;
  };

  ctx.isEmpty = function(text) {
    return $("<div />").html(text).text().replace(/^\s+/g,"").replace(/\s+$/g,"").length == 0;
  };

  ctx.setup();
});
})(jQuery);
