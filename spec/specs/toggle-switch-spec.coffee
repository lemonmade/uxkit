describe "Toggle Switches", ->
    tsc = $ts = $ts1 = $ts2 = fixture = undefined
    jasmine.getFixtures().fixturesPath = "spec/fixtures"

    beforeEach ->
        loadFixtures "toggle-switch-fixture.html"
        tsc = new ToggleSwitchController()
        tsc.remove()
        return

    afterEach ->
        tsc.remove() if tsc
        $ts = $ts1 = $ts2 = null
        return


    describe "Adding a new toggle", ->
        it "Should set the toggled status", ->
            $ts1 = tsc.add()
            expect($ts1.state()).toBe false
            $ts2 = tsc.add active: true
            expect($ts2.state()).toBe true

        it "Should set the disabled status", ->
            $ts1 = tsc.add()
            expect($ts1.disabled()).toBe false
            $ts2 = tsc.add disabled: true
            expect($ts2.disabled()).toBe true

        it "Should set the toggled color", ->
            targetColor = "rgb(89, 111, 255)"
            $ts1 = tsc.add toggleColor: targetColor
            killTransition $ts1
            $ts1.toggle()
            expect($ts1.color()).toBe targetColor

        it "Should place the toggle in the body if no container is specified", ->
            $ts1 = tsc.add()
            expect($ts1[0].parent("body").length).toBe 1

        it "Should place the toggle in a user-specified container", ->
            containerClass = ".TRACKER"
            $container = $("<div class='#{containerClass.replace /\./g, ""}' />").appendTo "body"
            $ts1 = tsc.add container: containerClass
            $ts2 = tsc.add container: $container
            $ts3 = tsc.add()
            expect($ts1[0].parent(containerClass).length).toBe 1
            expect($ts2[0].parent(containerClass).length).toBe 1
            expect($ts3[0].parent(containerClass).length).toBe 0
            $container.remove()

        it "Should place the toggle in the body if a non-existent container is passed", ->
            containerClass = ".TRACKER"
            $ts1 = tsc.add container: containerClass
            $ts2 = tsc.add container: $(containerClass)
            expect($ts1[0].parent(containerClass).length).toBe 0
            expect($ts1[0].parent("body").length).toBe 1
            expect($ts2[0].parent(containerClass).length).toBe 0
            expect($ts2[0].parent("body").length).toBe 1

        it "Should create unique IDs for each toggle", ->
            $ts1 = tsc.add()
            $ts2 = tsc.add()
            expect($ts1.attr("id")).not.toBe $ts2.attr("id")

        it "Should use a user-specified ID for each toggle", ->
            customID = "my-first-toggle"
            $ts1 = tsc.add id: customID
            $ts2 = tsc.add()
            expect($ts1.attr("id")).toBe customID
            expect($ts2.attr("id")).not.toBe customID

        it "Should use the user-specified label text, or blank by default", ->
            customLabel = "My Label"
            $ts1 = tsc.add label: customLabel
            $ts2 = tsc.add()
            expect($ts1.text()).toBe customLabel
            expect($ts2.text().length).toBe 0

        it "Should use the user-specified name attribute, or 'toggle' by default", ->
            customName = "yosemite"
            $ts1 = tsc.add name: customName
            $ts2 = tsc.add()
            expect($ts1.name()).toBe customName
            expect($ts2.name()).toBe "toggle"
    # end of adding toggle spec


    describe "Changing toggle color", ->
        it "Should change the color when the toggle is toggled", ->
            $ts = tsc.add()
            untoggledColor = $ts.color()
            killTransition $ts
            $ts.toggle()
            toggledColor = $ts.color()
            expect(toggledColor).not.toBe untoggledColor

        it "Should change the toggle color to a new toggle color", ->
            $ts = tsc.add()
            killTransition $ts
            $ts.toggle()
            initialToggledColor = $ts.color()
            newColor = "rgb(89, 111, 255)"
            tsc.setToggleColor newColor
            newToggledColor = $ts.color()
            expect(newColor).toBe newToggledColor
            expect(newToggledColor).not.toBe initialToggledColor
            # Off and on again
            $ts.toggle()
            $ts.toggle()
            newNewToggledColor = $ts.color()
            expect(newNewToggledColor).toBe newToggledColor

        it "Should only color a matching subset of elements", ->
            $ts1 = tsc.add().addClass "TRACKER"
            $ts2 = tsc.add()
            $ts3 = tsc.add().addClass "TRACKER"

            killTransition $ts1, $ts2, $ts3

            [oldColor1, oldColor2, oldColor3] = [$ts1.color(), $ts2.color(), $ts3.color()]
            targetNewColor = "rgb(89, 111, 255)"
            tsc.setToggleColor targetNewColor, ".TRACKER"
            $ts1.toggle()
            $ts2.toggle()
            $ts3.toggle()
            [newColor1, newColor2, newColor3] = [$ts1.color(), $ts2.color(), $ts3.color()]

            expect(oldColor1).toBe oldColor2
            expect(oldColor2).toBe oldColor3
            expect(newColor1).toBe targetNewColor
            expect(newColor2).not.toBe targetNewColor
            expect(newColor3).toBe targetNewColor

        it "Should change a previously-set toggle color", ->
            $ts = tsc.add()
            killTransition $ts
            targetNewColor = "rgb(89, 111, 255)"
            tsc.setToggleColor targetNewColor
            $ts.toggle()
            newColor = $ts.color()
            expect(newColor).toBe targetNewColor
            targetNewNewColor = "rgb(43, 90, 13)"
            tsc.setToggleColor targetNewNewColor
            newNewColor = $ts.color()
            expect(newNewColor).toBe targetNewNewColor
            $ts.toggle()
            $ts.toggle()
            expect($ts.color()).toBe targetNewNewColor
    # end of color changing spec


    describe "Setting disabled status", ->
        it "Should set disabled status properly", ->
            $ts = tsc.add()
            expect($ts.disabled()).toBe false
            expect($ts.enabled()).toBe true
            tsc.disable()
            expect($ts.disabled()).toBe true
            expect($ts.enabled()).toBe false
            tsc.enable()
            expect($ts.disabled()).toBe false
            expect($ts.enabled()).toBe true

        it "Shouldn't be able to toggle when disabled", ->
            $ts = tsc.add()
            initialState = $ts.state()
            tsc.disable()
            $ts.toggle()
            expect($ts.state()).toBe initialState