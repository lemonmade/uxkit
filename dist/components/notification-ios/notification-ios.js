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
