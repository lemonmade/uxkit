class Notification
    constructor: (message, actions..., options = {}) ->
        # If the last element is actually a notification action, then
        # append it to the array of those actions
        if options instanceof NotificationAction
            actions.push options
            options = {}

        # Create options hash
        defaults =
            container: ".notification-device:first"
            activate: true
            draggable: true

        options = $.extend defaults, options

        # If a pre-constructed message is passed in, just accept it
        if message instanceof jQuery
            @notification = message
            @wrapper = message.find ".notification-wrapper"
            @handle = message.find ".notification-handle"
            @actions = message.find ".notification-actions"

        else
            # Create HTML for the notification
            messageHTML = Notification.messageTemplate
            $messageHTML = undefined
            if toString.call(message).match /String/i
                messageHTML = messageHTML.replace "BODY", message
                $messageHTML = $(messageHTML)
                $messageHTML.find(".notification-title").remove()
            else
                messageHTML = messageHTML.replace /(BODY|TITLE)/, (match) -> message[match.toLowerCase()]
                $messageHTML = $(messageHTML)

            console.log toString.call(message)

            $n = $(Notification.template)
            $n.find(".notification-content").append $messageHTML

            # Append all passed actions
            $actions = $n.find ".notification-actions"
            actions.forEach (action) =>
                @_attachDefaultBehaviors action
                $actions.append action.action

            # If container exists, append new notification to it
            $container.append($n) if options.container? and ($container = $(options.container)).length > 0

            # Storage for easy access
            @notification = $n
            @wrapper = $n.find ".notification-wrapper"
            @handle = $n.find ".notification-handle"
            @actions = $actions

        # Additional interaction options
        @makeDraggable() if options.draggable

        if options.activate
            n = this
            setTimeout () ->
                n.activate()
            , 50

    dismiss: () -> @notification.removeClass("interacting dragging active")

    activate: () ->
        @wrapper.css "padding-bottom", ""
        @actions.css "opacity", ""
        @handle.css "opacity", ""
        @notification.addClass("active").css "transform", ""

    makeDraggable: () ->
        that = this
        notification = @notification
        $actions = @actions
        $handle = @handle
        $nWrapper = @wrapper

        actionHeight = $actions.outerHeight()
        startPadding = parseFloat($nWrapper.css "padding-bottom")
        deltaSize = actionHeight - startPadding
        startDeltaY = undefined
        lastComplete = 0
        maxVerticalOverflow = parseFloat(notification.css "padding-top")

        notification.on "dragstart", (event) ->
            notification.addClass "dragging"

        notification.on "drag", (event) ->
            unless notification.hasClass "interacting"
                startDeltaY ?= event.deltaY
                complete = Math.max(Math.min(1, (event.deltaY-startDeltaY)/deltaSize), 0)
                if lastComplete isnt complete
                    lastComplete = complete
                    $actions.css "opacity", complete
                    $handle.css "opacity", (1-complete)
                    $nWrapper.css "padding-bottom", "#{startPadding + complete*deltaSize}px"

                else if complete is 1
                    easeOutDelta = that._dragEaseOut (event.deltaY - startDeltaY - deltaSize)
                    notification.css "transform", "translateY(#{Math.min(easeOutDelta, maxVerticalOverflow)}px)"

            else
                easeOutDelta = that._dragEaseOut event.deltaY
                notification.css "transform", "translateY(#{Math.min maxVerticalOverflow, easeOutDelta}px)"

        notification.on "dragend", (event) ->
            notification.removeClass("dragging").css "transform", ""
            if lastComplete < 1
                $actions.css "opacity", ""
                $handle.css "opacity", ""
                $nWrapper.css "padding-bottom", ""
            else
                notification.addClass "interacting"
                if (textbox = $actions.find("input[type=text]")).length > 0
                    textbox.focus()

    switchActions: (newActions...) ->
        $newActionContainer = $("<div class='notification-actions' />")
        newActions.forEach (action) =>
            @_attachDefaultBehaviors action
            $newActionContainer.append action.action
        $oldActionContainer = @actions
        @actions = $newActionContainer
        $newActionContainer.insertAfter $oldActionContainer
        $oldActionContainer.addClass "switching-out"
        setTimeout () ->
            $newActionContainer.addClass "switching-in"
            for i in [0..newActions.length]
                focused = newActions[i].focus()
                break if focused
        , 50

    _dragEaseOut: (val) -> 1.2*Math.pow(val, (3/5))

    _attachDefaultBehaviors: (action) ->
        textAction = action.textAction
        notification = this

        if action.type is "button"
            action.input.on "click", (event) ->
                action.callback event, notification

        else if action.type is "submit"
            action.input.on "click", (event) ->
                text = ""
                text = if textAction instanceof NotificationAction
                    textAction.input.val()
                else if textAction?
                    textAction.find("input[type=text]").val()

                event.text = text
                action.callback event, notification

Notification.template =     "<div class='notification-ios'>
                                <div class='notification-wrapper'>
                                    <div class='notification-content'></div>
                                    <div class='notification-actions'></div>
                                    <div class='notification-handle'></div>
                                </div>
                            </div>"

Notification.messageTemplate =  "<div class='notification-icon'></div>
                                 <div class='notification-message'>
                                    <h3 class='notification-title'>TITLE</h3>
                                    <p class='notification-body'>BODY</p>
                                 </div>"



class NotificationAction
    constructor: (options) ->
        defaults =
            type: "button"
            label: "Button"
            placeholder: "Message"
            id: ""
            class: ""
            textAction: undefined
            callback: () ->

        options = $.extend defaults, options

        classID = ""
        classID += " class = '#{options.class}'" if options.class.length > 0
        classID += " id = '#{options.id}'" if options.id.length > 0

        html = switch options.type
            when "button" then "<button#{classID}>#{options.label}</button>"
            when "submit" then "<input#{classID} type='submit' value='#{options.label}'>"
            when "text" then "<input#{classID} type='text' placeholder='#{options.placeholder}'>"
            else ""

        element = NotificationAction.template.replace /(TYPE|ELEMENT)/g, (match) ->
            switch match
                when "TYPE" then options.type
                when "ELEMENT" then html

        @action = $(element)
        @input = @action.children()
        @type = options.type
        @textAction = options.textAction
        @callback = options.callback

    focus: () ->
        if @type == NotificationActionType.textField
            @input.trigger("focus")
            return true
        else
            return false

NotificationAction.template = "<div class='notification-action TYPE'>ELEMENT</div>"


class NotificationActionType
    constructor: () ->

NotificationActionType.button = "button"
NotificationActionType.submitButton = "submit"
NotificationActionType.textField = "text"


window.Notification = Notification
window.NotificationAction = NotificationAction
window.NotificationActionType = NotificationActionType







na1f = (e) ->
    alert "You pressed button '#{$(e.target).text()}'!"

na2f = (e) ->
    console.log(e.text)

window.na1 = new NotificationAction na1f, {type: "text", placeholder: "Your Message Here"}
window.na2 = new NotificationAction na2f, {type: "submit", label: "Send", textAction: na1}
window.na3 = new NotificationAction na1f, {type: "button", label: "Button 1"}
window.na4 = new NotificationAction na1f, {type: "button", label: "Button 2"}

$ ->
    # existingNotification.makeDraggable()
    # setTimeout () ->
    #     existingNotification.activate()
    # , 1000

    $(".notification-ios:first").remove();

    action1 = new NotificationAction
        type: NotificationActionType.button
        label: "Mark as Read"
        callback: () ->
            alert "You marked the message as read."

    action3 = new NotificationAction
        type: NotificationActionType.button
        label: "View"
        callback: () ->

    action2 = new NotificationAction
        type: NotificationActionType.button
        label: "Reply"
        callback: () ->
            newAction1 = new NotificationAction type: NotificationActionType.textField
            newAction2 = new NotificationAction
                type: NotificationActionType.submitButton
                label: "Send"
                textAction: newAction1
                callback: (event, notification) ->
                    alert event.text
                    notification.dismiss()
            theNotification.switchActions newAction1, newAction2

    theNotification = new Notification "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione est cupiditate minima ea voluptatem accusantium quia, nobis earum ipsum voluptas.", action1, action3, action2

    setTimeout () ->
        theNotification.activate()
    , 2000

    # $(document).on "click", ".notification-action:last-child *", () ->
    #     $this = $(this)
    #     console.log $this.text()
    #     if $this.val() is "Send" then return
    #     newAction1 = new NotificationAction type: NotificationActionType.textField
    #     newAction2 = new NotificationAction
    #         type: NotificationActionType.submitButton
    #         label: "Send"
    #         textAction: newAction1
    #         callback: (event, notification) ->
    #             alert event.text
    #             notification.dismiss()

    #     existingNotification.switchActions newAction1, newAction2