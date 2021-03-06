DAYS_IN_MS = 86400000
$w = $(window)

# transitionEnd
# ----------------------------------------------------------------------
# Calls a function when the transition on that jQuery object ends (called only once)

$.fn.transitionEnd = (handler) ->
    this.one "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", handler


# animationEnd
# ----------------------------------------------------------------------
# Calls a function when the animation on that jQuery object ends (called only once)

$.fn.animationEnd = (handler) ->
    this.one "webkitAnimationEnd oanimationend msAnimationEnd animationend", handler

$.fn.verticalSpaceAvail = ->
    this.offset().top - $w.scrollTop()





class MessageBubble
    constructor: ->

# The standard template for a message bubble
MessageBubble.template =    "<div class='message-bubble'>
                                <div class='message-bubble-inner'>
                                MESSAGE
                                <svg style='display: none' class='message-bubble-whale-tail' width='116px' height='119px' viewBox='0 0 116 119' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' enable-background='new 0 0 116.42 97.35' xml:space='preserve'>
                                <path fill='#A0A0A0' d='M67.39,79.03 C84.24,104.95 116.42,115.32 116.42,115.32 C116.42,115.32 73.88,124.39 46.66,115.32 C19.44,106.24 0,79.03 0,79.03 L0,-0.227279902 L51.8400002,-0.227279902 L51.84,22 C51.84,22 50.54,53.1 67.39,79.03 Z'></path>
                                </svg>
                                </div>
                            </div>"





#        ___          ___          ___                   ___          ___
#       /  /\        /  /\        /__/\         ___     /  /\        /  /\
#      /  /:/       /  /::\       \  \:\       /  /\   /  /::\      /  /::\
#     /  /:/       /  /:/\:\       \  \:\     /  /:/  /  /:/\:\    /  /:/\:\   ___     ___
#    /  /:/  ___  /  /:/  \:\  _____\__\:\   /  /:/  /  /:/~/:/   /  /:/  \:\ /__/\   /  /\
#   /__/:/  /  /\/__/:/ \__\:\/__/::::::::\ /  /::\ /__/:/ /:/___/__/:/ \__\:\\  \:\ /  /:/
#   \  \:\ /  /:/\  \:\ /  /:/\  \:\~~\~~\//__/:/\:\\  \:\/:::::/\  \:\ /  /:/ \  \:\  /:/
#    \  \:\  /:/  \  \:\  /:/  \  \:\  ~~~ \__\/  \:\\  \::/~~~~  \  \:\  /:/   \  \:\/:/
#     \  \:\/:/    \  \:\/:/    \  \:\          \  \:\\  \:\       \  \:\/:/     \  \::/
#      \  \::/      \  \::/      \  \:\          \__\/ \  \:\       \  \::/       \__\/
#       \__\/        \__\/        \__\/                 \__\/        \__\/

class MessageBubbleController
    #        ___                   ___          ___
    #       /  /\         ___     /  /\        /  /\
    #      /  /:/        /  /\   /  /::\      /  /::\
    #     /  /:/        /  /:/  /  /:/\:\    /  /:/\:\
    #    /  /:/  ___   /  /:/  /  /:/  \:\  /  /:/~/:/
    #   /__/:/  /  /\ /  /::\ /__/:/ \__\:\/__/:/ /:/___
    #   \  \:\ /  /://__/:/\:\\  \:\ /  /:/\  \:\/:::::/
    #    \  \:\  /:/ \__\/  \:\\  \:\  /:/  \  \::/~~~~
    #     \  \:\/:/       \  \:\\  \:\/:/    \  \:\
    #      \  \::/         \__\/ \  \::/      \  \:\
    #       \__\/                 \__\/        \__\/

    constructor: (settings = {}) ->

        # settings can have any of the following attributes:
        # - automateDateSections: whether the controller should automate the creation of date sections, defaults to true
        # - dateSectionCutoff: way that messages should be cutoff into sections, defaults to "unique-day"
        # - container: default container into which elements are inserted

        $messageBubbleContainer = $(".message-bubble-container")
        $messageBubbleContainer = $("body") if $messageBubbleContainer.length < 1
        # Container is settings.container, or $(".message-bubble-container"), or $("body")
        @container = if settings.container? then settings.container else $messageBubbleContainer

        # Store message bubbles for easy access
        @messages = $(".message-bubble")

        # The standard template for a message bubble date section
        @_messageDateSectionHTML = "<section class='message-bubble-date-section' />"

        # The data attribute in which the message timestamp is stored
        @_timestampKey = "message-timestamp"
        @_timestamper = new Timestamper

        # Settings governing whether and how automatic date sections are constructed
        @automateDateSections = if settings.automateDateSections? then settings.automateDateSections else true
        @dateSectionCutoff = if settings.dateSectionCutoff? then settings.dateSectionCutoff else "unique-day"



    #        ___          ___                       ___          ___          ___
    #       /  /\        /  /\                     /  /\        /  /\        /  /\
    #      /  /:/       /  /::\                   /  /::\      /  /::\      /  /:/_
    #     /  /:/       /  /:/\:\   ___     ___   /  /:/\:\    /  /:/\:\    /  /:/ /\
    #    /  /:/  ___  /  /:/  \:\ /__/\   /  /\ /  /:/  \:\  /  /:/~/:/   /  /:/ /::\
    #   /__/:/  /  /\/__/:/ \__\:\\  \:\ /  /://__/:/ \__\:\/__/:/ /:/___/__/:/ /:/\:\
    #   \  \:\ /  /:/\  \:\ /  /:/ \  \:\  /:/ \  \:\ /  /:/\  \:\/:::::/\  \:\/:/~/:/
    #    \  \:\  /:/  \  \:\  /:/   \  \:\/:/   \  \:\  /:/  \  \::/~~~~  \  \::/ /:/
    #     \  \:\/:/    \  \:\/:/     \  \::/     \  \:\/:/    \  \:\       \__\/ /:/
    #      \  \::/      \  \::/       \__\/       \  \::/      \  \:\        /__/:/
    #       \__\/        \__\/                     \__\/        \__\/        \__\/

    # NOTE
    # Coloring of message bubbles should probably be done in CSS to avoid inline styles,
    # but these methods can be helpful for highlighting/ minor color alterations


    # setBackgroundColor
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Sets the background color for message bubbles matching the passed selector.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # color:        The background color you'd like for the message bubble.
    # sel:          The selector that must be matched by the colored message.

    setBackgroundColor: (color, sel) ->
        @getSubsetOfMessages sel
            .each ->
                $this = $(this)
                $this.css "background-color", color
                # get the tail and color it as well
                $this.find ".message-bubble-whale-tail path"
                     .css "fill", color


    # setTextColor
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Sets the text color for message bubbles matching the passed selector.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # color:        The text color you'd like for the message bubble.
    # sel:          The selector that must be matched by the colored message.

    setTextColor: (color, sel) ->
        @getSubsetOfMessages sel
            .each ->
                $(this).css "color", color



    #        ___         _____        _____
    #       /  /\       /  /::\      /  /::\
    #      /  /::\     /  /:/\:\    /  /:/\:\
    #     /  /:/\:\   /  /:/  \:\  /  /:/  \:\
    #    /  /:/~/::\ /__/:/ \__\:|/__/:/ \__\:|
    #   /__/:/ /:/\:\\  \:\ /  /:/\  \:\ /  /:/
    #   \  \:\/:/__\/ \  \:\  /:/  \  \:\  /:/
    #    \  \::/       \  \:\/:/    \  \:\/:/
    #     \  \:\        \  \::/      \  \::/
    #      \  \:\        \__\/        \__\/
    #       \__\/


    # newMessageBubble
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Add a new message to the page.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # msg:          The HTML content of the message.
    # options:      An object literal containing options for how the message should be added.
    #               see below for the defaults and explanations of each option.

    newMessageBubble: (msg, options = {}) ->
        defaults =
            after: null             # Element after which the new message should be inserted
            append: true            # If a container element is specified, this decies whether
                                    # the message is appended (true) or prepended (false)
            container: null         # Parent in which to insert the new message
            artificialDate: null    # Date to timestamp the message (anything parseable by Date.parse())
            timestamp: true         # Whether or not to add a timestamp (data-message-timestamp) to the message
            tail: true              # Whether to add a tail to the message (done through omission of no-tail class)
            inReplyTo: null         # A message to which this message is a reply to
            reply: false            # Whether or not this message is a reply (add reply class)
            animate: null           # Details on how to animate the element in. See below for details.

        options = $.extend defaults, options

        # Create the new message
        $message = $(MessageBubble.template.replace "MESSAGE", msg).addClass("temp-hide")

        # Hide element for now so animation can be determined post-DOM addition
        if options.animate? then $message.css "visibility", "none"

        # If append given as an element, set that as the container and append to be true
        # (accounts for a possible alternate interpretation of the append option as the element to which
        # the element is to be appended)
        if options.append instanceof jQuery or
            Object::toString.call(options.append) is "[object String]"
                options.container = $(options.append)
                options.append = true

        # Add a timestamp to the message
        if options.timestamp
            # timestamp with artificalDate if given
            time = if options.artificialDate? then new Date(options.artificialDate) else new Date
            $message.attr "data-#{@_timestampKey}", time.getTime()
            @timestamp $message

        $message.addClass "no-tail" unless options.tail
        $message.addClass "reply" if options.reply

        # If inReplyTo given and identifies a vaild jQuery object...
        if options.inReplyTo? and ($replyMsg = $(options.inReplyTo)).length > 0
            # Set the presence of the reply class to the opposite of the inReplyTo object
            $message[if $replyMsg.hasClass("reply") then "removeClass" else "addClass"] "reply"

        # NOTE ON PRECENDENCE FOR POSITIONING
        # The following are the possible insertion position adjustment
        # options, in descending order of precendence:
        # 1. options.after to specify a message after which it should be placed
        # 2. options.before to specify a message before which it should be placed
        # 3. settings.automateDateSections && options.timestamp && more than one message.
        #    This will automate the creation of date sections based on the difference
        #    in timestamps and settings.dateSectionCutoff
        # 4. Insertion in the container specified in the function options array, modified
        #    with the options.append attribute. (this will insert the message at the end
        #    of a date section if one exists at the end (append) or beginning (prepend)
        #    of the container. This will obviously ignore automating of date sections).
        # 5. Insertion in the container specified by the init function for MessageBubbleController.
        #    (same caveats as for #4).
        # 6. Insertion in .message-bubble-container, if such an element exists
        #    (body if one does not), if no user-passed container is specified.
        #    (same caveats apply as for #4-5)

        if options.after
            $message.insertAfter $afterElement if ($afterElement = $(options.after)).length > 0

        else if options.before
            $message.insertBefore $beforeElement if ($beforeElement = $(options.before)).length > 0

        # Automation of date section creation, only if a timestamp exists
        else if @automateDateSections and options.timestamp? and @messages.length > 0
            # Get the last message
            $lastMsg = @messages.last()

            # Compare the timestamp of the new message to that of the last message (make it in days)
            curTSinDays = Math.floor new Date($message.data(@_timestampKey)).getTime()/DAYS_IN_MS
            lastTSinDays = Math.floor new Date($lastMsg.data(@_timestampKey)).getTime()/DAYS_IN_MS

            if curTSinDays - lastTSinDays >= 1
                # If the difference is >= 1 day, append the new message, in a date section, after the last message
                # (or the containing date section of the last message, if it is in one)
                $insertionPoint =   if($lastDateSection = $lastMsg.closest ".message-bubble-date-section").length > 0
                                        $lastDateSection
                                    else
                                        $lastMsg
                @_makeQuickDateSection($message).insertAfter $insertionPoint
            else
                # Otherwise, just insert the new message directly after the previous one
                $message.insertAfter $lastMsg

        else
            # Container is the one passed as an option, if it exists, or the main container element
            $container = if options.container? then $(options.container) else @container
            # Get the first or last child depending on whether it is to be prepended or appended (respectively)
            $relevantContainerChild = $container.children(if options.append then ":last-child" else ":first-child")
            # If the element identified above is a date section, insert the element into that date section
            # rather than the container (makes sense that existing date sections should be respected, though
            # automatic and manual positioning of elements should be avoided)
            $container = $relevantContainerChild if $relevantContainerChild.hasClass "message-bubble-date-section"

            # Actually append/ prepend the new message
            $message[if options.append then "appendTo" else "prependTo"] $container

        if options.animate? then @_resolveAddAnimation $message, options.animate else $message.removeClass("temp-hide")

        # Update the internal storage of messages
        @_update()
        # Return the message for chaining
        return $message

    # TODO
    _resolveAddAnimation: ($msg, animate) ->
        # Animate should be an object with the following structure:

        # animate =
        #   props: <string>
        #   duration: <number>
        #   delay: <number>
        #   timingFunction: <string>
        #   from: <string>
        #   callback: <function>

        defaults =
            props: null
            duration: 400
            delay: 0
            timingFunction: "ease"
            from: "right"
            callback: null

        options = $.extend defaults, animate

        return null unless options.duration?

        options.timingFunction = "cubic-bezier(0.37, 1.65, 0.305, 0.855)" if options.timingFunction is "spring"

        # TODO: from an element to mimic the messages app
        if ["right", "left", "top", "bottom"].indexOf(options.from) >= 0
            # Create an animation from a specified location
            $container = $msg.parent()
            endTransition = "transform #{options.duration}#{if options.duration < 10 then "s" else "ms"} #{options.timingFunction}"

            startTranslate = switch options.from
                when "right" then $container.outerWidth() + $container.offset().left - $msg.offset().left
                when "left" then -($msg.outerWidth() + $msg.offset().left - $container.offset().left)
                when "top" then -($msg.outerHeight() + $msg.offset().top - Math.max(window.scrollY, $container.offset().top))
                when "bottom"
                    offset = $msg.offset()
                    Math.min $w.height() - (offset.top - $w.scrollTop()),
                             $msg.outerHeight() + $msg.offset().top - Math.max(window.scrollY, $container.offset().top)

            startTranslate = switch options.from
                when "right", "left" then "translate(#{startTranslate}px, 0)"
                when "top", "bottom" then "translate(0, #{startTranslate}px)"

            $msg.css "transform", startTranslate

            $msg.transitionEnd ->
                $msg.css
                    "transition": "",
                    "-webkit-transition": "",
                    "transform": ""

            setTimeout ->
                $msg.removeClass "temp-hide"
                    .css
                        "transition": endTransition,
                        "-webkit-transition": "-webkit-#{endTransition}",
                        "transform": "translate(0, 0)"
            , 5


    # add => newMessageBubble
    # -----------------------------------------------------------------------------------------

    add: (msg, options) -> return @newMessageBubble msg, options


    # makeDateSection
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Creates a new date section containing elements/ headings specified in the options object.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # options:      An object literal containing options for the specifics of the date section
    #               construction. See below for defaults and explanations.

    makeDateSection: (options = {}) ->
        defaults =
            startMessage: null          # Message to start at, either as 0-indexed within all messages,
                                        # or as a string selector, or as a jQuery option
            endMessage: null            # Message to end at (same options as for startMessage)
            messageCount: null          # Number of messages after startMessage to include
            sectionHeadingDate: null    # The date to use for the section heading
            sectionHeadingTime: null    # The time to use for the section heading

        options = $.extend defaults, options

        $messages = @messages

        # Get the startMessage as a 0-based index of all messages
        options.startMessage = @_convertPossibleSelectorToIndexNumber options.startMessage, $messages

        ## If endMessage is given, convert to 0-based index of all messages (and add 1 since
        # slicing is exclusive of last index)
        if options.endMessage?
            options.endMessage = 1 + @_convertPossibleSelectorToIndexNumber options.endMessage, $messages

        # If messageCount given, add that to the startMessage
        else if options.messageCount
            options.endMessage = options.startMessage + options.messageCount + 1

        # Make sure that endMessage is between 0 and the length of all messages
        options.endMessage = $messages.length if (not options.endMessage?) or 0 > options.endMessage > $messages.length

        # Get the set of messages to be grouped
        $messageSet = $messages.slice options.startMessage - 1, options.endMessage

        # Desctroy any existing containers of those elements (i.e., make them siblings)
        @_destroyOverlappingSections $messageSet

        # Wrap all elements in a date section container
        $messageSet.wrapAll @_messageDateSectionHTML

        $container = $messageSet.parent()
        # Heading text includes the date string passed in the options (if it exists) or weekday of the first message,
        # Plus the time of the first message of the set (or the one passed in the options, if it exists)
        headingText =
            "<h3 class='message-bubble-heading'>
            <span class='message-bubble-date'>
            #{options.sectionHeadingDate or @_weekdayString $messageSet.first().data @_timestampKey}
            </span>
             #{ if options.sectionHeadingTime
                    options.sectionHeadingTime
                else if not options.sectionHeadingDate?
                    @_formatDateString $messageSet.first().data @_timestampKey }
            </h3>"
        # Add the heading to the date section
        $(headingText).prependTo $container

        # Return the container for chaining
        return $container


    # _makeQuickDateSection
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Creates a new date section containing the passed elements with an automatically-generated
    # section heading.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # $messagees:   Set of messages to group together.


    _makeQuickDateSection: ($messages) ->
        $dateSection = $(@_messageDateSectionHTML)
        # Get date of first message in set
        date = $messages.first().data @_timestampKey

        # Destroy any sections preventing the messages from being siblings
        @_destroyOverlappingSections $messages
        # Append the new elements to the new section
        $messages.appendTo $dateSection
        # Create and append the section heading
        $("<h3 class='message-bubble-heading'>
            <span class='message-bubble-date'>
            #{@_weekdayString date}
            </span>
             #{@_formatDateString date}
            </h3>").prependTo $dateSection

        return $dateSection


    # _destroyOverlappingSections
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Destroys containing date sections to allow for new ones to be created.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # $messages:    Set of messages to review for destroyable date sections.

    _destroyOverlappingSections: ($messages) ->
        $messages.each ->
            $this = $(this)
            $parent = $this.parent()

            if $parent.hasClass "message-bubble-date-section"
                # If parent is a date section, remove any headings and...
                $parent.children(".message-bubble-heading").remove()
                # Unwrap the other contained elements
                $this.unwrap()


    # _convertPossibleSelectorToIndexNumber
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Normalizes an unknown parameter to a zero-based index of the $containingSet.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # shouldBeNum:      Unknown index-related parameter.
    # $containingSet:   Set within which to compute the index.

    _convertPossibleSelectorToIndexNumber: (shouldBeNum, $containingSet) ->
        # If shouldBeNum is null, return null
        return null unless shouldBeNum?

        # If it's a number, just return it.
        if typeof shouldBeNum isnt "number"
            shouldBeNum = $(shouldBeNum)
            # Get index of parameter within containing set
            shouldBeNum = $containingSet.index shouldBeNum
            # If not found, return null
            return null if shouldBeNum < 0

        return shouldBeNum



    #        ___          ___          ___          ___                      ___
    #       /  /\        /  /\        /__/\        /  /\         ___        /  /\
    #      /  /::\      /  /:/_      |  |::\      /  /::\       /__/\      /  /:/_
    #     /  /:/\:\    /  /:/ /\     |  |:|:\    /  /:/\:\      \  \:\    /  /:/ /\
    #    /  /:/~/:/   /  /:/ /:/_  __|__|:|\:\  /  /:/  \:\      \  \:\  /  /:/ /:/_
    #   /__/:/ /:/___/__/:/ /:/ /\/__/::::| \:\/__/:/ \__\:\ ___  \__\:\/__/:/ /:/ /\
    #   \  \:\/:::::/\  \:\/:/ /:/\  \:\~~\__\/\  \:\ /  /://__/\ |  |:|\  \:\/:/ /:/
    #    \  \::/~~~~  \  \::/ /:/  \  \:\       \  \:\  /:/ \  \:\|  |:| \  \::/ /:/
    #     \  \:\       \  \:\/:/    \  \:\       \  \:\/:/   \  \:\__|:|  \  \:\/:/
    #      \  \:\       \  \::/      \  \:\       \  \::/     \__\::::/    \  \::/
    #       \__\/        \__\/        \__\/        \__\/          ~~~~      \__\/


    # removeMessageBubble
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Removes messages matching that selector (or message text).

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # sel:              Selector (or message text) of messages to be removed.

    removeMessageBubbles: (sel) ->
        # Keep track of number of removals so we can search through message text if
        # no elements match selector
        $removalsMade = $()

        # Store MessageBubbleController to access its messages
        that = this

        # Remove element and incremenet removals
        @getSubsetOfMessages(sel).each ->
            $this = $(this)
            that._checkForSectionRemovalAndRemove $this
            $removalsMade = $removalsMade.add $this

        # If no matched elements based on selector...
        unless $removalsMade > 0
            @messages.each ->
                $this = $(this)
                # Go through each message and remove it if message text matches sel
                if $this.text().match sel
                    that._checkForSectionRemovalAndRemove $this
                    $removalsMade = $removalsMade.add $this

        # Update internal store
        @_update()

        # Return container of elements removed from DOM
        $removalsMade


    # remove => removeMessageBubbles
    # delete => removeMessageBubbles
    # -----------------------------------------------------------------------------------------

    remove: (sel) -> @removeMessageBubbles sel
    delete: (sel) -> @removeMessageBubbles sel


    # _checkForSectionRemovalAndRemove
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Checks whether the message is the last in its date section and, if so, deletes the
    # entire section (otherwise, deletes just the message).

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # $elem:            (jQuery) element to check.

    _checkForSectionRemovalAndRemove: ($elem) ->
        # If the element is in a date section and has no sibling messages, remove the section
        if $elem.closest(".message-bubble-date-section").length > 0 and
            $elem.siblings(".message-bubble").length < 1
                $elem.parent().remove()
        else
            $elem.remove()



    #                           ___          ___          ___
    #        ___   ___         /__/\        /  /\        /  /\
    #       /  /\ /  /\       |  |::\      /  /:/_      /  /:/_
    #      /  /://  /:/       |  |:|:\    /  /:/ /\    /  /:/ /\
    #     /  /://__/::\     __|__|:|\:\  /  /:/ /:/_  /  /:/ /::\
    #    /  /::\\__\/\:\__ /__/::::| \:\/__/:/ /:/ /\/__/:/ /:/\:\
    #   /__/:/\:\  \  \:\/\\  \:\~~\__\/\  \:\/:/ /:/\  \:\/:/~/:/
    #   \__\/  \:\  \__\::/ \  \:\       \  \::/ /:/  \  \::/ /:/
    #        \  \:\ /__/:/   \  \:\       \  \:\/:/    \__\/ /:/
    #         \__\/ \__\/     \  \:\       \  \::/       /__/:/
    #                          \__\/        \__\/        \__\/


    # timestamp
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Adds a span with the time to the specified messages.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # sel:              Selector of messages to timestamp.

    timestamp: (sel) ->
        # Convert passed selector to a jQuery selection
        $matching = if sel instanceof jQuery then sel else @getSubsetOfMessages sel

        # Store MessageBubbleController
        that = this

        $matching.each ->
            $this = $(this)
            # Get the timestamp data attribute
            timestamp = $this.data that._timestampKey
            date = new Date timestamp

            # If the timestamp is valid...
            if timestamp and (not (new Date(timestamp) + "").match /Invalid/gi)
                # Append the timestamp span (contains the time the message was timed at)
                $this.append("<span class='message-bubble-timestamp'>#{that._formatDateString timestamp}</span>")



    _formatDateString: (date) ->
        @_timestamper.formatDateString date

    _weekdayString: (date) ->
        @_timestamper.weekdayString date



    #        ___          ___                       ___       ___          ___
    #       /__/\        /  /\                     /  /\     /  /\        /  /\
    #       \  \:\      /  /:/_                   /  /::\   /  /:/_      /  /::\
    #        \__\:\    /  /:/ /\   ___     ___   /  /:/\:\ /  /:/ /\    /  /:/\:\
    #    ___ /  /::\  /  /:/ /:/_ /__/\   /  /\ /  /:/~/://  /:/ /:/_  /  /:/~/:/
    #   /__/\  /:/\:\/__/:/ /:/ /\\  \:\ /  /://__/:/ /://__/:/ /:/ /\/__/:/ /:/___
    #   \  \:\/:/__\/\  \:\/:/ /:/ \  \:\  /:/ \  \:\/:/ \  \:\/:/ /:/\  \:\/:::::/
    #    \  \::/      \  \::/ /:/   \  \:\/:/   \  \::/   \  \::/ /:/  \  \::/~~~~
    #     \  \:\       \  \:\/:/     \  \::/     \  \:\    \  \:\/:/    \  \:\
    #      \  \:\       \  \::/       \__\/       \  \:\    \  \::/      \  \:\
    #       \__\/        \__\/                     \__\/     \__\/        \__\/


    # getSubsetOfMessages
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Get a subset of all elements that match the passed CSS selector

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # sel:          The selector to search for. Optional. If omitted, all messages are returned.

    getSubsetOfMessages: (sel) ->
        # if sel is undefined, return all messages
        return @messages unless sel?
        return @messages.filter ->
            return $(this).is sel


    # _update
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Update the internally stored messages collection (for quick access)

    _update: ->
        @messages = $(".message-bubble")




    # TODO
    typing: (state = true) ->
        $typingIndicators = @container.children(".typing-indicator")

        if state

            # add new typing indicator if it doesn't already exist
            if $typingIndicators.length < 1
                $("<div class='typing-indicator'><div class='typing-indicator-dot' /></div>").appendTo @container
            # Otherwise, return the old indicator
            else
                $typingIndicators

        else
            $typingIndicators.remove()





#        ___          ___                       ___       ___          ___
#       /__/\        /  /\                     /  /\     /  /\        /  /\
#       \  \:\      /  /:/_                   /  /::\   /  /:/_      /  /::\
#        \__\:\    /  /:/ /\   ___     ___   /  /:/\:\ /  /:/ /\    /  /:/\:\
#    ___ /  /::\  /  /:/ /:/_ /__/\   /  /\ /  /:/~/://  /:/ /:/_  /  /:/~/:/
#   /__/\  /:/\:\/__/:/ /:/ /\\  \:\ /  /://__/:/ /://__/:/ /:/ /\/__/:/ /:/___
#   \  \:\/:/__\/\  \:\/:/ /:/ \  \:\  /:/ \  \:\/:/ \  \:\/:/ /:/\  \:\/:::::/
#    \  \::/      \  \::/ /:/   \  \:\/:/   \  \::/   \  \::/ /:/  \  \::/~~~~
#     \  \:\       \  \:\/:/     \  \::/     \  \:\    \  \:\/:/    \  \:\
#      \  \:\       \  \::/       \__\/       \  \:\    \  \::/      \  \:\
#       \__\/        \__\/                     \__\/     \__\/        \__\/

class Timestamper
    constructor: ->


    # formatDateString
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Creates a string representing the time of the message.

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # date:             Date (either as Date or parseable by Date.parse) to stringify.

    formatDateString: (date) ->
        date = new Date date
        # Store hours and minutes of the date
        [hours, mins] = [date.getHours(), date.getMinutes()]
        # Adjust hours > 12
        adjHours = if hours % 12 isnt 0 then hours % 12 else 12
        # Return time in format "HH:MM AM/PM"
        return "#{adjHours}:#{if mins < 10 then 0 else ""}#{mins} #{if hours < 12 then "AM" else "PM"}"


    # weekdayString
    # -----------------------------------------------------------------------------------------

    # SUMMARY
    # -----------------------------------------------------------------------------------------
    # Get the string representing the day of the week

    # PARAMETERS
    # -----------------------------------------------------------------------------------------
    # date:             Date (either as Date or parseable by Date.parse) to stringify.

    # TODO: SMARTER FORMAT STRINGS BASED ON WHETHER DATE IS IN PAST WEEK OR NOT
    weekdayString: (date) ->
        date = new Date date
        today = new Date

        # Return "Today" if it's today
        if date.getYear() is today.getYear() and
            date.getMonth() is today.getMonth() and
            date.getDay() is today.getDay()
                return "Today"

        # Dates start at 0 for Sunday and onwards from there
        return switch date.getDay()
            when 0 then "Sunday"
            when 1 then "Monday"
            when 2 then "Tuesday"
            when 3 then "Wednesday"
            when 4 then "Thursday"
            when 5 then "Friday"
            else "Saturday"





#        ___                       ___                       ___
#       /  /\                     /  /\        _____        /  /\
#      /  /:/_                   /  /::\      /  /::\      /  /::\
#     /  /:/ /\   ___     ___   /  /:/\:\    /  /:/\:\    /  /:/\:\   ___     ___
#    /  /:/_/::\ /__/\   /  /\ /  /:/  \:\  /  /:/~/::\  /  /:/~/::\ /__/\   /  /\
#   /__/:/__\/\:\\  \:\ /  /://__/:/ \__\:\/__/:/ /:/\:|/__/:/ /:/\:\\  \:\ /  /:/
#   \  \:\ /~~/:/ \  \:\  /:/ \  \:\ /  /:/\  \:\/:/~/:/\  \:\/:/__\/ \  \:\  /:/
#    \  \:\  /:/   \  \:\/:/   \  \:\  /:/  \  \::/ /:/  \  \::/       \  \:\/:/
#     \  \:\/:/     \  \::/     \  \:\/:/    \  \:\/:/    \  \:\        \  \::/
#      \  \::/       \__\/       \  \::/      \  \::/      \  \:\        \__\/
#       \__\/                     \__\/        \__\/        \__\/

window.MessageBubbleController = MessageBubbleController