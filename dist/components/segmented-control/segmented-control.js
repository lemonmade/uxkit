(function() {
  var SegmentedControl, SegmentedControlController, SegmentedControlOption,
    __slice = [].slice;

  SegmentedControl = (function() {
    function SegmentedControl($segmentedControl) {
      this.segmentedControl = $segmentedControl;
    }

    SegmentedControl.prototype._setSegmentMaxWidth = function(changeCountBy, $newElem) {
      var $segments, segmentMaxWidth;
      if (changeCountBy == null) {
        changeCountBy = 0;
      }
      $segments = this.segmentedControl.children(".segmented-option");
      segmentMaxWidth = "" + ((100 / ($segments.length + changeCountBy)).toPrecision(5)) + "%";
      $segments.each(function() {
        return $(this).css("max-width", segmentMaxWidth);
      });
      if ($newElem != null) {
        return $newElem.css("max-width", segmentMaxWidth);
      }
    };

    SegmentedControl.prototype.addOption = function(option, position) {
      var $option, controlName, numberOfOptions, optionHTML;
      controlName = this.segmentedControl.attr("data-control-name");
      numberOfOptions = this.segmentedControl.children(".segmented-option").length;
      if (position == null) {
        position = numberOfOptions + 1;
      }
      optionHTML = SegmentedControlOption.template.replace(/(ID|NAME|LABEL)/g, function(match) {
        switch (match) {
          case "ID":
            return option.id;
          case "NAME":
            return controlName;
          case "LABEL":
            return option.label;
        }
      });
      $option = $(optionHTML);
      if (option.selected && this.segmentedControl.find(":checked").length < 1) {
        $option.children("input").prop("checked", true);
      }
      this._setSegmentMaxWidth(1, $option);
      if (position === 1) {
        $option.prependTo(this.segmentedControl);
      } else if (position > (numberOfOptions + 1)) {
        $option.appendTo(this.segmentedControl);
      } else {
        $option.insertAfter(this.segmentedControl.children(".segmented-option:nth-of-type(" + (position - 1) + ")"));
      }
      return this;
    };

    SegmentedControl.prototype.removeOptions = function() {
      var findSelector, options;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      findSelector = "";
      options.forEach(function(option) {
        if (typeof option !== "number") {
          if (toString.call(option) === "[object String]") {
            return findSelector += "#" + option + " ";
          } else {
            return findSelector += "#" + option.id + " ";
          }
        } else {
          return findSelector += ":nth-of-type(" + option + ") ";
        }
      });
      findSelector = findSelector.split(" ").join(", ").replace(/(,\s)$/, "");
      console.log(findSelector);
      this.segmentedControl.children(findSelector).remove();
      this._setSegmentMaxWidth();
      return this;
    };

    return SegmentedControl;

  })();

  SegmentedControl.template = "<div class='segmented-control' data-control-name='NAME'></div>";

  SegmentedControlOption = (function() {
    function SegmentedControlOption(id, label, selected) {
      if (selected == null) {
        selected = false;
      }
      if (typeof id === "object") {
        this.id = id.id;
        this.label = id.label;
        this.selected = id.selected != null ? id.selected : false;
      } else {
        this.id = id;
        this.label = label;
        this.selected = selected;
      }
    }

    return SegmentedControlOption;

  })();

  SegmentedControlOption.template = "<div class='segmented-option'> <input type='radio' name='NAME' id='ID'> <label for='ID'>LABEL</label> </div>";

  SegmentedControlController = (function() {
    function SegmentedControlController() {
      this.segmentedControls = [];
    }

    SegmentedControlController.prototype.newSegmentedControl = function() {
      var $segmentedControl, defaults, options, segmentOptions, segmentedControl, selectedSegmentChosen, _i;
      segmentOptions = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), options = arguments[_i++];
      console.log(segmentOptions, options);
      if (options instanceof SegmentedControlOption || (options.id != null)) {
        segmentOptions.push(options);
        options = {};
      }
      defaults = {
        container: "body",
        name: "segmented-control"
      };
      options = $.extend(defaults, options);
      selectedSegmentChosen = false;
      $segmentedControl = $(SegmentedControl.template.replace("NAME", options.name));
      segmentOptions.forEach((function(_this) {
        return function(option) {
          var $segmentOption, segmentHTML;
          segmentHTML = (_this._createSegmentedOption(option)).replace("NAME", options.name);
          $segmentOption = $(segmentHTML).appendTo($segmentedControl);
          if (option.selected && !selectedSegmentChosen) {
            $segmentOption.children("input").prop("checked", true);
            return selectedSegmentChosen = true;
          }
        };
      })(this));
      segmentedControl = new SegmentedControl($segmentedControl);
      segmentedControl._setSegmentMaxWidth();
      this.segmentedControls.push(segmentedControl);
      $segmentedControl.appendTo(options.container);
      return segmentedControl;
    };

    SegmentedControlController.prototype.setMainColor = function(color) {
      var toggledRule, untoggledRule;
      untoggledRule = ".segmented-option label { color: " + color + "; }\n .segmented-option { border-color: " + color + "; }";
      toggledRule = ".segmented-option input:checked + label { background-color: " + color + "; }";
      this._appendCustomStyle(toggledRule, untoggledRule, "updatedMainColor");
      return this;
    };

    SegmentedControlController.prototype.setSecondaryColor = function(color) {
      var toggledRule, untoggledRule;
      untoggledRule = ".segmented-option label { background-color: " + color + "; }";
      toggledRule = ".segmented-option input:checked + label { color: " + color + "; }";
      this._appendCustomStyle(toggledRule, untoggledRule, "updatedSecondaryColor");
      return this;
    };

    SegmentedControlController.prototype._appendCustomStyle = function(toggledRule, untoggledRule, type) {
      var rules, targetStyle;
      rules = "&shy;<style>" + untoggledRule + "\n" + toggledRule + "</style>";
      targetStyle = this[type];
      if (targetStyle != null) {
        return targetStyle.html(rules);
      } else {
        return this[type] = $("<div>" + rules + "</div>").appendTo("body");
      }
    };

    SegmentedControlController.prototype._createSegmentedOption = function(option) {
      return SegmentedControlOption.template.replace(/(ID|LABEL)/g, function(match) {
        switch (match) {
          case "ID":
            return option.id;
          case "LABEL":
            return option.label;
        }
      });
    };

    return SegmentedControlController;

  })();

  window.SegmentedControlController = SegmentedControlController;

  window.SegmentedControlOption = SegmentedControlOption;

  window.SegmentedControl = SegmentedControl;

}).call(this);
