killTransition = (toggleSwitches...) ->
    toggleSwitches.forEach (toggleSwitch) ->
        toggleSwitch.css "transition", "none"

root = exports ? this
root.killTransition = killTransition