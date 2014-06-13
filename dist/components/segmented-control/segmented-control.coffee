# TODO: check uniqueness of IDs


class SegmentedControl
    constructor: ($segmentedControl) ->
        @segmentedControl = $segmentedControl


    _setSegmentMaxWidth: (changeCountBy = 0, $newElem) ->
        $segments = @segmentedControl.children(".segmented-option")
        segmentMaxWidth = "#{(100/($segments.length + changeCountBy)).toPrecision 5}%"
        $segments.each ->
            $(this).css "max-width", segmentMaxWidth

        if $newElem? then $newElem.css "max-width", segmentMaxWidth


    addOption: (option, position) ->
        controlName = @segmentedControl.attr "data-control-name"
        numberOfOptions = @segmentedControl.children(".segmented-option").length
        position ?= numberOfOptions + 1

        optionHTML = SegmentedControlOption.template.replace /(ID|NAME|LABEL)/g, (match) ->
            switch match
                when "ID" then option.id
                when "NAME" then controlName
                when "LABEL" then option.label
        $option = $(optionHTML)
        if option.selected and @segmentedControl.find(":checked").length < 1
            $option.children("input").prop "checked", true

        @_setSegmentMaxWidth(1, $option)

        if position is 1
            $option.prependTo @segmentedControl
        else if position > (numberOfOptions + 1)
            $option.appendTo @segmentedControl
        else
            $option.insertAfter @segmentedControl.children(".segmented-option:nth-of-type(#{position - 1})")


    removeOptions: (options...) ->
        findSelector = ""

        options.forEach (option) ->
            unless typeof option is "number"
                if toString.call(option) is "[object String]"
                    # String, set that as ID to look for
                    findSelector += "##{option} "
                else
                    # Object or SegmentedControlOption
                    findSelector += "##{option.id} "
            else
                # Number selector
                findSelector += ":nth-of-type(#{option}) "

        # Create comma-separated selector
        findSelector = findSelector.split(" ").join(", ").replace /(,\s)$/, ""
        console.log findSelector
        @segmentedControl.children(findSelector).remove()
        @_setSegmentMaxWidth()
        return


SegmentedControl.template = "<div class='segmented-control' data-control-name='NAME'></div>"





class SegmentedControlOption
    constructor: (id, label, selected = false) ->
        if typeof id is "object"
            @id = id.id
            @label = id.label
            @selected = if id.selected? then id.selected else false
        else
            @id = id
            @label = label
            @selected = selected

SegmentedControlOption.template =   "<div class='segmented-option'>
                                        <input type='radio' name='NAME' id='ID'>
                                        <label for='ID'>LABEL</label>
                                    </div>"



class SegmentedControlController
    constructor: () ->
        @segmentedControls = []



    newSegmentedControl: (segmentOptions..., options) ->
        console.log segmentOptions, options
        # Last element was actually another control option
        if options instanceof SegmentedControlOption or options.id?
            segmentOptions.push options
            options = {}


        defaults =
            container: "body"
            name: "segmented-control"

        options = $.extend defaults, options

        selectedSegmentChosen = false

        $segmentedControl = $(SegmentedControl.template.replace "NAME", options.name)

        segmentOptions.forEach (option) =>
            segmentHTML = (@_createSegmentedOption option).replace "NAME", options.name
            $segmentOption = $(segmentHTML).appendTo $segmentedControl
            if option.selected and not selectedSegmentChosen
                $segmentOption.children("input").prop "checked", true
                selectedSegmentChosen = true

        segmentedControl = new SegmentedControl $segmentedControl
        segmentedControl._setSegmentMaxWidth()
        @segmentedControls.push segmentedControl

        $segmentedControl.appendTo options.container



    setMainColor: (color) ->
        untoggledRule = ".segmented-option label { color: #{color}; }\n
                             .segmented-option { border-color: #{color}; }"
        toggledRule = ".segmented-option input:checked + label { background-color: #{color}; }"

        @_appendCustomStyle toggledRule, untoggledRule, "updatedMainColor"

    setSecondaryColor: (color) ->
        untoggledRule = ".segmented-option label { background-color: #{color}; }"
        toggledRule = ".segmented-option input:checked + label { color: #{color}; }"

        @_appendCustomStyle toggledRule, untoggledRule, "updatedSecondaryColor"


    _appendCustomStyle: (toggledRule, untoggledRule, type) ->
        rules = "&shy;<style>#{untoggledRule}\n#{toggledRule}</style>"
        targetStyle = this[type]

        if targetStyle?
            targetStyle.html rules
        else
            this[type] = $("<div>#{rules}</div>").appendTo "body"


    _createSegmentedOption: (option) ->
        SegmentedControlOption.template.replace /(ID|LABEL)/g, (match) ->
            switch match
                when "ID" then option.id
                when "LABEL" then option.label



window.SegmentedControlController = SegmentedControlController
window.SegmentedControlOption = SegmentedControlOption
window.SegmentedControl = SegmentedControl