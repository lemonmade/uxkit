describe "Message Bubble", ->
    mc = fixture = $m = $m1 = $m2 = $m3 = undefined
    jasmine.getFixtures().fixturesPath = "spec/fixtures"

    beforeEach ->
        loadFixtures "message-bubble-fixture.html"
        mc = new MessageBubbleController()
        mc.remove()
        return

    afterEach ->
        mc.remove() if mc
        $m1 = $m2 = $m3 = null
        return


    describe "Adding new messages", ->

        describe "Basic addition operations", ->
            it "Should add the new message object to its internally stored collection", ->
                expect(mc.messages.length).toBe 0
                $m = mc.add("New message")
                expect(mc.messages.length).toBe 1

            it "Should return a jQuery object of the new message on success", ->
                $m = mc.add("This is a new message")
                expect($m instanceof jQuery).toBe true

            it "Should create a message that contains the same HTML as the passed string", ->
                mHTML = "This is a new message with <strong>a number of</strong> <a href=\"www.lemondesign.co\">HTML tags</a>"
                $m = mc.add mHTML
                expect($m.html()).toMatch mHTML
        # end of basic addition operations spec


        describe "Message insertion positions", ->

            # NOTE:
            # The following are the possible insertion position adjustment
            # options, in descending order of precendence:
            # 1. options.after to specify a message after which it should be placed
            # 2. options.before to specify a message before which it should be placed
            # 3. settings.automateDateSections && options.timestamp && more than one message.
            #    This will automate the creation of date sections based on the difference
            #    in timestamps and settings.dateSectionCutoff
            # 4. Insertion in the container specified in the function options array, modified
            #    with the options.append attribute. (this will insert the message at the end
            #    of a date section if one exists at the end (append) or beginning (prepend)
            #    of the container. This will obviously ignore automating of date sections).
            # 5. Insertion in the container specified by the init function for MessageBubbleController.
            #    (same caveats as for #4).
            # 6. Insertion in .message-bubble-container, if such an element exists
            #    (body if one does not), if no user-passed container is specified.
            #    (same caveats apply as for #4-5)

            describe "Should respect the after option (comment #1)", ->
                it "Should add the new message directly after in the default container", ->
                    mc = new MessageBubbleController(automateDateSections: false)
                    $m1 = mc.add("A message")
                    $m2 = mc.add("Another message", after: $m1)
                    $parentChildrenSet = $m1.parent().children()
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe 1

                it "Should create a new message directly after in a user-passed container", ->
                    mc = new MessageBubbleController(automateDateSections: false)
                    $specialContainer = $("<div class='special-container' />").appendTo("body")
                    $m1 = mc.add("A message", container: $specialContainer)
                    $m2 = mc.add("Another message", after: $m1)
                    expect($m2.parent()).toHaveClass "special-container"
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe 1

                it "Should create a new message directly after even when given a conflicting container", ->
                    mc = new MessageBubbleController(automateDateSections: false)
                    $specialContainer = $("<div class='special-container' />").appendTo("body")
                    $anotherSpecialContainer = $("<div class='another-special-container' />").appendTo("body")
                    $m1 = mc.add("A message", container: $specialContainer )
                    $m2 = mc.add("Another message", after: $m1, container: $anotherSpecialContainer )
                    expect($m2.parent()).toHaveClass "special-container"
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe 1

                it "Should create a new message directly after even when given a conflicting before option", ->
                    mc = new MessageBubbleController(automateDateSections: false)
                    $m1 = mc.add("A message")
                    $m2 = mc.add("Another message")
                    $m3 = mc.add("A final message", after: $m2, before: $m1)
                    expect(getDifferenceBetweenIndecesInParentSet($m2, $m3)).toBe 1
                    expect(getDifferenceBetweenIndecesInParentSet($m3, $m1)).not.toBe 1

                it "Should create a new message directly after even when automatic date sectioning would prevent this", ->
                    expect(mc.automateDateSections).toBe true
                    $m1 = mc.add("A new message")
                    $m2 = mc.add("Another message", after: $m1, artificialDate: (new Date()).getTime() + 10000000000 )
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe 1

            # end of after position spec


            describe "Should respect the before option (comment #2)", ->
                it "Should add the new message directly before in the default container", ->
                    mc = new MessageBubbleController(automateDateSections: false)
                    $m1 = mc.add("A message")
                    $m2 = mc.add("Another message", before: $m1)
                    $parentChildrenSet = $m1.parent().children()
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe -1

                it "Should create a new message directly before in a user-passed container", ->
                    mc = new MessageBubbleController(automateDateSections: false)
                    $specialContainer = $("<div class='special-container' />").appendTo("body")
                    $m1 = mc.add("A message", container: $specialContainer)
                    $m2 = mc.add("Another message", before: $m1)
                    expect($m2.parent()).toHaveClass "special-container"
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe -1

                it "Should create a new message directly before even when given a conflicting container", ->
                    mc = new MessageBubbleController(automateDateSections: false)
                    $specialContainer = $("<div class='special-container' />").appendTo("body")
                    $anotherSpecialContainer = $("<div class='another-special-container' />").appendTo("body")
                    $m1 = mc.add("A message", container: $specialContainer)
                    $m2 = mc.add("Another message", before: $m1, container: $anotherSpecialContainer)
                    expect($m2.parent()).toHaveClass "special-container"
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe -1

                it "Should create a new message directly before even when automatic date sectioning would prevent this", ->
                    expect(mc.automateDateSections).toBe true
                    $m1 = mc.add("A new message")
                    $m2 = mc.add("Another message", before: $m1, artificialDate: (new Date()).getTime() + 10000000000)
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe -1

            # end of before position spec


            describe "Should respect the automateDateSections setting (comment #3)", ->
                it "Should not create a new date section when the date is on the same calendar day", ->
                    d = new Date(0)
                    endOfD = new Date(86400000 - 1)
                    $m1 = mc.add("A message", artificialDate: d)
                    $m2 = mc.add("Another message", artificialDate: endOfD)
                    expect($m2.parent()).not.toHaveClass "message-bubble-date-section"
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe 1

                it "Should create a new date section when the date is on the next calendar day or later", ->
                    d = new Date(0)
                    endOfD = new Date(86400000 + 1)
                    $m1 = mc.add("A message", artificialDate: d)
                    $m2 = mc.add("Another message", artificialDate: endOfD)
                    expect($m2.parent()).toHaveClass "message-bubble-date-section"
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2.parent())).toBe 1

                it "Should create another new new date section following the first one when a third day, at least one calendar day after the second, is added", ->
                    d1 = new Date(0)
                    d2 = new Date(86400000 + 1)
                    d3 = new Date(2 * 86400000 + 1)
                    $m1 = mc.add("A message", artificialDate: d1)
                    $m2 = mc.add("Another message", artificialDate: d2)
                    $m3 = mc.add("A final message", artificialDate: d3)
                    expect($m2.parent()).toHaveClass "message-bubble-date-section"
                    expect($m3.parent()).toHaveClass "message-bubble-date-section"
                    expect($m2.parent().children(".message-bubble").length).toBe 1
                    expect($m3.parent().children(".message-bubble").length).toBe 1
                    expect(getDifferenceBetweenIndecesInParentSet($m2.parent(), $m3.parent())).toBe 1

                it "Should not create another new new date section following the first one when a third day, less than one calendar day after the second, is added", ->
                    d1 = new Date(0)
                    d2 = new Date(86400000 + 1)
                    d3 = new Date(2 * 86400000 - 1)
                    $m1 = mc.add("A message", artificialDate: d1)
                    $m2 = mc.add("Another message", artificialDate: d2)
                    $m3 = mc.add("A final message", artificialDate: d3)
                    expect($m2.parent()).toHaveClass "message-bubble-date-section"
                    expect($m3.parent()).toHaveClass "message-bubble-date-section"
                    expect($m2.parent().children(".message-bubble").length).toBe 2
                    expect($m2.parent()).toEqual $m3.parent()


                    # TODO: more advanced positioning for automatic date sections by sorting by timestamp (and allowing this to be done after the fact)


            describe "Should create a message in the user-passed container (comment #4-5)", ->
                $specialContainer = undefined

                beforeEach ->
                    $specialContainer = $("<div class='special-container' />").appendTo("body")
                    mc = new MessageBubbleController(container: $specialContainer)

                afterEach ->
                    $specialContainer.remove()

                it "Should do this when the container is passed to the MessageBubbleController init", ->
                    $m = mc.add("A message")
                    expect($m.parent()).toHaveClass "special-container"

                it "Should do this when the container is passed in the add options object", ->
                    mc = new MessageBubbleController()
                    $m1 = mc.add("A message", container: $specialContainer)
                    expect($m1.parent()).toHaveClass "special-container"
                    mc.remove()
                    $m2 = mc.add("Another message")
                    expect($m2.parent()).not.toHaveClass "special-container"

                it "Should create the message in the function options container if this conflicts with the init options", ->
                    $anotherSpecialContainer = $("<div class='another-special-container' />").appendTo("body")
                    $m1 = mc.add("A message", container: $anotherSpecialContainer)
                    expect($m1.parent()).toHaveClass "another-special-container"
                    mc.remove()
                    $m2 = mc.add("Another message")
                    expect($m2.parent()).toHaveClass "special-container"

            # end of user-provided container addition spec


            describe "Should create message in appropriate default container (comment #6)", ->
                it "Should create a new message at the end of the message bubble container when such a container exists", ->
                    $m1 = mc.add("The first message")
                    lastSelector = ".message-bubble-container .message-bubble:last"
                    expect($m1).toEqual lastSelector
                    $m2 = mc.add("The second message")
                    expect($m2).toEqual lastSelector
                    expect($m1).not.toEqual lastSelector

                it "Should create a message in the `body` when no message container exists", ->
                    $(".message-bubble-container").remove()
                    mc = new MessageBubbleController()
                    $m1 = mc.add("The first message")
                    lastSelector = "body .message-bubble:last"
                    expect($m1).toEqual lastSelector
                    $m2 = mc.add("The second message")
                    expect($m2).toEqual lastSelector
                    expect($m1).not.toEqual lastSelector
                    $(".message-bubble-container").appendTo "body"

            # end of default container spec


            describe "Should respect the append option", ->
                beforeEach ->
                    mc = new MessageBubbleController(automateDateSections: false)

                it "Should add to the end of the container by default", ->
                    $m1 = mc.add("A message")
                    $m2 = mc.add("Another message")
                    $fullSet = $m2.parent().children()
                    expect($fullSet.index($m2)).toBe $fullSet.length - 1
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe 1
                    $m3 = mc.add("A final message", append: true)
                    $fullSet = $m3.parent().children()
                    expect($fullSet.index($m3)).toBe $fullSet.length - 1
                    expect(getDifferenceBetweenIndecesInParentSet($m2, $m3)).toBe 1

                it "Should add to the beginning of the container when append is false", ->
                    $m1 = mc.add("A message")
                    $m2 = mc.add("Another message", append: false)
                    $fullSet = $m2.parent().children()
                    expect($fullSet.index($m2)).toBe 0
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe -1
                    $m3 = mc.add("A final message")
                    $fullSet = $m3.parent().children()
                    expect($fullSet.index($m3)).toBe $fullSet.length - 1
                    expect(getDifferenceBetweenIndecesInParentSet($m1, $m3)).toBe 1

                it "Should insert the message into a specified container if append is a jQuery object", ->
                    $specialContainer = $("<div class='special-container' />").appendTo("body")
                    $m1 = mc.add("A message")
                    $m2 = mc.add("Another message", append: $specialContainer)
                    expect($m1.closest(".special-container").length).toBe 0
                    expect($m2.closest(".special-container").length).toBeGreaterThan 0
                    expect($m2.parent().children().index($m2)).toBe 0
                    $m3 = mc.add("A final message", append: $specialContainer)
                    expect($m3.closest(".special-container").length).toBeGreaterThan 0
                    expect($m3.parent().children().index($m3)).toBe 1

                it "Should insert the message into a specified container if append is a string", ->
                    $specialContainer = $("<div class='special-container' />").appendTo("body")
                    $m1 = mc.add("A message")
                    $m2 = mc.add("Another message", append: ".special-container")
                    expect($m1.closest(".special-container").length).toBe 0
                    expect($m2.closest(".special-container").length).toBeGreaterThan 0
                    expect($m2.parent().children().index($m2)).toBe 0
                    $m3 = mc.add("A final message", append: ".special-container")
                    expect($m3.closest(".special-container").length).toBeGreaterThan 0
                    expect($m3.parent().children().index($m3)).toBe 1

            # end of append option spec
        # end of message insertion position


        describe "Setting reply status", ->

            # Reply status can be set in two ways, which are respected in the
            # following order of precendence.
            it "Should add the reply class when that option is passed", ->
                $m1 = mc.add("A message", reply: true)
                expect($m1).toHaveClass "reply"
                $m1 = mc.add("Another message")
                expect($m1).not.toHaveClass "reply"

            it "Should add the reply status (or not) appropriately with the inReplyTo option", ->
                $m1 = mc.add("A message")
                $m2 = mc.add("Another message", inReplyTo: $m1)
                $m3 = mc.add("A final message", inReplyTo: $m2)
                expect($m1).not.toHaveClass "reply"
                expect($m2).toHaveClass "reply"
                expect($m3).not.toHaveClass "reply"

            it "Should respect the inReplyTo option over the reply option", ->
                $m1 = mc.add("A message")
                $m2 = mc.add("Another message", inReplyTo: $m1, reply: false)
                $m3 = mc.add("A final message", inReplyTo: $m2, reply: true)
                expect($m1).not.toHaveClass "reply"
                expect($m2).toHaveClass "reply"
                expect($m3).not.toHaveClass "reply"
        # end of reply status spec


        describe "Setting whale-tail existence", ->
            it "Should set the no-tail class based on the tail option", ->
                $m1 = mc.add("A mesage")
                $m2 = mc.add("Another message", tail: false)
                expect($m1).not.toHaveClass "no-tail"
                expect($m2).toHaveClass "no-tail"
        # end of whale-tail spec

        # TODO: artificalDate
    # end of adding message spec


    describe "Manipulating the typing indicator", ->
        it "Should add a typing indicator to the end of the message container", ->
            $m1 = mc.add "A message"
            $m2 = mc.add "Another message"
            expect($(".typing-indicator").length).toBe(0)
            mc.typing()
            expect($(".typing-indicator").length).toBe(1)
            expect(getDifferenceBetweenIndecesInParentSet $m2, $(".typing-indicator")).toBe(1)

        it "Should not add a typing indicator if one already exists", ->
            $m1 = mc.add "A message"
            $m2 = mc.add "Another message"
            mc.typing()
            expect($(".typing-indicator").length).toBe(1)
            mc.typing()
            expect($(".typing-indicator").length).toBe(1)

        it "Should remove the typing indicator if it exists", ->
            $m1 = mc.add "A message"
            mc.typing false
            expect($(".typing-indicator").length).toBe(0)
            mc.typing true
            expect($(".typing-indicator").length).toBe(1)
            mc.typing false
            expect($(".typing-indicator").length).toBe(0)
    # end of typing indicator spec

    describe "Date section creation", ->
        # TODO
    # end of date section creation spec

    describe "Removing messages", ->
        it "Should remove the message object to its internally stored collection", ->
            $m1 = mc.add("New message").addClass("TRACKER")
            expect(mc.messages.length).toBe 1
            mc.remove ".TRACKER"
            expect(mc.messages.length).toBe 0

        it "Should remove the message from the DOM", ->
            $m1 = mc.add("New message").addClass("TRACKER")
            mc.remove ".TRACKER"
            expect($m1.closest("body").length).toBe 0

        it "Should remove a proper subset of the elements matching the passed selector", ->
            $m1 = mc.add("A message").addClass("SPECIAL")
            $m2 = mc.add("Another message")
            $m3 = mc.add("A final message").addClass("SPECIAL")
            $removed = mc.remove(".SPECIAL")
            expect($removed.length).toBe 2
            expect($removed.index($m1)).toBeGreaterThan -1
            expect($removed.index($m2)).toBeLessThan 0
            expect($removed.index($m3)).toBeGreaterThan -1
            expect($m1.closest("body").length).toBe 0
            expect($m2.closest("body").length).toBe 1
            expect($m3.closest("body").length).toBe 0

        it "Should remove a proper subset of the elements matching the passed message string", ->
            matchingMessage = "A message that should match"
            $m1 = mc.add(matchingMessage)
            $m2 = mc.add(matchingMessage)
            $m3 = mc.add("A non-matching message")
            $removed = mc.remove(matchingMessage)
            expect($removed.length).toBe 2
            expect($removed.index($m1)).toBeGreaterThan -1
            expect($removed.index($m2)).toBeGreaterThan -1
            expect($removed.index($m3)).toBeLessThan 0
            expect($m1.closest("body").length).toBe 0
            expect($m2.closest("body").length).toBe 0
            expect($m3.closest("body").length).toBe 1

        it "Should remove the date section the message is in if no other messages exist in that section", ->
            d1 = 0
            d2 = 86400000 + 1
            $m1 = mc.add("A message", artificialDate: d1)
            $m2 = mc.add("Another message", artificialDate: d2).addClass("TRACKER")
            $dateSection = $m2.closest(".message-bubble-date-section")
            $dateHeading = $dateSection.children(".message-bubble-heading")
            expect($dateSection.length).toBeGreaterThan 0
            expect($dateHeading.length).toBeGreaterThan 0
            expect(getDifferenceBetweenIndecesInParentSet($m1, $dateSection)).toBe 1
            mc.remove ".TRACKER"
            expect($m2.closest("body").length).toBe 0
            expect($dateSection.closest("body").length).toBe 0
            expect($dateHeading.closest("body").length).toBe 0
    # end of the message removal spec


    describe "Message subset creations", ->
        classTracker = "SPECIAL"

        beforeEach ->
            $m1 = mc.add("A message").addClass(classTracker)
            $m2 = mc.add("Another message")
            $m3 = mc.add("A final message").addClass(classTracker)

        it "Returns all messages when no selector is given", ->
            $set = mc.getSubsetOfMessages()
            expect($set.length).toBe 3
            expect($set.index($m1)).toBeGreaterThan -1
            expect($set.index($m2)).toBeGreaterThan -1
            expect($set.index($m3)).toBeGreaterThan -1

        it "Returns a proper subset based on the past selector", ->
            $set = mc.getSubsetOfMessages("." + classTracker)
            expect($set.length).toBe 2
            expect($set.index($m1)).toBeGreaterThan -1
            expect($set.index($m2)).toBeLessThan 0
            expect($set.index($m3)).toBeGreaterThan -1
    # end of message subset creation spec


    describe "Message recoloring operations", ->
        it "Should set the background color to the user-specified one", ->
            trackerClass = "M-ONE"
            $m1 = mc.add("A message").addClass(trackerClass)
            $m2 = mc.add("Another message")
            color = "rgba(255, 0, 0, 0)"
            mc.setBackgroundColor color, "." + trackerClass
            expect($m1.css("background-color")).toEqual color
            expect($m2.css("background-color")).not.toEqual color

        it "Should set the text color to the user-specified one", ->
            trackerClass = "M-ONE"
            $m1 = mc.add("A message").addClass(trackerClass)
            $m2 = mc.add("Another message")
            color = "rgba(255, 0, 0, 0)"
            mc.setTextColor color, "." + trackerClass
            expect($m1.css("color")).toEqual color
            expect($m2.css("color")).not.toEqual color
    # end of message recoloring operations