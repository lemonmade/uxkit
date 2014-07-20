(function() {
  var ToggleSwitch, ToggleSwitchController;

  ToggleSwitch = (function() {
    function ToggleSwitch(details) {
      var $container, $input, $label, defaults, newToggle, options, toggle, toggleHTML, toggleID;
      if (details instanceof jQuery || toString.call(details) === "[object String]") {
        details = $(details);
        $input = details.children("input");
        $label = details.children("label");
        details.attr({
          "role": "checkbox",
          "aria-checked": $input.prop("checked")
        });
        this[0] = details;
        this._input = $input;
        this._label = $label;
        toggle = this;
        $input.on("change", function() {
          return toggle.attr("aria-checked", toggle.checked());
        });
        details.on("keypress", function(event) {
          if (event.charCode === 32) {
            event.preventDefault();
            return toggle.toggle();
          }
        });
      } else {
        defaults = {
          active: false,
          on: false,
          checked: false,
          toggled: false,
          toggle: false,
          container: void 0,
          disabled: false,
          id: void 0,
          label: "",
          name: "toggle"
        };
        options = $.extend(defaults, details);
        toggleID = options.id != null ? options.id : "toggle-switch-" + (ToggleSwitchController._uniqueID());
        toggleHTML = ToggleSwitch.template.replace(/(TOGGLE_ID|LABEL|NAME)/g, function(match) {
          switch (match) {
            case "TOGGLE_ID":
              return toggleID;
            case "LABEL":
              return options.label;
            case "NAME":
              return options.name;
          }
        });
        newToggle = new ToggleSwitch($(toggleHTML));
        if (options.disabled) {
          newToggle.disable();
        }
        if (options.active || options.on || options.checked || options.toggled || options.toggle) {
          newToggle.toggle();
        }
        $container = void 0;
        if (options.container != null) {
          $container = options.container instanceof jQuery ? options.container : $(options.container);
          if ($container.length < 1) {
            $container = "body";
          }
        } else {
          $container = "body";
        }
        newToggle[0].appendTo($container);
        return newToggle;
      }
    }

    ToggleSwitch.prototype.remove = function() {
      return this[0].remove();
    };

    ToggleSwitch.prototype.toggle = function() {
      return this.setState(!this.state());
    };

    ToggleSwitch.prototype.check = function() {
      return this.toggle();
    };

    ToggleSwitch.prototype.state = function() {
      return this.prop("checked");
    };

    ToggleSwitch.prototype.checked = function() {
      return this.state();
    };

    ToggleSwitch.prototype.setState = function(state) {
      var currentState;
      currentState = this.state();
      if (this.disabled() || (state == null)) {
        return currentState;
      }
      if (currentState !== state) {
        this.prop("checked", state);
        this.trigger("change");
      }
      return state;
    };

    ToggleSwitch.prototype.setChecked = function(state) {
      return this.setState(state);
    };

    ToggleSwitch.prototype.enabled = function() {
      return !this.disabled();
    };

    ToggleSwitch.prototype.disabled = function() {
      return this.prop("disabled");
    };

    ToggleSwitch.prototype.enable = function() {
      return !(this.setDisabled(false));
    };

    ToggleSwitch.prototype.disable = function() {
      return this.setDisabled(true);
    };

    ToggleSwitch.prototype.setDisabled = function(disabled) {
      var currentDisabled;
      currentDisabled = this.disabled();
      if (disabled == null) {
        return currentDisabled;
      }
      if (currentDisabled !== disabled) {
        this.prop("disabled", disabled);
      }
      return disabled;
    };

    ToggleSwitch.prototype.addClass = function(newClasses) {
      this[0].addClass(newClasses);
      return this;
    };

    ToggleSwitch.prototype.removeClass = function(newClasses) {
      this[0].removeClass(newClasses);
      return this;
    };

    ToggleSwitch.prototype.toggleClass = function(newClasses) {
      this[0].toggleClass(newClasses);
      return this;
    };

    ToggleSwitch.prototype.hasClass = function(className) {
      return this[0].hasClass(className);
    };

    ToggleSwitch.prototype.find = function(sel) {
      return this[0].find(sel);
    };

    ToggleSwitch.prototype.closest = function(sel) {
      return this[0].closest(sel);
    };

    ToggleSwitch.prototype.children = function(sel) {
      return this[0].children(sel);
    };

    ToggleSwitch.prototype.parent = function(sel) {
      return this[0].parent(sel);
    };

    ToggleSwitch.prototype.trigger = function(event) {
      if (event.match && event.match(/change/)) {
        return this._input.trigger(event);
      } else {
        return this[0].trigger(event);
      }
    };

    ToggleSwitch.prototype.on = function(event, selector, data, handler) {
      if (event.match && event.match(/change/)) {
        return this._input.on(event, selector, data, handler);
      } else {
        return this[0].on(event, selector, data, handler);
      }
    };

    ToggleSwitch.prototype.off = function(event, selector, handler) {
      if (event.match && event.match(/change/)) {
        return this._input.off(event, selector, handler);
      } else {
        return this[0].off(event, selector, handler);
      }
    };

    ToggleSwitch.prototype.css = function(prop, rule) {
      if (rule != null) {
        if (prop.match(/display/)) {
          this[0].css(prop, rule);
        } else {
          this._label.css(prop, rule);
        }
        return this;
      } else {
        if (prop.match(/display/)) {
          return this[0].css(prop);
        } else {
          return this._label.css(prop);
        }
      }
    };

    ToggleSwitch.prototype.is = function(sel) {
      if (sel.match(/(\:checked|\:disabled)/)) {
        return this._input.is(sel);
      } else {
        return this[0].is(sel);
      }
    };

    ToggleSwitch.prototype.html = function() {
      return this[0].html();
    };

    ToggleSwitch.prototype.text = function() {
      return this._label.text();
    };

    ToggleSwitch.prototype.attr = function(attribute, value) {
      if (value != null) {
        if (attribute.match(/aria/)) {
          this[0].attr(attribute, value);
        } else {
          this._input.attr(attribute, value);
        }
        return this;
      } else {
        if (attribute.match(/aria/)) {
          return this[0].attr(attribute);
        } else {
          return this._input.attr(attribute);
        }
      }
    };

    ToggleSwitch.prototype.name = function() {
      return this.attr("name");
    };

    ToggleSwitch.prototype.data = function(key, value) {
      if ((value != null) || typeof key === "object") {
        this[0].data(key, value);
        return this;
      } else {
        return this[0].data(key);
      }
    };

    ToggleSwitch.prototype.prop = function(property, val) {
      if (val != null) {
        this._input.prop(property, val);
        return this;
      } else {
        return this._input.prop(property);
      }
    };

    return ToggleSwitch;

  })();

  ToggleSwitch.template = "<div class='toggle-switch' tabindex='0'> <input type='checkbox' name='NAME' id='TOGGLE_ID' tabindex='-1'> <label for='TOGGLE_ID'> <div class='toggle-switch-accent'></div> <div class='toggle-switch-thumb'></div> </label> </div>";

  ToggleSwitchController = (function() {
    function ToggleSwitchController() {
      var existingToggles;
      existingToggles = [];
      $(".toggle-switch").each(function() {
        return existingToggles.push(new ToggleSwitch($(this)));
      });
      this.toggleSwitches = existingToggles;
      this._toggleSwitchCount = 1;
    }

    ToggleSwitchController.prototype.newToggleSwitch = function(options) {
      var newToggle;
      if (options == null) {
        options = {};
      }
      newToggle = new ToggleSwitch(options);
      this.toggleSwitches.push(newToggle);
      return newToggle;
    };

    ToggleSwitchController.prototype.add = function(options) {
      return this.newToggleSwitch(options);
    };

    ToggleSwitchController.prototype.removeToggleSwitches = function(sel) {
      var livingToggles, tsc;
      tsc = this;
      livingToggles = [];
      this.toggleSwitches.forEach(function(toggle, index) {
        if ((sel == null) || toggle.is(sel)) {
          return toggle.remove();
        } else {
          return livingToggles.push(toggle);
        }
      });
      return this.toggleSwitches = livingToggles;
    };

    ToggleSwitchController.prototype.remove = function(sel) {
      return this.removeToggleSwitches(sel);
    };

    ToggleSwitchController.prototype["delete"] = function(sel) {
      return this.removeToggleSwitches(sel);
    };

    ToggleSwitchController.prototype.toggle = function(sel) {
      return this._getSubsetOfToggleSwitches(sel).forEach(function(toggle) {
        return toggle.toggle();
      });
    };

    ToggleSwitchController.prototype.check = function(sel) {
      return this.toggle(sel);
    };

    ToggleSwitchController.prototype.setState = function(state, sel) {
      return this._getSubsetOfToggleSwitches(sel).forEach(function(toggle) {
        return toggle.setState(state);
      });
    };

    ToggleSwitchController.prototype.setChecked = function(state, sel) {
      return this.setState(state, sel);
    };

    ToggleSwitchController.prototype.setToggleColor = function(color, sel) {
      return this._getSubsetOfToggleSwitches(sel).forEach(function(toggle) {
        return toggle.setToggleColor(color);
      });
    };

    ToggleSwitchController.prototype.enable = function(sel) {
      return this._getSubsetOfToggleSwitches(sel).forEach(function(toggle) {
        return toggle.enable();
      });
    };

    ToggleSwitchController.prototype.disable = function(sel) {
      return this._getSubsetOfToggleSwitches(sel).forEach(function(toggle) {
        return toggle.disable();
      });
    };

    ToggleSwitchController.prototype._getSubsetOfToggleSwitches = function(sel) {
      if (sel == null) {
        return this.toggleSwitches;
      }
      return this.toggleSwitches.filter(function(toggle) {
        return toggle.is(sel);
      });
    };

    ToggleSwitchController.prototype._uniqueID = function() {
      return this._toggleSwitchCount++;
    };

    return ToggleSwitchController;

  })();

  ToggleSwitchController._toggleSwitchCount = 0;

  ToggleSwitchController._uniqueID = function() {
    return ToggleSwitchController._toggleSwitchCount++;
  };

  window.ToggleSwitchController = ToggleSwitchController;

  window.ToggleSwitch = ToggleSwitch;

}).call(this);
