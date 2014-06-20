(function() {
  var $w, DAYS_IN_MS, MessageBubble, MessageBubbleController, Timestamper;

  DAYS_IN_MS = 86400000;

  $w = $(window);

  $.fn.transitionEnd = function(handler) {
    return this.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", handler);
  };

  $.fn.animationEnd = function(handler) {
    return this.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", handler);
  };

  $.fn.verticalSpaceAvail = function() {
    return this.offset().top - $w.scrollTop();
  };

  MessageBubble = (function() {
    function MessageBubble() {}

    return MessageBubble;

  })();

  MessageBubble.template = "<div class='message-bubble'> <div class='message-bubble-inner'> MESSAGE <svg style='display: none' class='message-bubble-whale-tail' width='116px' height='119px' viewBox='0 0 116 119' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' enable-background='new 0 0 116.42 97.35' xml:space='preserve'> <path fill='#A0A0A0' d='M67.39,79.03 C84.24,104.95 116.42,115.32 116.42,115.32 C116.42,115.32 73.88,124.39 46.66,115.32 C19.44,106.24 0,79.03 0,79.03 L0,-0.227279902 L51.8400002,-0.227279902 L51.84,22 C51.84,22 50.54,53.1 67.39,79.03 Z'></path> </svg> </div> </div>";

  MessageBubbleController = (function() {
    function MessageBubbleController(settings) {
      var $messageBubbleContainer;
      if (settings == null) {
        settings = {};
      }
      $messageBubbleContainer = $(".message-bubble-container");
      if ($messageBubbleContainer.length < 1) {
        $messageBubbleContainer = $("body");
      }
      this.container = settings.container != null ? settings.container : $messageBubbleContainer;
      this.messages = $(".message-bubble");
      this._messageDateSectionHTML = "<section class='message-bubble-date-section' />";
      this._timestampKey = "message-timestamp";
      this._timestamper = new Timestamper;
      this.automateDateSections = settings.automateDateSections != null ? settings.automateDateSections : true;
      this.dateSectionCutoff = settings.dateSectionCutoff != null ? settings.dateSectionCutoff : "unique-day";
    }

    MessageBubbleController.prototype.setBackgroundColor = function(color, sel) {
      return this.getSubsetOfMessages(sel).each(function() {
        var $this;
        $this = $(this);
        $this.css("background-color", color);
        return $this.find(".message-bubble-whale-tail path").css("fill", color);
      });
    };

    MessageBubbleController.prototype.setTextColor = function(color, sel) {
      return this.getSubsetOfMessages(sel).each(function() {
        return $(this).css("color", color);
      });
    };

    MessageBubbleController.prototype.newMessageBubble = function(msg, options) {
      var $afterElement, $beforeElement, $container, $insertionPoint, $lastDateSection, $lastMsg, $message, $relevantContainerChild, $replyMsg, curTSinDays, defaults, lastTSinDays, time;
      if (options == null) {
        options = {};
      }
      defaults = {
        after: null,
        append: true,
        container: null,
        artificialDate: null,
        timestamp: true,
        tail: true,
        inReplyTo: null,
        reply: false,
        animate: null
      };
      options = $.extend(defaults, options);
      $message = $(MessageBubble.template.replace("MESSAGE", msg)).addClass("temp-hide");
      if (options.animate != null) {
        $message.css("visibility", "none");
      }
      if (options.append instanceof jQuery || Object.prototype.toString.call(options.append) === "[object String]") {
        options.container = $(options.append);
        options.append = true;
      }
      if (options.timestamp) {
        time = options.artificialDate != null ? new Date(options.artificialDate) : new Date;
        $message.attr("data-" + this._timestampKey, time.getTime());
        this.timestamp($message);
      }
      if (!options.tail) {
        $message.addClass("no-tail");
      }
      if (options.reply) {
        $message.addClass("reply");
      }
      if ((options.inReplyTo != null) && ($replyMsg = $(options.inReplyTo)).length > 0) {
        $message[$replyMsg.hasClass("reply") ? "removeClass" : "addClass"]("reply");
      }
      if (options.after) {
        if (($afterElement = $(options.after)).length > 0) {
          $message.insertAfter($afterElement);
        }
      } else if (options.before) {
        if (($beforeElement = $(options.before)).length > 0) {
          $message.insertBefore($beforeElement);
        }
      } else if (this.automateDateSections && (options.timestamp != null) && this.messages.length > 0) {
        $lastMsg = this.messages.last();
        curTSinDays = Math.floor(new Date($message.data(this._timestampKey)).getTime() / DAYS_IN_MS);
        lastTSinDays = Math.floor(new Date($lastMsg.data(this._timestampKey)).getTime() / DAYS_IN_MS);
        if (curTSinDays - lastTSinDays >= 1) {
          $insertionPoint = ($lastDateSection = $lastMsg.closest(".message-bubble-date-section")).length > 0 ? $lastDateSection : $lastMsg;
          this._makeQuickDateSection($message).insertAfter($insertionPoint);
        } else {
          $message.insertAfter($lastMsg);
        }
      } else {
        $container = options.container != null ? $(options.container) : this.container;
        $relevantContainerChild = $container.children(options.append ? ":last-child" : ":first-child");
        if ($relevantContainerChild.hasClass("message-bubble-date-section")) {
          $container = $relevantContainerChild;
        }
        $message[options.append ? "appendTo" : "prependTo"]($container);
      }
      if (options.animate != null) {
        this._resolveAddAnimation($message, options.animate);
      } else {
        $message.removeClass("temp-hide");
      }
      this._update();
      return $message;
    };

    MessageBubbleController.prototype._resolveAddAnimation = function($msg, animate) {
      var $container, defaults, endTransition, offset, options, startTranslate;
      defaults = {
        props: null,
        duration: 400,
        delay: 0,
        timingFunction: "ease",
        from: "right",
        callback: null
      };
      options = $.extend(defaults, animate);
      if (options.duration == null) {
        return null;
      }
      if (options.timingFunction === "spring") {
        options.timingFunction = "cubic-bezier(0.37, 1.65, 0.305, 0.855)";
      }
      if (["right", "left", "top", "bottom"].indexOf(options.from) >= 0) {
        $container = $msg.parent();
        endTransition = "transform " + options.duration + (options.duration < 10 ? "s" : "ms") + " " + options.timingFunction;
        startTranslate = (function() {
          switch (options.from) {
            case "right":
              return $container.outerWidth() + $container.offset().left - $msg.offset().left;
            case "left":
              return -($msg.outerWidth() + $msg.offset().left - $container.offset().left);
            case "top":
              return -($msg.outerHeight() + $msg.offset().top - Math.max(window.scrollY, $container.offset().top));
            case "bottom":
              offset = $msg.offset();
              return Math.min($w.height() - (offset.top - $w.scrollTop()), $msg.outerHeight() + $msg.offset().top - Math.max(window.scrollY, $container.offset().top));
          }
        })();
        startTranslate = (function() {
          switch (options.from) {
            case "right":
            case "left":
              return "translate(" + startTranslate + "px, 0)";
            case "top":
            case "bottom":
              return "translate(0, " + startTranslate + "px)";
          }
        })();
        $msg.css("transform", startTranslate);
        $msg.transitionEnd(function() {
          return $msg.css({
            "transition": "",
            "-webkit-transition": "",
            "transform": ""
          });
        });
        return setTimeout(function() {
          return $msg.removeClass("temp-hide").css({
            "transition": endTransition,
            "-webkit-transition": "-webkit-" + endTransition,
            "transform": "translate(0, 0)"
          });
        }, 5);
      }
    };

    MessageBubbleController.prototype.add = function(msg, options) {
      return this.newMessageBubble(msg, options);
    };

    MessageBubbleController.prototype.makeDateSection = function(options) {
      var $container, $messageSet, $messages, defaults, headingText, _ref;
      if (options == null) {
        options = {};
      }
      defaults = {
        startMessage: null,
        endMessage: null,
        messageCount: null,
        sectionHeadingDate: null,
        sectionHeadingTime: null
      };
      options = $.extend(defaults, options);
      $messages = this.messages;
      options.startMessage = this._convertPossibleSelectorToIndexNumber(options.startMessage, $messages);
      if (options.endMessage != null) {
        options.endMessage = 1 + this._convertPossibleSelectorToIndexNumber(options.endMessage, $messages);
      } else if (options.messageCount) {
        options.endMessage = options.startMessage + options.messageCount + 1;
      }
      if ((options.endMessage == null) || (0 > (_ref = options.endMessage) && _ref > $messages.length)) {
        options.endMessage = $messages.length;
      }
      $messageSet = $messages.slice(options.startMessage - 1, options.endMessage);
      this._destroyOverlappingSections($messageSet);
      $messageSet.wrapAll(this._messageDateSectionHTML);
      $container = $messageSet.parent();
      headingText = "<h3 class='message-bubble-heading'> <span class='message-bubble-date'> " + (options.sectionHeadingDate || this._weekdayString($messageSet.first().data(this._timestampKey))) + " </span> " + (options.sectionHeadingTime ? options.sectionHeadingTime : options.sectionHeadingDate == null ? this._formatDateString($messageSet.first().data(this._timestampKey)) : void 0) + " </h3>";
      $(headingText).prependTo($container);
      return $container;
    };

    MessageBubbleController.prototype._makeQuickDateSection = function($messages) {
      var $dateSection, date;
      $dateSection = $(this._messageDateSectionHTML);
      date = $messages.first().data(this._timestampKey);
      this._destroyOverlappingSections($messages);
      $messages.appendTo($dateSection);
      $("<h3 class='message-bubble-heading'> <span class='message-bubble-date'> " + (this._weekdayString(date)) + " </span> " + (this._formatDateString(date)) + " </h3>").prependTo($dateSection);
      return $dateSection;
    };

    MessageBubbleController.prototype._destroyOverlappingSections = function($messages) {
      return $messages.each(function() {
        var $parent, $this;
        $this = $(this);
        $parent = $this.parent();
        if ($parent.hasClass("message-bubble-date-section")) {
          $parent.children(".message-bubble-heading").remove();
          return $this.unwrap();
        }
      });
    };

    MessageBubbleController.prototype._convertPossibleSelectorToIndexNumber = function(shouldBeNum, $containingSet) {
      if (shouldBeNum == null) {
        return null;
      }
      if (typeof shouldBeNum !== "number") {
        shouldBeNum = $(shouldBeNum);
        shouldBeNum = $containingSet.index(shouldBeNum);
        if (shouldBeNum < 0) {
          return null;
        }
      }
      return shouldBeNum;
    };

    MessageBubbleController.prototype.removeMessageBubbles = function(sel) {
      var $removalsMade, that;
      $removalsMade = $();
      that = this;
      this.getSubsetOfMessages(sel).each(function() {
        var $this;
        $this = $(this);
        that._checkForSectionRemovalAndRemove($this);
        return $removalsMade = $removalsMade.add($this);
      });
      if (!($removalsMade > 0)) {
        this.messages.each(function() {
          var $this;
          $this = $(this);
          if ($this.text().match(sel)) {
            that._checkForSectionRemovalAndRemove($this);
            return $removalsMade = $removalsMade.add($this);
          }
        });
      }
      this._update();
      return $removalsMade;
    };

    MessageBubbleController.prototype.remove = function(sel) {
      return this.removeMessageBubbles(sel);
    };

    MessageBubbleController.prototype["delete"] = function(sel) {
      return this.removeMessageBubbles(sel);
    };

    MessageBubbleController.prototype._checkForSectionRemovalAndRemove = function($elem) {
      if ($elem.closest(".message-bubble-date-section").length > 0 && $elem.siblings(".message-bubble").length < 1) {
        return $elem.parent().remove();
      } else {
        return $elem.remove();
      }
    };

    MessageBubbleController.prototype.timestamp = function(sel) {
      var $matching, that;
      $matching = sel instanceof jQuery ? sel : this.getSubsetOfMessages(sel);
      that = this;
      return $matching.each(function() {
        var $this, date, timestamp;
        $this = $(this);
        timestamp = $this.data(that._timestampKey);
        date = new Date(timestamp);
        if (timestamp && (!(new Date(timestamp) + "").match(/Invalid/gi))) {
          return $this.append("<span class='message-bubble-timestamp'>" + (that._formatDateString(timestamp)) + "</span>");
        }
      });
    };

    MessageBubbleController.prototype._formatDateString = function(date) {
      return this._timestamper.formatDateString(date);
    };

    MessageBubbleController.prototype._weekdayString = function(date) {
      return this._timestamper.weekdayString(date);
    };

    MessageBubbleController.prototype.getSubsetOfMessages = function(sel) {
      if (sel == null) {
        return this.messages;
      }
      return this.messages.filter(function() {
        return $(this).is(sel);
      });
    };

    MessageBubbleController.prototype._update = function() {
      return this.messages = $(".message-bubble");
    };

    MessageBubbleController.prototype.typing = function(state) {
      var $typingIndicators;
      if (state == null) {
        state = true;
      }
      $typingIndicators = this.container.children(".typing-indicator");
      if (state) {
        if ($typingIndicators.length < 1) {
          return $("<div class='typing-indicator'><div class='typing-indicator-dot' /></div>").appendTo(this.container);
        } else {
          return $typingIndicators;
        }
      } else {
        return $typingIndicators.remove();
      }
    };

    return MessageBubbleController;

  })();

  Timestamper = (function() {
    function Timestamper() {}

    Timestamper.prototype.formatDateString = function(date) {
      var adjHours, hours, mins, _ref;
      date = new Date(date);
      _ref = [date.getHours(), date.getMinutes()], hours = _ref[0], mins = _ref[1];
      adjHours = hours % 12 !== 0 ? hours % 12 : 12;
      return "" + adjHours + ":" + (mins < 10 ? 0 : "") + mins + " " + (hours < 12 ? "AM" : "PM");
    };

    Timestamper.prototype.weekdayString = function(date) {
      var today;
      date = new Date(date);
      today = new Date;
      if (date.getYear() === today.getYear() && date.getMonth() === today.getMonth() && date.getDay() === today.getDay()) {
        return "Today";
      }
      switch (date.getDay()) {
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        default:
          return "Saturday";
      }
    };

    return Timestamper;

  })();

  window.MessageBubbleController = MessageBubbleController;

}).call(this);
