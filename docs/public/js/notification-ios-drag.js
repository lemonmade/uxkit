// uxkit - v0.0.5 - 2014.07.09


// RESOURCES:

// http://benalman.com/news/2010/03/jquery-special-events/
// http://threedubmedia.com/demo/drag/
// file:///Users/Chris/Dropbox/Code/web/uxkit/dist/components/message-bubble/message-bubble.html

var $event = $.event,
    $specialEvent = $event.special,
    drag;

drag = $specialEvent.drag = {
    settings: {
        related:    0,
        distance:   10, // distance before drag initiated
        click:      false, // false suppress click events at start and end of drag
        cursor:     true
    },

    handlers: {
        dragstart: null,
        drag: null,
        dragend: null
    },

    dragging: false,

    key: "uxdragdata",

    // Keep track (in order to prevent) multiple touches
    touches: 0,


//        ___          ___                       ___                     ___          ___         _____
//       /  /\        /  /\         ___         /__/\       ___         /  /\        /  /\       /  /::\
//      /  /::\      /  /:/_       /  /\        \  \:\     /  /\       /  /::\      /  /:/_     /  /:/\:\
//     /  /:/\:\    /  /:/ /\     /  /::\        \  \:\   /  /:/      /  /:/\:\    /  /:/ /\   /  /:/  \:\
//    /  /:/~/:/   /  /:/ /:/_   /  /:/\:\   ___  \  \:\ /__/::\     /  /:/~/:/   /  /:/ /:/_ /__/:/ \__\:|
//   /__/:/ /:/___/__/:/ /:/ /\ /  /:/~/::\ /__/\  \__\:\\__\/\:\__ /__/:/ /:/___/__/:/ /:/ /\\  \:\ /  /:/
//   \  \:\/:::::/\  \:\/:/ /://__/:/ /:/\:\\  \:\ /  /:/   \  \:\/\\  \:\/:::::/\  \:\/:/ /:/ \  \:\  /:/
//    \  \::/~~~~  \  \::/ /:/ \  \:\/:/__\/ \  \:\  /:/     \__\::/ \  \::/~~~~  \  \::/ /:/   \  \:\/:/
//     \  \:\       \  \:\/:/   \  \::/       \  \:\/:/      /__/:/   \  \:\       \  \:\/:/     \  \::/
//      \  \:\       \  \::/     \__\/         \  \::/       \__\/     \  \:\       \  \::/       \__\/
//       \__\/        \__\/                     \__\/                   \__\/        \__\/

    // Called when the event is first attached to the element
    setup: function(data, namespaces, eventHandle) {
        // NOTE: `this` is bound to the element being bound
        var $this = $(this);

        // Check for settings bound from previous events
        // of a different type (i.e., only run once but for
        // each of drag, dragend, dragstart)
        if($this.data(drag.key)) { return; }

        var options = $.extend(drag.settings, data);

        // On first time event is bound to element:
        // add the data to the object
        $this.data(drag.key, options);

        if(options.cursor) { $this.css("cursor", "pointer"); }

        // Attach a mousedown/ touchstart event to
        // bootstrap the interaction. This enables
        // more control over when the actual dragging
        // handler is bound
        $this.on("touchstart.drag mousedown.drag", options, drag.starter);
    },

    // Called when the last event handler is removed from the element
    teardown: function(namespaces) {
        //var data = $.data(this, drag.key) || {};

        // Remove the stored drag data stored in the element
        $(this).data(drag.key, "");

        $this.css("cursor", "");

        // Unbind the handler
        this.off("touchstart.drag mousedown.drag");

        // Re-enable text selectability
        drag.setTextSelectability(true);
    },

    // Called each time a handler is bound to the event
    add: function(handleObj) {
        // NOTE: the handleObj has the following properties:
        //      type: name of the event
        //      data: data passed in with this binding
        //      namespace: dot delimited list of namespaces
        //      handler: the function used to handle this event
        //      guid: unique ID of handler
        //      selector: selector for delegated events

        // this is bound to the element to which the event is being bound

        var data = $(this).data(drag.key);

        // Add another related event
        data.related += 1;
        drag.handlers[handleObj.type] = handleObj.handler;

        // Add any extra options passed during binding
        $.extend(data, handleObj.data || {});
    },

    // Called each time a handler is unbound for the event
    remove: function(handleObj) {
        // NOTE: handleObj has same attributes as for add()

        // Remove the related event
        $.data(this, drag.key).related -= 1;
    },

    // The default behaviour for the event, called unless
    // event.preventDefault() is called in handler
    _default: function(event) {

    },



//        ___          ___                     ___
//       /__/\        /  /\       ___         /__/\
//      |  |::\      /  /::\     /  /\        \  \:\
//      |  |:|:\    /  /:/\:\   /  /:/         \  \:\
//    __|__|:|\:\  /  /:/~/::\ /__/::\     _____\__\:\
//   /__/::::| \:\/__/:/ /:/\:\\__\/\:\__ /__/::::::::\
//   \  \:\~~\__\/\  \:\/:/__\/   \  \:\/\\  \:\~~\~~\/
//    \  \:\       \  \::/         \__\::/ \  \:\  ~~~
//     \  \:\       \  \:\         /__/:/   \  \:\
//      \  \:\       \  \:\        \__\/     \  \:\
//       \__\/        \__\/                   \__\/

    starter: function(event) {

        // Prevent multiple touches
        if(drag.touches) { return; }

        // Record whether touch is in progress
        drag.touches = event.type == "touchstart" ? 1 : 0;

        drag.setTextSelectability(false);

        var data = $(this).data(drag.key);

        if(!drag.check.anyFalse(
            // Only allow clicks to start with the left click (event.which = 1)
            !drag.touches && event.which != 1,

            // If a handle was specified, check to see if it is
            // what is being dragged
            // .closest is run in the context of the current target
            // so it doesn't have to go all the way up the tree
            // Remember that event.target was the actual touched element while
            // event.currentTarget is the bound element
            data.handle && $(event.target).closest(data.handle, event.currentTarget).length < 1
        )) { return; }

        data.target = event.target;
        data.pageX = event.originalEvent.pageX;
        data.pageY = event.originalEvent.pageY;

        // Bind the new events
        if(drag.touches) {
            $(this).on("touchmove.drag touchend.drag", data, drag.handler);
        } else {
            // populate the data object
            $(document).on("mousemove.drag mouseup.drag", data, drag.handler);
        }

    },

    handler: function(event) {
        var data = event.data;
        if(!data) { return; }

        switch(event.type) {
            case "touchmove":
            case "mousemove":
                event.preventDefault();
                drag.configureEvent(event, data);
                if(!drag.dragging && event.distance > data.distance) {
                    drag.dragging = true;
                    drag.dispatchEvent("dragstart", event, this);
                } else if(drag.dragging) {
                    drag.dispatchEvent("drag", event, this);
                }
                break;

            case "touchend":
            case "mouseup":
                drag.configureEvent(event, data);
                drag.dragging = false;
                drag.dispatchEvent("dragend", event, this);
                $(document).off("mousemove.drag mouseup.drag");
                drag.touches = 0;
                break;
        }
    },



//        ___          ___                       ___       ___          ___          ___
//       /__/\        /  /\                     /  /\     /  /\        /  /\        /  /\
//       \  \:\      /  /:/_                   /  /::\   /  /:/_      /  /::\      /  /:/_
//        \__\:\    /  /:/ /\   ___     ___   /  /:/\:\ /  /:/ /\    /  /:/\:\    /  /:/ /\
//    ___ /  /::\  /  /:/ /:/_ /__/\   /  /\ /  /:/~/://  /:/ /:/_  /  /:/~/:/   /  /:/ /::\
//   /__/\  /:/\:\/__/:/ /:/ /\\  \:\ /  /://__/:/ /://__/:/ /:/ /\/__/:/ /:/___/__/:/ /:/\:\
//   \  \:\/:/__\/\  \:\/:/ /:/ \  \:\  /:/ \  \:\/:/ \  \:\/:/ /:/\  \:\/:::::/\  \:\/:/~/:/
//    \  \::/      \  \::/ /:/   \  \:\/:/   \  \::/   \  \::/ /:/  \  \::/~~~~  \  \::/ /:/
//     \  \:\       \  \:\/:/     \  \::/     \  \:\    \  \:\/:/    \  \:\       \__\/ /:/
//      \  \:\       \  \::/       \__\/       \  \:\    \  \::/      \  \:\        /__/:/
//       \__\/        \__\/                     \__\/     \__\/        \__\/        \__\/

    configureEvent: function(event, data) {
        // Set the new event type and remove the old one
        event.deltaX = event.originalEvent.pageX - data.pageX;
        event.deltaY = event.originalEvent.pageY - data.pageY;
        event.distance = Math.sqrt(
                            Math.pow(Math.abs(event.deltaX), 2) +
                            Math.pow(Math.abs(event.deltaY), 2)
                         );
    },

    dispatchEvent: function(type, event, elem) {
        if(drag.handlers[type]) {
            event.type = type;
            event.originalEvent = null;
            drag.handlers[type].apply(elem, [event]);
        }
    },

    setTextSelectability: function(textSelectable) {
        if(!textSelectable) {
            $(document).on("selectstart", function() { return false; })
                       .css("MozUserSelect", "false");
            document.unselectable = true;
        } else {
            $(document).off("selectstart")
                       .css("MozUserSelect", "");
            document.unselectable = false;
        }
    },

    check: {
        anyFalse: function() {
            for(var i = 0; i < arguments.length; i++) {
                if(!arguments[i]) { return true; }
            }
            return false;
        },

        allFalse: function() {
            for(var i = 0; i < arguments.length; i++) {
                if(arguments[i]) { return false; }
            }
            return true;
        }
    }
};

$specialEvent.dragstart = $specialEvent.dragend = drag;


// -----


(function() {
  var Notification, NotificationAction, NotificationActionType, na1f, na2f,
    __slice = [].slice;

  Notification = (function() {
    function Notification() {
      var $actions, $container, $messageHTML, $n, actions, defaults, message, messageHTML, n, options, _i;
      message = arguments[0], actions = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
      if (options == null) {
        options = {};
      }
      if (options instanceof NotificationAction) {
        actions.push(options);
        options = {};
      }
      defaults = {
        container: ".notification-device:first",
        activate: true,
        draggable: true
      };
      options = $.extend(defaults, options);
      if (message instanceof jQuery) {
        this.notification = message;
        this.wrapper = message.find(".notification-wrapper");
        this.handle = message.find(".notification-handle");
        this.actions = message.find(".notification-actions");
      } else {
        messageHTML = Notification.messageTemplate;
        $messageHTML = void 0;
        if (toString.call(message).match(/String/i)) {
          messageHTML = messageHTML.replace("BODY", message);
          $messageHTML = $(messageHTML);
          $messageHTML.find(".notification-title").remove();
        } else {
          messageHTML = messageHTML.replace(/(BODY|TITLE)/, function(match) {
            return message[match.toLowerCase()];
          });
          $messageHTML = $(messageHTML);
        }
        console.log(toString.call(message));
        $n = $(Notification.template);
        $n.find(".notification-content").append($messageHTML);
        $actions = $n.find(".notification-actions");
        actions.forEach((function(_this) {
          return function(action) {
            _this._attachDefaultBehaviors(action);
            return $actions.append(action.action);
          };
        })(this));
        if ((options.container != null) && ($container = $(options.container)).length > 0) {
          $container.append($n);
        }
        this.notification = $n;
        this.wrapper = $n.find(".notification-wrapper");
        this.handle = $n.find(".notification-handle");
        this.actions = $actions;
      }
      if (options.draggable) {
        this.makeDraggable();
      }
      if (options.activate) {
        n = this;
        setTimeout(function() {
          return n.activate();
        }, 50);
      }
    }

    Notification.prototype.dismiss = function() {
      return this.notification.removeClass("interacting dragging active");
    };

    Notification.prototype.activate = function() {
      this.wrapper.css("padding-bottom", "");
      this.actions.css("opacity", "");
      this.handle.css("opacity", "");
      return this.notification.addClass("active").css("transform", "");
    };

    Notification.prototype.makeDraggable = function() {
      var $actions, $handle, $nWrapper, actionHeight, deltaSize, lastComplete, maxVerticalOverflow, notification, startDeltaY, startPadding, that;
      that = this;
      notification = this.notification;
      $actions = this.actions;
      $handle = this.handle;
      $nWrapper = this.wrapper;
      actionHeight = $actions.outerHeight();
      startPadding = parseFloat($nWrapper.css("padding-bottom"));
      deltaSize = actionHeight - startPadding;
      startDeltaY = void 0;
      lastComplete = 0;
      maxVerticalOverflow = parseFloat(notification.css("padding-top"));
      notification.on("dragstart", function(event) {
        return notification.addClass("dragging");
      });
      notification.on("drag", function(event) {
        var complete, easeOutDelta;
        if (!notification.hasClass("interacting")) {
          if (startDeltaY == null) {
            startDeltaY = event.deltaY;
          }
          complete = Math.max(Math.min(1, (event.deltaY - startDeltaY) / deltaSize), 0);
          if (lastComplete !== complete) {
            lastComplete = complete;
            $actions.css("opacity", complete);
            $handle.css("opacity", 1 - complete);
            return $nWrapper.css("padding-bottom", "" + (startPadding + complete * deltaSize) + "px");
          } else if (complete === 1) {
            easeOutDelta = that._dragEaseOut(event.deltaY - startDeltaY - deltaSize);
            return notification.css("transform", "translateY(" + (Math.min(easeOutDelta, maxVerticalOverflow)) + "px)");
          }
        } else {
          easeOutDelta = that._dragEaseOut(event.deltaY);
          return notification.css("transform", "translateY(" + (Math.min(maxVerticalOverflow, easeOutDelta)) + "px)");
        }
      });
      return notification.on("dragend", function(event) {
        var textbox;
        notification.removeClass("dragging").css("transform", "");
        if (lastComplete < 1) {
          $actions.css("opacity", "");
          $handle.css("opacity", "");
          return $nWrapper.css("padding-bottom", "");
        } else {
          notification.addClass("interacting");
          if ((textbox = $actions.find("input[type=text]")).length > 0) {
            return textbox.focus();
          }
        }
      });
    };

    Notification.prototype.switchActions = function() {
      var $newActionContainer, $oldActionContainer, newActions;
      newActions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      $newActionContainer = $("<div class='notification-actions' />");
      newActions.forEach((function(_this) {
        return function(action) {
          _this._attachDefaultBehaviors(action);
          return $newActionContainer.append(action.action);
        };
      })(this));
      $oldActionContainer = this.actions;
      this.actions = $newActionContainer;
      $newActionContainer.insertAfter($oldActionContainer);
      $oldActionContainer.addClass("switching-out");
      return setTimeout(function() {
        var focused, i, _i, _ref, _results;
        $newActionContainer.addClass("switching-in");
        _results = [];
        for (i = _i = 0, _ref = newActions.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          focused = newActions[i].focus();
          if (focused) {
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }, 50);
    };

    Notification.prototype._dragEaseOut = function(val) {
      return 1.2 * Math.pow(val, 3 / 5);
    };

    Notification.prototype._attachDefaultBehaviors = function(action) {
      var notification, textAction;
      textAction = action.textAction;
      notification = this;
      if (action.type === "button") {
        return action.input.on("click", function(event) {
          return action.callback(event, notification);
        });
      } else if (action.type === "submit") {
        return action.input.on("click", function(event) {
          var text;
          text = "";
          text = textAction instanceof NotificationAction ? textAction.input.val() : textAction != null ? textAction.find("input[type=text]").val() : void 0;
          event.text = text;
          return action.callback(event, notification);
        });
      }
    };

    return Notification;

  })();

  Notification.template = "<div class='notification-ios'> <div class='notification-wrapper'> <div class='notification-content'></div> <div class='notification-actions'></div> <div class='notification-handle'></div> </div> </div>";

  Notification.messageTemplate = "<div class='notification-icon'></div> <div class='notification-message'> <h3 class='notification-title'>TITLE</h3> <p class='notification-body'>BODY</p> </div>";

  NotificationAction = (function() {
    function NotificationAction(options) {
      var classID, defaults, element, html;
      defaults = {
        type: "button",
        label: "Button",
        placeholder: "Message",
        id: "",
        "class": "",
        textAction: void 0,
        callback: function() {}
      };
      options = $.extend(defaults, options);
      classID = "";
      if (options["class"].length > 0) {
        classID += " class = '" + options["class"] + "'";
      }
      if (options.id.length > 0) {
        classID += " id = '" + options.id + "'";
      }
      html = (function() {
        switch (options.type) {
          case "button":
            return "<button" + classID + ">" + options.label + "</button>";
          case "submit":
            return "<input" + classID + " type='submit' value='" + options.label + "'>";
          case "text":
            return "<input" + classID + " type='text' placeholder='" + options.placeholder + "'>";
          default:
            return "";
        }
      })();
      element = NotificationAction.template.replace(/(TYPE|ELEMENT)/g, function(match) {
        switch (match) {
          case "TYPE":
            return options.type;
          case "ELEMENT":
            return html;
        }
      });
      this.action = $(element);
      this.input = this.action.children();
      this.type = options.type;
      this.textAction = options.textAction;
      this.callback = options.callback;
    }

    NotificationAction.prototype.focus = function() {
      if (this.type === NotificationActionType.textField) {
        this.input.trigger("focus");
        return true;
      } else {
        return false;
      }
    };

    return NotificationAction;

  })();

  NotificationAction.template = "<div class='notification-action TYPE'>ELEMENT</div>";

  NotificationActionType = (function() {
    function NotificationActionType() {}

    return NotificationActionType;

  })();

  NotificationActionType.button = "button";

  NotificationActionType.submitButton = "submit";

  NotificationActionType.textField = "text";

  window.Notification = Notification;

  window.NotificationAction = NotificationAction;

  window.NotificationActionType = NotificationActionType;

  na1f = function(e) {
    return alert("You pressed button '" + ($(e.target).text()) + "'!");
  };

  na2f = function(e) {
    return console.log(e.text);
  };

  window.na1 = new NotificationAction(na1f, {
    type: "text",
    placeholder: "Your Message Here"
  });

  window.na2 = new NotificationAction(na2f, {
    type: "submit",
    label: "Send",
    textAction: na1
  });

  window.na3 = new NotificationAction(na1f, {
    type: "button",
    label: "Button 1"
  });

  window.na4 = new NotificationAction(na1f, {
    type: "button",
    label: "Button 2"
  });

  $(function() {
    var action1, action2, action3, theNotification;
    $(".notification-ios:first").remove();
    action1 = new NotificationAction({
      type: NotificationActionType.button,
      label: "Mark as Read",
      callback: function() {
        return alert("You marked the message as read.");
      }
    });
    action3 = new NotificationAction({
      type: NotificationActionType.button,
      label: "View",
      callback: function() {}
    });
    action2 = new NotificationAction({
      type: NotificationActionType.button,
      label: "Reply",
      callback: function() {
        var newAction1, newAction2;
        newAction1 = new NotificationAction({
          type: NotificationActionType.textField
        });
        newAction2 = new NotificationAction({
          type: NotificationActionType.submitButton,
          label: "Send",
          textAction: newAction1,
          callback: function(event, notification) {
            alert(event.text);
            return notification.dismiss();
          }
        });
        return theNotification.switchActions(newAction1, newAction2);
      }
    });
    theNotification = new Notification("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione est cupiditate minima ea voluptatem accusantium quia, nobis earum ipsum voluptas.", action1, action3, action2);
    return setTimeout(function() {
      return theNotification.activate();
    }, 2000);
  });

}).call(this);
