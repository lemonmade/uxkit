(function() {
  describe("Toggle Switches", function() {
    var $ts, $ts1, $ts2, fixture, tsc;
    tsc = $ts = $ts1 = $ts2 = fixture = void 0;
    jasmine.getFixtures().fixturesPath = "spec/fixtures";
    beforeEach(function() {
      loadFixtures("toggle-switch-fixture.html");
      tsc = new ToggleSwitchController();
      tsc.remove();
    });
    afterEach(function() {
      if (tsc) {
        tsc.remove();
      }
      $ts = $ts1 = $ts2 = null;
    });
    describe("Adding a new toggle", function() {
      it("Should set the toggled status", function() {
        $ts1 = tsc.add();
        expect($ts1.state()).toBe(false);
        $ts2 = tsc.add({
          active: true
        });
        return expect($ts2.state()).toBe(true);
      });
      it("Should set the disabled status", function() {
        $ts1 = tsc.add();
        expect($ts1.disabled()).toBe(false);
        $ts2 = tsc.add({
          disabled: true
        });
        return expect($ts2.disabled()).toBe(true);
      });
      it("Should set the toggled color", function() {
        var targetColor;
        targetColor = "rgb(89, 111, 255)";
        $ts1 = tsc.add({
          toggleColor: targetColor
        });
        killTransition($ts1);
        $ts1.toggle();
        return expect($ts1.color()).toBe(targetColor);
      });
      it("Should place the toggle in the body if no container is specified", function() {
        $ts1 = tsc.add();
        return expect($ts1[0].parent("body").length).toBe(1);
      });
      it("Should place the toggle in a user-specified container", function() {
        var $container, $ts3, containerClass;
        containerClass = ".TRACKER";
        $container = $("<div class='" + (containerClass.replace(/\./g, "")) + "' />").appendTo("body");
        $ts1 = tsc.add({
          container: containerClass
        });
        $ts2 = tsc.add({
          container: $container
        });
        $ts3 = tsc.add();
        expect($ts1[0].parent(containerClass).length).toBe(1);
        expect($ts2[0].parent(containerClass).length).toBe(1);
        expect($ts3[0].parent(containerClass).length).toBe(0);
        return $container.remove();
      });
      it("Should place the toggle in the body if a non-existent container is passed", function() {
        var containerClass;
        containerClass = ".TRACKER";
        $ts1 = tsc.add({
          container: containerClass
        });
        $ts2 = tsc.add({
          container: $(containerClass)
        });
        expect($ts1[0].parent(containerClass).length).toBe(0);
        expect($ts1[0].parent("body").length).toBe(1);
        expect($ts2[0].parent(containerClass).length).toBe(0);
        return expect($ts2[0].parent("body").length).toBe(1);
      });
      it("Should create unique IDs for each toggle", function() {
        $ts1 = tsc.add();
        $ts2 = tsc.add();
        return expect($ts1.attr("id")).not.toBe($ts2.attr("id"));
      });
      it("Should use a user-specified ID for each toggle", function() {
        var customID;
        customID = "my-first-toggle";
        $ts1 = tsc.add({
          id: customID
        });
        $ts2 = tsc.add();
        expect($ts1.attr("id")).toBe(customID);
        return expect($ts2.attr("id")).not.toBe(customID);
      });
      it("Should use the user-specified label text, or blank by default", function() {
        var customLabel;
        customLabel = "My Label";
        $ts1 = tsc.add({
          label: customLabel
        });
        $ts2 = tsc.add();
        expect($ts1.text()).toBe(customLabel);
        return expect($ts2.text().length).toBe(0);
      });
      return it("Should use the user-specified name attribute, or 'toggle' by default", function() {
        var customName;
        customName = "yosemite";
        $ts1 = tsc.add({
          name: customName
        });
        $ts2 = tsc.add();
        expect($ts1.name()).toBe(customName);
        return expect($ts2.name()).toBe("toggle");
      });
    });
    describe("Changing toggle color", function() {
      it("Should change the color when the toggle is toggled", function() {
        var toggledColor, untoggledColor;
        $ts = tsc.add();
        untoggledColor = $ts.color();
        killTransition($ts);
        $ts.toggle();
        toggledColor = $ts.color();
        return expect(toggledColor).not.toBe(untoggledColor);
      });
      it("Should change the toggle color to a new toggle color", function() {
        var initialToggledColor, newColor, newNewToggledColor, newToggledColor;
        $ts = tsc.add();
        killTransition($ts);
        $ts.toggle();
        initialToggledColor = $ts.color();
        newColor = "rgb(89, 111, 255)";
        tsc.setToggleColor(newColor);
        newToggledColor = $ts.color();
        expect(newColor).toBe(newToggledColor);
        expect(newToggledColor).not.toBe(initialToggledColor);
        $ts.toggle();
        $ts.toggle();
        newNewToggledColor = $ts.color();
        return expect(newNewToggledColor).toBe(newToggledColor);
      });
      it("Should only color a matching subset of elements", function() {
        var $ts3, newColor1, newColor2, newColor3, oldColor1, oldColor2, oldColor3, targetNewColor, _ref, _ref1;
        $ts1 = tsc.add().addClass("TRACKER");
        $ts2 = tsc.add();
        $ts3 = tsc.add().addClass("TRACKER");
        killTransition($ts1, $ts2, $ts3);
        _ref = [$ts1.color(), $ts2.color(), $ts3.color()], oldColor1 = _ref[0], oldColor2 = _ref[1], oldColor3 = _ref[2];
        targetNewColor = "rgb(89, 111, 255)";
        tsc.setToggleColor(targetNewColor, ".TRACKER");
        $ts1.toggle();
        $ts2.toggle();
        $ts3.toggle();
        _ref1 = [$ts1.color(), $ts2.color(), $ts3.color()], newColor1 = _ref1[0], newColor2 = _ref1[1], newColor3 = _ref1[2];
        expect(oldColor1).toBe(oldColor2);
        expect(oldColor2).toBe(oldColor3);
        expect(newColor1).toBe(targetNewColor);
        expect(newColor2).not.toBe(targetNewColor);
        return expect(newColor3).toBe(targetNewColor);
      });
      return it("Should change a previously-set toggle color", function() {
        var newColor, newNewColor, targetNewColor, targetNewNewColor;
        $ts = tsc.add();
        killTransition($ts);
        targetNewColor = "rgb(89, 111, 255)";
        tsc.setToggleColor(targetNewColor);
        $ts.toggle();
        newColor = $ts.color();
        expect(newColor).toBe(targetNewColor);
        targetNewNewColor = "rgb(43, 90, 13)";
        tsc.setToggleColor(targetNewNewColor);
        newNewColor = $ts.color();
        expect(newNewColor).toBe(targetNewNewColor);
        $ts.toggle();
        $ts.toggle();
        return expect($ts.color()).toBe(targetNewNewColor);
      });
    });
    return describe("Setting disabled status", function() {
      it("Should set disabled status properly", function() {
        $ts = tsc.add();
        expect($ts.disabled()).toBe(false);
        expect($ts.enabled()).toBe(true);
        tsc.disable();
        expect($ts.disabled()).toBe(true);
        expect($ts.enabled()).toBe(false);
        tsc.enable();
        expect($ts.disabled()).toBe(false);
        return expect($ts.enabled()).toBe(true);
      });
      return it("Shouldn't be able to toggle when disabled", function() {
        var initialState;
        $ts = tsc.add();
        initialState = $ts.state();
        tsc.disable();
        $ts.toggle();
        return expect($ts.state()).toBe(initialState);
      });
    });
  });

}).call(this);
