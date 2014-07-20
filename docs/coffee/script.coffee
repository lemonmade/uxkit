$ ->
    header = new PageHeader

    $(".component-actions button").on "click", (event) ->
        event.preventDefault()
        $this = $(this)
        text = $this.find(".component-action-label").text().toLowerCase()
        target = "." + (switch text
                    when "source" then "source-code"
                    when "api" then "api"
                    when "requires" then "requirements")
        console.log $(target)
        $this.addClass("active").siblings().removeClass "active"

        $allActions = $this.parent().addClass "active"
        $codeInformation = $(".code-information")

        unless $allActions.hasClass "fixed"
            $(target).addClass("active").siblings().removeClass "active"

            $("html, body").animate
                scrollTop: $allActions.offset().top
            , 400

            setTimeout () ->
                $(target).addClass("active").siblings().removeClass "active"
                $codeInformation.css "padding-top", $allActions.outerHeight()
                $allActions.addClass "fixed"
            , 425

        else
            $("html, body").animate
                scrollTop: $codeInformation.offset().top
            , 400

            setTimeout () ->
                $(target).addClass("active").siblings().removeClass "active"
            , 425

    $(".sidebar-toggle").on "click", (event) ->
        event.preventDefault()
        sidebarSize = $(".sidebar").outerWidth()
        sidebarSize = "#{sidebarSize/16}em"
        $mainContent = $(".main-content")
        console.log $mainContent.css("transform")

        if $mainContent.css("transform") is "none"
            translation = "translateX(#{sidebarSize})"
            $mainContent.css "transform", translation
            header.translate translation if header.smallHeaderActive
        else
            $mainContent.css "transform", ""
            header.translate "" if header.smallHeaderActive

    $(document).on "click", ".api-method .section-hide", () ->
        $this = $(this)
        $apiMethod = $this.closest ".api-method"
        $apiClass = $apiMethod.closest ".api-class"
        $apiClassButton = $apiClass.find("h3 .section-hide")

        showing = $apiMethod.hasClass "hidden"

        if (not $apiMethod.hasClass("hidden")) and $apiMethod.siblings(".api-method:not(.hidden)").length is 0
            $apiClass.addClass "hidden"
            $apiClassButton.text "Show"
        else
            $apiClass.removeClass "hidden"
            $apiClassButton.text "Hide"
        $apiMethod.toggleClass "hidden"

        $this.text(if showing then "Hide" else "Show")

    $(document).on "click", ".api-class h3 .section-hide", () ->
        $apiClass = $(this).closest ".api-class"
        if $apiClass.hasClass "hidden"
            $apiClass.find(".api-method.hidden .section-hide").trigger "click"
        else
            $apiClass.find(".api-method:not(.hidden) .section-hide").trigger "click"

    $(document).on "click", ".example-css-toggle", () ->
        $this = $(this)
        $this.text(
            if $this.text().match(/without/)
                "(try it with CSS)"
            else
                "(try it without CSS)"
        )

        $(".example-component").toggleClass "no-css"

    $(document).on "scroll", header.checkForSmallActivation.bind(header)


    playgroundCommands = []
    playgroundCommand = 0

    $(".playground-input").on "keydown", (event) ->
        code = if event.keyCode then event.keyCode else event.which
        $output = $(".playground-output code")
        $this = $(this)

        switch code
            when 13
                # Enter key
                event.preventDefault()
                command = $this.val()
                try
                    result = eval command
                catch e
                    result = "error: #{e.message}"
                $output.append "<div>=> #{result}</div>"
                $this.val ""
                playgroundCommands.push command
                playgroundCommand = 0

            when 38
                # Up arrow
                commands = playgroundCommands.length
                if playgroundCommands[commands - playgroundCommand - 1]?
                    playgroundCommand += 1
                    command = playgroundCommands[commands - playgroundCommand]
                    $this.val command
                    setTimeout () ->
                        $this[0].setSelectionRange command.length, command.length
                    , 0

            when 40
                # Down arrow
                commands = playgroundCommands.length
                if playgroundCommands[commands - playgroundCommand + 1]?
                    playgroundCommand -= 1
                    command = playgroundCommands[commands - playgroundCommand]
                    $this.val command
                    setTimeout () ->
                        $this[0].setSelectionRange command.length, command.length
                    , 0
                else if playgroundCommand is 1
                    playgroundCommand = 0
                    $this.val ""

    $(".example-commands button").on "click", () ->
        $input = $(".playground-input")
        $input.val $(this).data "command"
        $input.focus()





class PageHeader
    constructor: () ->
        $header = $(".page-header")
        $smallHeader = $header.clone().addClass("small").appendTo "body"

        @header = $header
        @smallHeader = $smallHeader
        @headerHeight = $header.outerHeight()
        @smallHeaderActive = false

    translate: (translation) -> @smallHeader.css "transform", translation

    activateSmall: () ->
        unless @smallHeaderActive
            @smallHeader.addClass "active"
            @smallHeaderActive = true

    deactivateSmall: () ->
        if @smallHeaderActive
            @smallHeader.removeClass "active"
            @smallHeaderActive = false

    checkForSmallActivation: () ->
        pos = window.scrollY
        if pos > @headerHeight and not @smallHeaderActive
            @activateSmall()
        else if pos < @headerHeight and @smallHeaderActive
            @deactivateSmall()
