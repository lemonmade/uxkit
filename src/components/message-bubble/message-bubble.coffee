daysInMS = 86400000

class MessageController
    constructor: (settings = {}) ->
        $messageBubbleContainer = $(".message-bubble-container")
        $messageBubbleContainer = $("body") if $messageBubbleContainer.length < 1
        @container = if settings.container? then settings.container else $messageBubbleContainer

        @messages = $(".message-bubble")

        @messageBubbleHTML = "<div class='message-bubble'>
                              <div class='message-bubble-inner'>
                              MESSAGE
                              <svg class='message-bubble-whale-tail' width='116px' height='119px' viewBox='0 0 116 119' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' enable-background='new 0 0 116.42 97.35' xml:space='preserve'>
                              <path fill='#A0A0A0' d='M67.39,79.03 C84.24,104.95 116.42,115.32 116.42,115.32 C116.42,115.32 73.88,124.39 46.66,115.32 C19.44,106.24 0,79.03 0,79.03 L0,-0.227279902 L51.8400002,-0.227279902 L51.84,22 C51.84,22 50.54,53.1 67.39,79.03 Z'></path>
                              </svg>
                              </div>
                              </div>"
        @messageDateSectionHTML = "<section class='message-bubble-date-section' />"
        @timestampKey = "message-timestamp"

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

    setBackgroundColor: (color, sel) ->
        @getSubsetOfMessages sel
            .each ->
                $this = $(this)
                $this.css "background-color", color
                $this.find ".message-bubble-whale-tail path"
                     .css "fill", color

    setTextColor: (color, sel) ->
        @getSubsetOfMessages sel
            .each ->
                $(this).css "color", color



#        ___                   ___          ___          ___
#       /  /\         ___     /__/\        /  /\        /  /\
#      /  /::\       /  /\    \  \:\      /  /:/_      /  /::\
#     /  /:/\:\     /  /:/     \__\:\    /  /:/ /\    /  /:/\:\
#    /  /:/  \:\   /  /:/  ___ /  /::\  /  /:/ /:/_  /  /:/~/:/
#   /__/:/ \__\:\ /  /::\ /__/\  /:/\:\/__/:/ /:/ /\/__/:/ /:/___
#   \  \:\ /  /://__/:/\:\\  \:\/:/__\/\  \:\/:/ /:/\  \:\/:::::/
#    \  \:\  /:/ \__\/  \:\\  \::/      \  \::/ /:/  \  \::/~~~~
#     \  \:\/:/       \  \:\\  \:\       \  \:\/:/    \  \:\
#      \  \::/         \__\/ \  \:\       \  \::/      \  \:\
#       \__\/                 \__\/        \__\/        \__\/

    getSubsetOfMessages: (sel) ->
        return @messages unless sel?
        return @messages.filter ->
            return $(this).is sel

    update: ->
        @messages = $(".message-bubble")



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

    newMessage: (msg, options = {}) ->
        defaults =
            after: null
            append: true
            container: null
            artificialDate: null
            timestamp: true
            tail: true
            inReplyTo: null
            reply: false

        options = $.extend defaults, options

        if options.append instanceof jQuery or
            Object::toString.call(options.append) is "[object String]"
                options.container = $(options.append)
                options.append = true

        $message = $(@messageBubbleHTML.replace "MESSAGE", msg)

        if options.timestamp
            time = if options.artificialDate? then new Date(options.artificialDate) else new Date
            $message.attr "data-#{@timestampKey}", time.getTime()
            @timestamp $message

        $message.addClass "no-tail" unless options.tail
        $message.addClass "reply" if options.reply
        if options.inReplyTo? and ($replyMsg = $(options.inReplyTo)).length > 0
            $message[if $replyMsg.hasClass("reply") then "removeClass" else "addClass"] "reply"

        if options.after
            $message.insertAfter $afterElement if ($afterElement = $(options.after)).length > 0

        else if options.before
            $message.insertBefore $beforeElement if ($beforeElement = $(options.before)).length > 0

        else if @automateDateSections and options.timestamp? and @messages.length > 0
            $lastMsg = @messages.last()
            curTSinDays = Math.floor new Date($message.data(@timestampKey)).getTime()/daysInMS
            lastTSinDays = Math.floor new Date($lastMsg.data(@timestampKey)).getTime()/daysInMS

            if curTSinDays - lastTSinDays >= 1
                $insertionPoint = if ($lastDateSection = $lastMsg.closest ".message-bubble-date-section").length > 0 then $lastDateSection else $lastMsg;
                @makeQuickDateSection($message).insertAfter $insertionPoint
            else
                $message.insertAfter $lastMsg

        else
            $container = if options.container? then $(options.container) else @container
            $relevantContainerChild = $container.children(if options.append then ":last-child" else ":first-child")

            $container = $relevantContainerChild if $relevantContainerChild.hasClass "message-bubble-date-section"

            $message[if options.append then "appendTo" else "prependTo"] $container

        @update()
        return $message

    add: (msg, options) -> return @newMessage msg, options

    makeDateSection: (options = {}) ->
        defaults =
            startMessage: null
            endMessage: null
            messageCount: null
            sectionHeadingDate: null
            sectionHeadingTime: null

        options = $.extend defaults, options

        $messages = @messages

        options.startMessage = @convertPossibleSelectorToIndexNumber options.startMessage, $messages

        if options.endMessage?
            options.endMessage = 1 + @convertPossibleSelectorToIndexNumber options.endMessage, $messages
        else if options.messageCount
            options.endMessage = options.startMessage + options.messageCount

        options.endMessage = $messages.length if (not options.endMessage?) or 0 > options.endMessage > $messages.length

        $messageSet = $messages.slice options.startMessage - 1, options.endMessage
        @destroyOverlappingSections $messageSet
        $messageSet.wrapAll @messageDateSectionHTML

        $container = $messageSet.parent()
        headingText =
            "<h3 class='message-bubble-heading'>
            <span class='message-bubble-date'>
            #{options.sectionHeadingDate or @weekdayString $messageSet.first().data @timestampKey}
            </span>
             #{ if options.sectionHeadingTime
                    options.sectionHeadingTime
                else if not options.sectionHeadingDate?
                    @formatDateString $messageSet.first().data @timestampKey }
            </h3>"
        $(headingText).prependTo $container

        return $container

    makeQuickDateSection: ($messages) ->
        $dateSection = $(@messageDateSectionHTML)
        date = $messages.first().data @timestampKey

        @destroyOverlappingSections $messages
        $messages.appendTo $dateSection
        $("<h3 class='message-bubble-heading'>
            <span class='message-bubble-date'>
            #{@weekdayString date}
            </span>
             #{@formatDateString date}
            </h3>").prependTo $dateSection

        return $dateSection

    destroyOverlappingSections: ($messages) ->
        $messages.each ->
            $this = $(this)
            $parent = $this.parent()

            if $parent.hasClass "message-bubble-date-section"
                $parent.children(".message-bubble-heading").remove()
                $this.unwrap()

    convertPossibleSelectorToIndexNumber: (shouldBeNum, $containingSet) ->
        return null unless shouldBeNum?

        if typeof shouldBeNum isnt "number"
            shouldBeNum = $(shouldBeNum)
            shouldBeNum = $containingSet.index shouldBeNum
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

    removeMessage: (sel) ->
        removalsMade = 0
        that = this

        @getSubsetOfMessages(sel).each ->
            that.checkForSectionRemovalAndRemove $(this)
            removalsMade++

        unless removalsMade > 0
            @messages.each ->
                $this = $(this)
                if $this.text().match sel
                    that.checkForSectionRemovalAndRemove $this
                    removalsMade++

        @update()
        return removalsMade

    remove: (sel) -> return @removeMessage sel
    delete: (sel) -> return @removeMessage sel

    checkForSectionRemovalAndRemove: ($elem) ->
        if $elem.parent().hasClass("message-bubble-date-section") and
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

    timestamp: (sel) ->
        $matching = if sel instanceof jQuery then sel else @getSubsetOfMessages sel
        that = this

        $matching.each ->
            $this = $(this)
            timestamp = $this.data that.timestampKey
            date = new Date timestamp

            if timestamp and (not (new Date(timestamp) + "").match /Invalid/gi)
                $this.append("<span class='message-bubble-timestamp'>#{that.formatDateString timestamp}</span>")

    # TODO: SMARTER FORMAT STRINGS BASED ON WHETHER DATE IS IN PAST WEEK OR NOT
    formatDateString: (date) ->
        date = new Date date
        [hours, mins] = [date.getHours(), date.getMinutes()]
        adjHours = if hours % 12 isnt 0 then hours % 12 else 12
        return "#{adjHours}:#{if mins < 10 then 0 else ""}#{mins} #{if hours < 12 then "AM" else "PM"}"

    weekdayString: (date) ->
        date = new Date date
        today = new Date
        if date.getYear() is today.getYear() and
            date.getMonth() is today.getMonth() and
            date.getDay() is today.getDay()
                return "Today"

        return switch date.getDay()
            when 0 then "Sunday"
            when 1 then "Monday"
            when 2 then "Tuesday"
            when 3 then "Wednesday"
            when 4 then "Thursday"
            when 5 then "Friday"
            else "Saturday"


window.MessageController = MessageController