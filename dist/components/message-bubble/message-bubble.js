(function() {
  var MessageController, daysInMS;

  daysInMS = 86400000;

  MessageController = (function() {
    function MessageController(settings) {
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
      this.messageBubbleHTML = "<div class='message-bubble'> <div class='message-bubble-inner'> MESSAGE <svg class='message-bubble-whale-tail' width='116px' height='119px' viewBox='0 0 116 119' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' enable-background='new 0 0 116.42 97.35' xml:space='preserve'> <path fill='#A0A0A0' d='M67.39,79.03 C84.24,104.95 116.42,115.32 116.42,115.32 C116.42,115.32 73.88,124.39 46.66,115.32 C19.44,106.24 0,79.03 0,79.03 L0,-0.227279902 L51.8400002,-0.227279902 L51.84,22 C51.84,22 50.54,53.1 67.39,79.03 Z'></path> </svg> </div> </div>";
      this.messageDateSectionHTML = "<section class='message-bubble-date-section' />";
      this.timestampKey = "message-timestamp";
      this.automateDateSections = settings.automateDateSections != null ? settings.automateDateSections : true;
      this.dateSectionCutoff = settings.dateSectionCutoff != null ? settings.dateSectionCutoff : "unique-day";
    }

    MessageController.prototype.setBackgroundColor = function(color, sel) {
      return this.getSubsetOfMessages(sel).each(function() {
        var $this;
        $this = $(this);
        $this.css("background-color", color);
        return $this.find(".message-bubble-whale-tail path").css("fill", color);
      });
    };

    MessageController.prototype.setTextColor = function(color, sel) {
      return this.getSubsetOfMessages(sel).each(function() {
        return $(this).css("color", color);
      });
    };

    MessageController.prototype.getSubsetOfMessages = function(sel) {
      if (sel == null) {
        return this.messages;
      }
      return this.messages.filter(function() {
        return $(this).is(sel);
      });
    };

    MessageController.prototype.update = function() {
      return this.messages = $(".message-bubble");
    };

    MessageController.prototype.newMessage = function(msg, options) {
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
        reply: false
      };
      options = $.extend(defaults, options);
      if (options.append instanceof jQuery || Object.prototype.toString.call(options.append) === "[object String]") {
        options.container = $(options.append);
        options.append = true;
      }
      $message = $(this.messageBubbleHTML.replace("MESSAGE", msg));
      if (options.timestamp) {
        time = options.artificialDate != null ? new Date(options.artificialDate) : new Date;
        $message.attr("data-" + this.timestampKey, time.getTime());
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
        curTSinDays = Math.floor(new Date($message.data(this.timestampKey)).getTime() / daysInMS);
        lastTSinDays = Math.floor(new Date($lastMsg.data(this.timestampKey)).getTime() / daysInMS);
        if (curTSinDays - lastTSinDays >= 1) {
          $insertionPoint = ($lastDateSection = $lastMsg.closest(".message-bubble-date-section")).length > 0 ? $lastDateSection : $lastMsg;
          this.makeQuickDateSection($message).insertAfter($insertionPoint);
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
      this.update();
      return $message;
    };

    MessageController.prototype.add = function(msg, options) {
      return this.newMessage(msg, options);
    };

    MessageController.prototype.makeDateSection = function(options) {
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
      options.startMessage = this.convertPossibleSelectorToIndexNumber(options.startMessage, $messages);
      if (options.endMessage != null) {
        options.endMessage = 1 + this.convertPossibleSelectorToIndexNumber(options.endMessage, $messages);
      } else if (options.messageCount) {
        options.endMessage = options.startMessage + options.messageCount;
      }
      if ((options.endMessage == null) || (0 > (_ref = options.endMessage) && _ref > $messages.length)) {
        options.endMessage = $messages.length;
      }
      $messageSet = $messages.slice(options.startMessage - 1, options.endMessage);
      this.destroyOverlappingSections($messageSet);
      $messageSet.wrapAll(this.messageDateSectionHTML);
      $container = $messageSet.parent();
      headingText = "<h3 class='message-bubble-heading'> <span class='message-bubble-date'> " + (options.sectionHeadingDate || this.weekdayString($messageSet.first().data(this.timestampKey))) + " </span> " + (options.sectionHeadingTime ? options.sectionHeadingTime : options.sectionHeadingDate == null ? this.formatDateString($messageSet.first().data(this.timestampKey)) : void 0) + " </h3>";
      $(headingText).prependTo($container);
      return $container;
    };

    MessageController.prototype.makeQuickDateSection = function($messages) {
      var $dateSection, date;
      $dateSection = $(this.messageDateSectionHTML);
      date = $messages.first().data(this.timestampKey);
      this.destroyOverlappingSections($messages);
      $messages.appendTo($dateSection);
      $("<h3 class='message-bubble-heading'> <span class='message-bubble-date'> " + (this.weekdayString(date)) + " </span> " + (this.formatDateString(date)) + " </h3>").prependTo($dateSection);
      return $dateSection;
    };

    MessageController.prototype.destroyOverlappingSections = function($messages) {
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

    MessageController.prototype.convertPossibleSelectorToIndexNumber = function(shouldBeNum, $containingSet) {
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

    MessageController.prototype.removeMessage = function(sel) {
      var removalsMade, that;
      removalsMade = 0;
      that = this;
      this.getSubsetOfMessages(sel).each(function() {
        that.checkForSectionRemovalAndRemove($(this));
        return removalsMade++;
      });
      if (!(removalsMade > 0)) {
        this.messages.each(function() {
          var $this;
          $this = $(this);
          if ($this.text().match(sel)) {
            that.checkForSectionRemovalAndRemove($this);
            return removalsMade++;
          }
        });
      }
      this.update();
      return removalsMade;
    };

    MessageController.prototype.remove = function(sel) {
      return this.removeMessage(sel);
    };

    MessageController.prototype["delete"] = function(sel) {
      return this.removeMessage(sel);
    };

    MessageController.prototype.checkForSectionRemovalAndRemove = function($elem) {
      if ($elem.parent().hasClass("message-bubble-date-section") && $elem.siblings(".message-bubble").length < 1) {
        return $elem.parent().remove();
      } else {
        return $elem.remove();
      }
    };

    MessageController.prototype.timestamp = function(sel) {
      var $matching, that;
      $matching = sel instanceof jQuery ? sel : this.getSubsetOfMessages(sel);
      that = this;
      return $matching.each(function() {
        var $this, date, timestamp;
        $this = $(this);
        timestamp = $this.data(that.timestampKey);
        date = new Date(timestamp);
        if (timestamp && (!(new Date(timestamp) + "").match(/Invalid/gi))) {
          return $this.append("<span class='message-bubble-timestamp'>" + (that.formatDateString(timestamp)) + "</span>");
        }
      });
    };

    MessageController.prototype.formatDateString = function(date) {
      var adjHours, hours, mins, _ref;
      date = new Date(date);
      _ref = [date.getHours(), date.getMinutes()], hours = _ref[0], mins = _ref[1];
      adjHours = hours % 12 !== 0 ? hours % 12 : 12;
      return "" + adjHours + ":" + (mins < 10 ? 0 : "") + mins + " " + (hours < 12 ? "AM" : "PM");
    };

    MessageController.prototype.weekdayString = function(date) {
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

    return MessageController;

  })();

  window.MessageController = MessageController;

}).call(this);
