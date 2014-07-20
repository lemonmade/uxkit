#                               ___          ___
#        ___       ___         /  /\        /__/\
#       /__/\     /  /\       /  /:/_      _\_ \:\
#       \  \:\   /  /:/      /  /:/ /\    /__/\ \:\
#        \  \:\ /__/::\     /  /:/ /:/_  _\_ \:\ \:\
#    ___  \__\:\\__\/\:\__ /__/:/ /:/ /\/__/\ \:\ \:\
#   /__/\ |  |:|   \  \:\/\\  \:\/:/ /:/\  \:\ \:\/:/
#   \  \:\|  |:|    \__\::/ \  \::/ /:/  \  \:\ \::/
#    \  \:\__|:|    /__/:/   \  \:\/:/    \  \:\/:/
#     \__\::::/     \__\/     \  \::/      \  \::/
#         ~~~~                 \__\/        \__\/

class ToggleSwitch
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

	# Must be initialized with a toggle element
	constructor: (details) ->
		# Accept a pre-made jQuery object
		if details instanceof jQuery or toString.call(details) is "[object String]"
			details = $(details)
			$input = details.children "input"
			$label = details.children "label"

			details.attr
				"role": "checkbox"
				"aria-checked": $input.prop("checked")

			this[0] = details
			@_input = $input
			@_label = $label

			# Bind the keypress event to manipulate the toggle
			# and the change event to update the aria-role
			toggle = this
			$input.on "change", ->
				toggle.attr "aria-checked", toggle.checked()

			details.on "keypress", (event) ->
				if event.charCode is 32
					event.preventDefault()
					toggle.toggle()

		# Create a brand new instance
		else
			defaults =
				# Whether the new toggle should be toggled on or not
				# These five are all aliases for one another
				active: false
				on: false
				checked: false
				toggled: false
				toggle: false

				container: undefined
				disabled: false         # Whether the toggle should be disabled
				id: undefined           # Custom ID to use for the input/ label
				label: ""               # Label to use for the toggle (hidden in default CSS)
				name: "toggle"          # Name attribute to use for the input

			options = $.extend defaults, details

			# Create the toggle ID
			toggleID = if options.id? then options.id else "toggle-switch-#{ToggleSwitchController._uniqueID()}"

			# Replace HTML template items with relevant strings
			toggleHTML = ToggleSwitch.template.replace /(TOGGLE_ID|LABEL|NAME)/g, (match) ->
				switch match
					when "TOGGLE_ID" then toggleID
					when "LABEL" then options.label
					when "NAME" then options.name

			newToggle = new ToggleSwitch $(toggleHTML)

			# Respect the disable, toggled, and toggleColor options
			newToggle.disable() if options.disabled
			newToggle.toggle() if (options.active or options.on or options.checked or options.toggled or options.toggle)

			# Find the appropriate container
			$container = undefined
			if options.container?
				$container = if options.container instanceof jQuery then options.container else $(options.container)
				# If specified container doesn't exist, go to body
				$container = "body" if $container.length < 1
			else
				$container = "body"

			newToggle[0].appendTo $container

			return newToggle


	# Remove the HTML element
	remove: -> this[0].remove()





	#        ___                   ___                   ___
	#       /  /\         ___     /  /\         ___     /  /\
	#      /  /:/_       /  /\   /  /::\       /  /\   /  /:/_
	#     /  /:/ /\     /  /:/  /  /:/\:\     /  /:/  /  /:/ /\
	#    /  /:/ /::\   /  /:/  /  /:/~/::\   /  /:/  /  /:/ /:/_
	#   /__/:/ /:/\:\ /  /::\ /__/:/ /:/\:\ /  /::\ /__/:/ /:/ /\
	#   \  \:\/:/~/://__/:/\:\\  \:\/:/__\//__/:/\:\\  \:\/:/ /:/
	#    \  \::/ /:/ \__\/  \:\\  \::/     \__\/  \:\\  \::/ /:/
	#     \__\/ /:/       \  \:\\  \:\          \  \:\\  \:\/:/
	#       /__/:/         \__\/ \  \:\          \__\/ \  \::/
	#       \__\/                 \__\/                 \__\/

	# Reverse the current state
	toggle: -> @setState !@state()
	check: -> @toggle()

	# Get the current state
	state: -> @prop "checked"
	checked: -> @state()

	# Set the state to a given value
	setState: (state) ->
		currentState = @state()
		return currentState if @disabled() or !state?

		# Change state if it is different
		unless currentState is state
			@prop "checked", state
			@trigger "change"

		state

	setChecked: (state) -> @setState state



	#       _____                    ___          ___                                    ___
	#      /  /::\      ___         /  /\        /  /\        _____                     /  /\
	#     /  /:/\:\    /  /\       /  /:/_      /  /::\      /  /::\                   /  /:/_
	#    /  /:/  \:\  /  /:/      /  /:/ /\    /  /:/\:\    /  /:/\:\   ___     ___   /  /:/ /\
	#   /__/:/ \__\:|/__/::\     /  /:/ /::\  /  /:/~/::\  /  /:/~/::\ /__/\   /  /\ /  /:/ /:/_
	#   \  \:\ /  /:/\__\/\:\__ /__/:/ /:/\:\/__/:/ /:/\:\/__/:/ /:/\:|\  \:\ /  /://__/:/ /:/ /\
	#    \  \:\  /:/    \  \:\/\\  \:\/:/~/:/\  \:\/:/__\/\  \:\/:/~/:/ \  \:\  /:/ \  \:\/:/ /:/
	#     \  \:\/:/      \__\::/ \  \::/ /:/  \  \::/      \  \::/ /:/   \  \:\/:/   \  \::/ /:/
	#      \  \::/       /__/:/   \__\/ /:/    \  \:\       \  \:\/:/     \  \::/     \  \:\/:/
	#       \__\/        \__\/      /__/:/      \  \:\       \  \::/       \__\/       \  \::/
	#                               \__\/        \__\/        \__\/                     \__\/

	# Check whether a toggle is disabled/ enabled
	enabled: -> !@disabled()
	disabled: -> @prop "disabled"

	# Set the disabled status
	enable: -> !(@setDisabled false)
	disable: -> @setDisabled true

	setDisabled: (disabled) ->
		# Return current status unless a new status is given
		currentDisabled = @disabled()
		return currentDisabled unless disabled?

		# Change it if it is different from the current status
		unless currentDisabled is disabled
			@prop "disabled", disabled

		disabled



	#      ___                      ___          ___          ___
	#     /  /\        ___         /__/\        /  /\        /  /\         ___
	#    /  /:/       /  /\        \  \:\      /  /:/_      /  /::\       /__/|
	#   /__/::\      /  /::\        \  \:\    /  /:/ /\    /  /:/\:\     |  |:|
	#   \__\/\:\    /  /:/\:\   ___  \  \:\  /  /:/ /:/_  /  /:/~/:/     |  |:|
	#      \  \:\  /  /:/~/::\ /__/\  \__\:\/__/:/ /:/ /\/__/:/ /:/___ __|__|:|
	#       \__\:\/__/:/ /:/\:\\  \:\ /  /:/\  \:\/:/ /:/\  \:\/::::://__/::::\
	#       /  /:/\  \:\/:/__\/ \  \:\  /:/  \  \::/ /:/  \  \::/~~~~    ~\~~\:\
	#      /__/:/  \  \::/       \  \:\/:/    \  \:\/:/    \  \:\          \  \:\
	#      \__\/    \__\/         \  \::/      \  \::/      \  \:\          \__\/
	#                              \__\/        \__\/        \__\/

	# Class manipulations
	addClass: (newClasses) -> this[0].addClass(newClasses); return this
	removeClass: (newClasses) -> this[0].removeClass(newClasses); return this
	toggleClass: (newClasses) -> this[0].toggleClass(newClasses); return this
	hasClass: (className) -> this[0].hasClass className

	# DOM traversals
	find: (sel) -> this[0].find sel
	closest: (sel) -> this[0].closest sel
	children: (sel) -> this[0].children sel
	parent: (sel) -> this[0].parent sel

	# Events
	trigger: (event) ->
		if event.match and event.match /change/
			@_input.trigger event
		else
			this[0].trigger event

	on: (event, selector, data, handler) ->
		if event.match and event.match /change/
			@_input.on event, selector, data, handler
		else
			this[0].on event, selector, data, handler

	off: (event, selector, handler) ->
		if event.match and event.match /change/
			@_input.off event, selector, handler
		else
			this[0].off event, selector, handler

	# Properties and attributes
	css: (prop, rule) ->
		if rule?
			if prop.match /display/ then this[0].css(prop, rule) else @_label.css prop, rule
			this
		else
			if prop.match /display/ then this[0].css(prop) else @_label.css prop

	is: (sel) -> if sel.match(/(\:checked|\:disabled)/) then @_input.is(sel) else this[0].is(sel)

	html: -> this[0].html()
	text: -> @_label.text()

	attr: (attribute, value) ->
		if value?
			if attribute.match /aria/ then this[0].attr(attribute, value) else @_input.attr attribute, value
			this
		else
			if attribute.match /aria/ then this[0].attr(attribute) else @_input.attr attribute

	name: -> @attr "name"
	data: (key, value) ->
		if value? or typeof key is "object"
			this[0].data key, value
			this
		else
			this[0].data key

	prop: (property, val) ->
		if val?
			@_input.prop property, val
			this
		else
			@_input.prop property

ToggleSwitch.template = "<div class='toggle-switch' tabindex='0'>
            							<input type='checkbox' name='NAME' id='TOGGLE_ID' tabindex='-1'>
            							<label for='TOGGLE_ID' class='toggle-switch__container'>
            								<div class='toggle-switch__accent'></div>
            								<div class='toggle-switch__thumb'></div>
            							</label>
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

class ToggleSwitchController
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

	constructor: () ->
		# Create a list of current toggles
		existingToggles = []
		$(".toggle-switch").each ->
			existingToggles.push(new ToggleSwitch $(this))
		@toggleSwitches = existingToggles
		@_toggleSwitchCount = 1



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

	# newToggleSwitch
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# Adds a new toggle switch with the specified parameters.

	# PARAMETERS
	# -----------------------------------------------------------------------------------------
	# options:      Hash of options to use for the newly created toggle (see details in
	# ToggleSwitch constructor)

	newToggleSwitch: (options = {}) ->
		newToggle = new ToggleSwitch options

		# Add the new toggle to the internal array
		@toggleSwitches.push newToggle

		# Return the new toggle
		newToggle


	# add => newToggleSwitch
	# -----------------------------------------------------------------------------------------

	add: (options) -> @newToggleSwitch options



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

	# removeToggleSwitches
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# Removes toggle switches matching the selector

	# PARAMETERS
	# -----------------------------------------------------------------------------------------
	# sel:          The selector that must be matched by the toggle switch to be deleted.

	removeToggleSwitches: (sel) ->
		# Store for use in loop
		tsc = this

		# Create a new array to store the non-deleted toggles
		livingToggles = []

		# Get all matching switches
		@toggleSwitches.forEach (toggle, index) ->
			if not sel? or toggle.is sel
				# Remove the element
				toggle.remove()
			else
				# Add to the non-deleted array
				livingToggles.push toggle

		# Store the new array of toggles
		@toggleSwitches = livingToggles


	# remove => removeToggleSwitches
	# delete => removeToggleSwitches
	# -----------------------------------------------------------------------------------------

	remove: (sel) -> @removeToggleSwitches sel
	delete: (sel) -> @removeToggleSwitches sel



	#        ___                   ___                   ___
	#       /  /\         ___     /  /\         ___     /  /\
	#      /  /:/_       /  /\   /  /::\       /  /\   /  /:/_
	#     /  /:/ /\     /  /:/  /  /:/\:\     /  /:/  /  /:/ /\
	#    /  /:/ /::\   /  /:/  /  /:/~/::\   /  /:/  /  /:/ /:/_
	#   /__/:/ /:/\:\ /  /::\ /__/:/ /:/\:\ /  /::\ /__/:/ /:/ /\
	#   \  \:\/:/~/://__/:/\:\\  \:\/:/__\//__/:/\:\\  \:\/:/ /:/
	#    \  \::/ /:/ \__\/  \:\\  \::/     \__\/  \:\\  \::/ /:/
	#     \__\/ /:/       \  \:\\  \:\          \  \:\\  \:\/:/
	#       /__/:/         \__\/ \  \:\          \__\/ \  \::/
	#       \__\/                 \__\/                 \__\/

	# toggle
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# forwards the toggle message to toggles matching the passed selector.

	# PARAMETERS
	# -----------------------------------------------------------------------------------------
	# sel:          The selector that must be matched by the toggle to be toggled.

	toggle: (sel) ->
		@_getSubsetOfToggleSwitches sel
			.forEach (toggle) -> toggle.toggle()


	# check => toggle
	# -----------------------------------------------------------------------------------------

	check: (sel) -> @toggle sel


	# setState
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# forwards the setState message to toggles matching the passed selector.

	# PARAMETERS
	# -----------------------------------------------------------------------------------------
	# sel:          The selector that must be matched by the toggle to be toggled.

	setState: (state, sel) ->
		@_getSubsetOfToggleSwitches sel
			.forEach (toggle) -> toggle.setState state


	# setChecked => setState
	# -----------------------------------------------------------------------------------------

	setChecked: (state, sel) -> @setState state, sel



	#        ___          ___                       ___          ___
	#       /  /\        /  /\                     /  /\        /  /\
	#      /  /:/       /  /::\                   /  /::\      /  /::\
	#     /  /:/       /  /:/\:\   ___     ___   /  /:/\:\    /  /:/\:\
	#    /  /:/  ___  /  /:/  \:\ /__/\   /  /\ /  /:/  \:\  /  /:/~/:/
	#   /__/:/  /  /\/__/:/ \__\:\\  \:\ /  /://__/:/ \__\:\/__/:/ /:/___
	#   \  \:\ /  /:/\  \:\ /  /:/ \  \:\  /:/ \  \:\ /  /:/\  \:\/:::::/
	#    \  \:\  /:/  \  \:\  /:/   \  \:\/:/   \  \:\  /:/  \  \::/~~~~
	#     \  \:\/:/    \  \:\/:/     \  \::/     \  \:\/:/    \  \:\
	#      \  \::/      \  \::/       \__\/       \  \::/      \  \:\
	#       \__\/        \__\/                     \__\/        \__\/

	# setToggleColor
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# forwards the setToggleColor message to toggles matching the passed selector.

	# PARAMETERS
	# -----------------------------------------------------------------------------------------
	# sel:          The selector that must be matched by the toggle to be colored.

	setToggleColor: (color, sel) ->
		@_getSubsetOfToggleSwitches sel
			.forEach (toggle) -> toggle.setToggleColor color



	#       _____                    ___          ___                                    ___
	#      /  /::\      ___         /  /\        /  /\        _____                     /  /\
	#     /  /:/\:\    /  /\       /  /:/_      /  /::\      /  /::\                   /  /:/_
	#    /  /:/  \:\  /  /:/      /  /:/ /\    /  /:/\:\    /  /:/\:\   ___     ___   /  /:/ /\
	#   /__/:/ \__\:|/__/::\     /  /:/ /::\  /  /:/~/::\  /  /:/~/::\ /__/\   /  /\ /  /:/ /:/_
	#   \  \:\ /  /:/\__\/\:\__ /__/:/ /:/\:\/__/:/ /:/\:\/__/:/ /:/\:|\  \:\ /  /://__/:/ /:/ /\
	#    \  \:\  /:/    \  \:\/\\  \:\/:/~/:/\  \:\/:/__\/\  \:\/:/~/:/ \  \:\  /:/ \  \:\/:/ /:/
	#     \  \:\/:/      \__\::/ \  \::/ /:/  \  \::/      \  \::/ /:/   \  \:\/:/   \  \::/ /:/
	#      \  \::/       /__/:/   \__\/ /:/    \  \:\       \  \:\/:/     \  \::/     \  \:\/:/
	#       \__\/        \__\/      /__/:/      \  \:\       \  \::/       \__\/       \  \::/
	#                               \__\/        \__\/        \__\/                     \__\/

	# enable/disable
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# forwards the enable/disable messages to toggles matching the passed selector.

	# PARAMETERS
	# -----------------------------------------------------------------------------------------
	# sel:          The selector that must be matched by the toggle to be enabled/disabled.

	enable: (sel) ->
		@_getSubsetOfToggleSwitches sel
			.forEach (toggle) -> toggle.enable()

	disable: (sel) ->
		@_getSubsetOfToggleSwitches sel
			.forEach (toggle) -> toggle.disable()



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

	# _getSubsetOfToggleSwitches
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# Get a subset of all elements that match the passed CSS selector.

	# PARAMETERS
	# -----------------------------------------------------------------------------------------
	# sel:          The selector to search for. Optional. If omitted, all toggles are returned.

	_getSubsetOfToggleSwitches: (sel) ->
		# if sel is undefined, return all switches
		return @toggleSwitches unless sel?
		return @toggleSwitches.filter (toggle) ->
			return toggle.is sel


	# _uniqueID
	# -----------------------------------------------------------------------------------------

	# SUMMARY
	# -----------------------------------------------------------------------------------------
	# Creates a unique ID to prevent duplicate input IDs on a page.

	_uniqueID: ->
		return @_toggleSwitchCount++

ToggleSwitchController._toggleSwitchCount = 0
ToggleSwitchController._uniqueID = () ->
	ToggleSwitchController._toggleSwitchCount++




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

window.ToggleSwitchController = ToggleSwitchController
window.ToggleSwitch = ToggleSwitch
