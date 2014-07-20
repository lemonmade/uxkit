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