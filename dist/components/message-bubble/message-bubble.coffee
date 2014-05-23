function Message($jq) {
    this[0] = $jq;
    this.timestamp = $jq.data("message-timestamp");
}



function MessageController(settings) {
    var $messageBubbleContainer = $(".message-bubble-container");
    settings = settings || {};

    this.container = (settings.container) ? $(settings.container) : ($messageBubbleContainer.length > 0 ? $messageBubbleContainer : $("body"));
    this.messages = $(".message-bubble");

    this.messageBubbleHTML = '<div class="message-bubble"><div class="message-bubble-inner"> MESSAGE<svg class="message-bubble-whale-tail" width="116px" height="119px" viewBox="0 0 116 119" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 116 119" xml:space="preserve"><path fill="#A0A0A0" d="M67.39,79.03 C84.24,104.95 116.42,115.32 116.42,115.32 C116.42,115.32 73.88,124.39 46.66,115.32 C19.44,106.24 0,79.03 0,79.03 L0,-0.227279902 L51.8400002,-0.227279902 L51.84,22 C51.84,22 50.54,53.1 67.39,79.03 Z" id="Shape" sketch:type="MSShapeGroup"></path></svg>';
    this.messageDateSectionHTML = "<section class='message-bubble-date-section' />";
    this.timestampKey = "message-timestamp";

    this.automateDateSections = settings.automateDateSections !== undefined ? settings.container : true;
    this.dateSectionCutoff = settings.dateSectionCutoff ? settings.dateSectionCutoff : "unique-day";
}

MessageController.prototype = {

//        ___          ___                       ___          ___          ___
//       /  /\        /  /\                     /  /\        /  /\        /  /\
//      /  /:/       /  /::\                   /  /::\      /  /::\      /  /:/_
//     /  /:/       /  /:/\:\   ___     ___   /  /:/\:\    /  /:/\:\    /  /:/ /\
//    /  /:/  ___  /  /:/  \:\ /__/\   /  /\ /  /:/  \:\  /  /:/~/:/   /  /:/ /::\
//   /__/:/  /  /\/__/:/ \__\:\\  \:\ /  /://__/:/ \__\:\/__/:/ /:/___/__/:/ /:/\:\
//   \  \:\ /  /:/\  \:\ /  /:/ \  \:\  /:/ \  \:\ /  /:/\  \:\/:::::/\  \:\/:/~/:/
//    \  \:\  /:/  \  \:\  /:/   \  \:\/:/   \  \:\  /:/  \  \::/~~~~  \  \::/ /:/
//     \  \:\/:/    \  \:\/:/     \  \::/     \  \:\/:/    \  \:\       \__\/ /:/
//      \  \::/      \  \::/       \__\/       \  \::/      \  \:\        /__/:/
//       \__\/        \__\/                     \__\/        \__\/        \__\/

    setBackgroundColor: function(color, selector) {
        this.getSubsetOfMessages(selector).each(function() {
            var $this = $(this);
            $this.css("background-color", color);
            $this.find(".message-bubble-whale-tail path").css("fill", color);
        });
    },

    setTextColor: function(color, selector) {
        this.getSubsetOfMessages(selector).each(function() {
            var $this = $(this);
            $this.css("color", color);
        });
    },



//        ___                   ___          ___          ___
//       /  /\         ___     /__/\        /  /\        /  /\
//      /  /::\       /  /\    \  \:\      /  /:/_      /  /::\
//     /  /:/\:\     /  /:/     \__\:\    /  /:/ /\    /  /:/\:\
//    /  /:/  \:\   /  /:/  ___ /  /::\  /  /:/ /:/_  /  /:/~/:/
//   /__/:/ \__\:\ /  /::\ /__/\  /:/\:\/__/:/ /:/ /\/__/:/ /:/___
//   \  \:\ /  /://__/:/\:\\  \:\/:/__\/\  \:\/:/ /:/\  \:\/:::::/
//    \  \:\  /:/ \__\/  \:\\  \::/      \  \::/ /:/  \  \::/~~~~
//     \  \:\/:/       \  \:\\  \:\       \  \:\/:/    \  \:\
//      \  \::/         \__\/ \  \:\       \  \::/      \  \:\
//       \__\/                 \__\/        \__\/        \__\/

    getSubsetOfMessages: function(selector) {
        if(!selector) { return this.messages; }

        return this.messages.filter(function() {
            return $(this).is(selector);
        });
    },

    update: function() {
        this.messages = $(".message-bubble");
    },



//        ___         _____        _____
//       /  /\       /  /::\      /  /::\
//      /  /::\     /  /:/\:\    /  /:/\:\
//     /  /:/\:\   /  /:/  \:\  /  /:/  \:\
//    /  /:/~/::\ /__/:/ \__\:|/__/:/ \__\:|
//   /__/:/ /:/\:\\  \:\ /  /:/\  \:\ /  /:/
//   \  \:\/:/__\/ \  \:\  /:/  \  \:\  /:/
//    \  \::/       \  \:\/:/    \  \:\/:/
//     \  \:\        \  \::/      \  \::/
//      \  \:\        \__\/        \__\/
//       \__\/

    newMessage: function(message, options) {
        var options = $.extend({
            // Position options
            after: null,
            append: true,
            container: null,

            // Timestamp options
            artificialDate: null,
            timestamp: true,

            // Tail options
            tail: true,

            // Reply options
            inReplyTo: null,
            reply: false
        }, options);

        // If append given as string, set that to be container instead
        if(Object.prototype.toString.call(options.append) == "[object String]") {
            options.container = $(options.append);
            options.append = true;
        }

        var $message = $(this.messageBubbleHTML.replace("MESSAGE", message));

        if(options.timestamp) {
            var time = (options.artificialDate !== null ? new Date(options.artificialDate) : new Date()).getTime();
            $message.attr("data-" + this.timestampKey, time);
            this.timestamp($message);
        }

        if(!options.tail) { $message.addClass("no-tail"); }

        if(options.reply) { $message.addClass("reply"); }
        if(options.inReplyTo) {
            if(options.inReplyTo.hasClass("reply")) {
                $message.removeClass("reply");
            } else {
                $message.addClass("reply");
            }
        }

        if(options.after) {
            var $beforeElement = $(options.after);
            if($beforeElement.length > 0) { $message.insertAfter($beforeElement); }
        }

        else if(options.before) {
            var $afterElement = $(options.before);
            if($afterElement.length > 0) { $message.insertBefore($afterElement); }
        }

        else if(this.automateDateSections &&
                options.timestamp &&
                this.messages.length > 0) {
            var curTimestampInDays = Math.floor((new Date($message.data(this.timestampKey))).getTime()/86400000),
                $lastMessage = this.messages.last(),
                lastTimestampInDays = Math.floor((new Date($lastMessage.data(this.timestampKey))).getTime()/86400000);

            if(curTimestampInDays - lastTimestampInDays >= 1) {
                var $insertionPoint = $lastMessage;
                var $lastDateSection = $lastMessage.closest(".message-bubble-date-section");
                if($lastDateSection.length > 0) { $insertionPoint = $lastDateSection; }
                this.makeQuickDateSection($message).insertAfter($insertionPoint);
            } else {
                $message.insertAfter($lastMessage);
            }
        }

        else {
            var $container = options.container ? $(options.container) : this.container,
                $relevantContainerChild = $container.children(options.append ? ":last-child" : ":first-child");

            if($relevantContainerChild.hasClass("message-bubble-date-section")) {
                $container = $relevantContainerChild;
            }

            $message[options.append ? "appendTo" : "prependTo"]($container);
        }

        this.update();
        return $message;
    },

    add: function(message, options) { return this.newMessage(message, options); },

    makeDateSection: function(options) {
        var options = $.extend({
            startMessage: null,
            endMessage: null,
            messageCount: null,
            sectionHeadingDate: null,
            sectionHeadingTime: null
        }, options);

        var $messages = this.messages;

        options.startMessage = this.convertPossibleSelectorToIndexNumber(options.startMessage, $messages);

        if(options.endMessage) {
            options.endMessage = this.convertPossibleSelectorToIndexNumber(options.endMessage, $messages) + 1;
        } else if(options.messageCount) {
            options.endMessage = startMessage + messageCount;
        }

        if(!options.endMessage) {
            options.endMessage = $messages.length;
        }

        var $messageSet = $messages.slice(options.startMessage - 1, options.endMessage);

        this.destroyOverlappingSections($messageSet);

        $messageSet.wrapAll(this.messageDateSectionHTML);
        var $container = $messageSet.parent(),
            headingText = "<h3 class='message-bubble-heading'><span class='message-bubble-date'>";

        if(options.sectionHeadingDate) {
            headingText += options.sectionHeadingDate;
        } else {
            headingText += this.weekdayString($messageSet.first().data(this.timestampKey));
        }

        headingText += "</span>";

        if(options.sectionHeadingTime) {
            headingText += (" " + options.sectionHeadingTime);
        } else if(!options.sectionHeadingDate) {
            headingText += (" " + this.formatDateString($messageSet.first().data(this.timestampKey)));
        }

        headingText += "</h3>";

        $(headingText).prependTo($container);

        return $container;
    },

    makeQuickDateSection: function($messages) {
        var $dateSection = $(this.messageDateSectionHTML),
            date = $messages.first().data(this.timestampKey);

        this.destroyOverlappingSections($messages);
        $messages.appendTo($dateSection);
        $("<h3 class='message-bubble-heading'><span class='message-bubble-date'>" +
           this.weekdayString(date) + "</span> " + this.formatDateString(date) + "</h3>")
                .prependTo($dateSection);
        return $dateSection;
    },

    destroyOverlappingSections: function($messages) {
        $messages.each(function() {
            var $this = $(this),
                $parent = $this.parent();
            if($parent.hasClass("message-bubble-date-section")) {
                $parent.children(".message-bubble-heading").remove();
                $this.unwrap();
            }
        });
    },

    convertPossibleSelectorToIndexNumber: function(shouldBeNum, $containingSet) {
        if(!shouldBeNum) { return null; }

        if(typeof(shouldBeNum) != "number") {
            if(Object.prototype.toString.call(shouldBeNum) == "[object String]") {
                shouldBeNum = $(shouldBeNum);
            }

            shouldBeNum = $containingSet.index(shouldBeNum);
            if(shouldBeNum < 0) { return null; }
        }

        return shouldBeNum;
    },



//        ___          ___          ___          ___                      ___
//       /  /\        /  /\        /__/\        /  /\         ___        /  /\
//      /  /::\      /  /:/_      |  |::\      /  /::\       /__/\      /  /:/_
//     /  /:/\:\    /  /:/ /\     |  |:|:\    /  /:/\:\      \  \:\    /  /:/ /\
//    /  /:/~/:/   /  /:/ /:/_  __|__|:|\:\  /  /:/  \:\      \  \:\  /  /:/ /:/_
//   /__/:/ /:/___/__/:/ /:/ /\/__/::::| \:\/__/:/ \__\:\ ___  \__\:\/__/:/ /:/ /\
//   \  \:\/:::::/\  \:\/:/ /:/\  \:\~~\__\/\  \:\ /  /://__/\ |  |:|\  \:\/:/ /:/
//    \  \::/~~~~  \  \::/ /:/  \  \:\       \  \:\  /:/ \  \:\|  |:| \  \::/ /:/
//     \  \:\       \  \:\/:/    \  \:\       \  \:\/:/   \  \:\__|:|  \  \:\/:/
//      \  \:\       \  \::/      \  \:\       \  \::/     \__\::::/    \  \::/
//       \__\/        \__\/        \__\/        \__\/          ~~~~      \__\/

    removeMessage: function(selector) {
        var removalsMade = 0;
        var $matching = this.getSubsetOfMessages(selector);
        var that = this;

        removalsMade = $matching.length;
        $matching.each(function() {
            that.checkForSectionRemovalAndRemove($(this));
        });

        var $this;
        if(removalsMade < 1) {
            $(".message-bubble").each(function() {
                $this = $(this);
                if($this.text().match(selector)) {
                    that.checkForSectionRemovalAndRemove($this);
                    removalsMade++;
                }
            });
        }

        this.update();

        return removalsMade;
    },

    remove: function(selector) { return this.removeMessage(selector); },
    delete: function(selector) { return this.removeMessage(selector); },

    checkForSectionRemovalAndRemove: function($elem) {
        if($elem.parent().hasClass("message-bubble-date-section") &&
            $elem.siblings(".message-bubble").length < 1) {
            $elem.parent().remove();
        } else {
            $elem.remove();
        }
    },



//                           ___          ___          ___
//        ___   ___         /__/\        /  /\        /  /\
//       /  /\ /  /\       |  |::\      /  /:/_      /  /:/_
//      /  /://  /:/       |  |:|:\    /  /:/ /\    /  /:/ /\
//     /  /://__/::\     __|__|:|\:\  /  /:/ /:/_  /  /:/ /::\
//    /  /::\\__\/\:\__ /__/::::| \:\/__/:/ /:/ /\/__/:/ /:/\:\
//   /__/:/\:\  \  \:\/\\  \:\~~\__\/\  \:\/:/ /:/\  \:\/:/~/:/
//   \__\/  \:\  \__\::/ \  \:\       \  \::/ /:/  \  \::/ /:/
//        \  \:\ /__/:/   \  \:\       \  \:\/:/    \__\/ /:/
//         \__\/ \__\/     \  \:\       \  \::/       /__/:/
//                          \__\/        \__\/        \__\/

    timestamp: function(selector) {
        var $matching = selector instanceof jQuery ? selector : this.getSubsetOfMessages(selector),
            that = this;
        $matching.each(function() {
            var $this = $(this),
                timestamp = $this.data(that.timestampKey),
                date = new Date(timestamp);
            if(timestamp && !(new Date(timestamp) + "").match(/Invalid/gi)) {
                $this.append("<span class='message-bubble-timestamp'>" + that.formatDateString(timestamp) + "</span>");
            }
        });
    },

    // TODO: Smarter format strings based on whether date is in the past week or not
    formatDateString: function(date) {
        date = new Date(date);
        var hours = date.getHours(),
            mins = date.getMinutes(),
            adjHours = hours % 12 != 0 ? hours % 12 : 12;
        return adjHours + ":" + (mins < 10 ? "0" + mins : mins)  + " " + (hours >= 12 ? "PM" : "AM");
    },

    weekdayString: function(date) {
        date = new Date(date);
        var today = new Date();
        if(date.getYear() == today.getYear() &&
            date.getMonth() == today.getMonth() &&
            date.getDay() == today.getDay()) { return "Today"; }
        var weekday;
        switch(date.getDay()) {
            case 0: weekday = "Sunday"; break;
            case 1: weekday = "Monday"; break;
            case 2: weekday = "Tuesday"; break;
            case 3: weekday = "Wednesday"; break;
            case 4: weekday = "Thursday"; break;
            case 5: weekday = "Friday"; break;
            default: weekday = "Saturday";
        }

        return weekday;
    }
}

$(document).ready(function() {

    var mc = new MessageController();
    mc.timestamp();
    mc.add("Sample message 1");
    var $m2 = mc.add("Sample message 2");
    var $m3 = mc.add("Sample message 3", { inReplyTo: $m2, artificialDate: (new Date()).getTime() + 80000000 });
    mc.add("Sample message 4", { inReplyTo: $m3, artificialDate: (new Date()).getTime() + 2*80000000 });
    mc.add("Sample message 5", { reply: true, artificialDate: (new Date()).getTime() + 2*83000000 });

    var $container = $(".message-bubble-container"),
        maxMovement = $(".message-bubble-timestamp").first().outerWidth();
    $container.on("dragstart", function(e) {
        $(".message-bubble").removeClass("return");
    });

    $container.on("dragend", function(e) {
        $(".message-bubble").addClass("return").css("transform", "translateX(0)");
        $(".message-bubble-timestamp").css("opacity", 0);
        var outerWidth = $container.outerWidth() - parseFloat($container.css("padding-left")) - parseFloat($container.css("padding-right"));
        $(".message-bubble.reply").each(function() {
            var $this = $(this);
            $this.find(".message-bubble-timestamp").css("transform", "translate(" + (outerWidth - $this.outerWidth()) + "px, -50%)");
        });
    });

    $container.on("drag", function(e) {
        $(".message-bubble:not(.reply)").css("transform", "translateX(" + Math.max(e.deltaX, -maxMovement) + "px)");
        $(".message-bubble-timestamp").css("opacity", Math.max(0, e.deltaX/-maxMovement));
        var $container = $(".message-bubble-container"),
            outerWidth = $container.outerWidth() - parseFloat($container.css("padding-left")) - parseFloat($container.css("padding-right"));
        $(".message-bubble.reply").each(function() {
            var $this = $(this);
            $this.find(".message-bubble-timestamp").css("transform", "translate(" + (outerWidth - $this.outerWidth() - Math.min(maxMovement, -e.deltaX)) + "px, -50%)");
        });
    });
});