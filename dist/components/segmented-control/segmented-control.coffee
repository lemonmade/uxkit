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
        if option.default and @segmentedControl.find(":checked").length < 1
            $option.children("input").prop "checked", true

        @_setSegmentMaxWidth(1, $option)

        if position is 1
            $option.prependTo @segmentedControl
        else if position > (numberOfOptions + 1)
            $option.appendTo @segmentedControl
        else
            $option.insertAfter @segmentedControl.children(".segmented-option:nth-of-type(#{position - 1})")



SegmentedControl.template = "<div class='segmented-control' data-control-name='NAME'></div>"


class SegmentedControlOption
    constructor: (@id, @label, @default = false) ->

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

        $segmentedControl = $(SegmentedControl.template.replace "NAME", options.name)

        segmentOptions.forEach (option) =>
            segmentHTML = (@createSegmentedOption option).replace "NAME", options.name
            $segmentOption = $(segmentHTML).appendTo $segmentedControl
            if option.default then $segmentOption.children("input").prop "checked", true

        segmentedControl = new SegmentedControl $segmentedControl
        segmentedControl._setSegmentMaxWidth()
        @segmentedControls.push segmentedControl

        $segmentedControl.appendTo options.container



    createSegmentedOption: (option) ->
        SegmentedControlOption.template.replace /(ID|LABEL)/g, (match) ->
            switch match
                when "ID" then option.id
                when "LABEL" then option.label



window.SegmentedControlController = SegmentedControlController
window.SegmentedControlOption = SegmentedControlOption
window.SegmentedControl = SegmentedControl