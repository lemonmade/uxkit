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
      if (option["default"] && this.segmentedControl.find(":checked").length < 1) {
        $option.children("input").prop("checked", true);
      }
      this._setSegmentMaxWidth(1, $option);
      if (position === 1) {
        return $option.prependTo(this.segmentedControl);
      } else if (position > (numberOfOptions + 1)) {
        return $option.appendTo(this.segmentedControl);
      } else {
        return $option.insertAfter(this.segmentedControl.children(".segmented-option:nth-of-type(" + (position - 1) + ")"));
      }
    };

    return SegmentedControl;

  })();

  SegmentedControl.template = "<div class='segmented-control' data-control-name='NAME'></div>";

  SegmentedControlOption = (function() {
    function SegmentedControlOption(id, label, _default) {
      this.id = id;
      this.label = label;
      this["default"] = _default != null ? _default : false;
    }

    return SegmentedControlOption;

  })();

  SegmentedControlOption.template = "<div class='segmented-option'> <input type='radio' name='NAME' id='ID'> <label for='ID'>LABEL</label> </div>";

  SegmentedControlController = (function() {
    function SegmentedControlController() {
      this.segmentedControls = [];
    }

    SegmentedControlController.prototype.newSegmentedControl = function() {
      var $segmentedControl, defaults, options, segmentOptions, segmentedControl, _i;
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
      $segmentedControl = $(SegmentedControl.template.replace("NAME", options.name));
      segmentOptions.forEach((function(_this) {
        return function(option) {
          var $segmentOption, segmentHTML;
          segmentHTML = (_this.createSegmentedOption(option)).replace("NAME", options.name);
          $segmentOption = $(segmentHTML).appendTo($segmentedControl);
          if (option["default"]) {
            return $segmentOption.children("input").prop("checked", true);
          }
        };
      })(this));
      segmentedControl = new SegmentedControl($segmentedControl);
      segmentedControl._setSegmentMaxWidth();
      this.segmentedControls.push(segmentedControl);
      return $segmentedControl.appendTo(options.container);
    };

    SegmentedControlController.prototype.createSegmentedOption = function(option) {
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
