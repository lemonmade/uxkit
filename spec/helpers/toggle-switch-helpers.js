(function() {
  var killTransition, root,
    __slice = [].slice;

  killTransition = function() {
    var toggleSwitches;
    toggleSwitches = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return toggleSwitches.forEach(function(toggleSwitch) {
      return toggleSwitch.css("transition", "none");
    });
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.killTransition = killTransition;

}).call(this);
