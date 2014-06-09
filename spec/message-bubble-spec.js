(function() {
  describe("Message Bubble", function() {
    var $m, $m1, $m2, $m3, fixture, mc;
    mc = fixture = $m = $m1 = $m2 = $m3 = void 0;
    jasmine.getFixtures().fixturesPath = "spec/fixtures";
    beforeEach(function() {
      loadFixtures("message-bubble-fixture.html");
      mc = new MessageBubbleController();
      mc.remove();
    });
    afterEach(function() {
      if (mc) {
        mc.remove();
      }
      $m1 = $m2 = $m3 = null;
    });
    describe("Adding new messages", function() {
      describe("Basic addition operations", function() {
        it("Should add the new message object to its internally stored collection", function() {
          expect(mc.messages.length).toBe(0);
          $m = mc.add("New message");
          return expect(mc.messages.length).toBe(1);
        });
        it("Should return a jQuery object of the new message on success", function() {
          $m = mc.add("This is a new message");
          return expect($m instanceof jQuery).toBe(true);
        });
        return it("Should create a message that contains the same HTML as the passed string", function() {
          var mHTML;
          mHTML = "This is a new message with <strong>a number of</strong> <a href=\"www.lemondesign.co\">HTML tags</a>";
          $m = mc.add(mHTML);
          return expect($m.html()).toMatch(mHTML);
        });
      });
      describe("Message insertion positions", function() {
        describe("Should respect the after option (comment #1)", function() {
          it("Should add the new message directly after in the default container", function() {
            var $parentChildrenSet;
            mc = new MessageBubbleController({
              automateDateSections: false
            });
            $m1 = mc.add("A message");
            $m2 = mc.add("Another message", {
              after: $m1
            });
            $parentChildrenSet = $m1.parent().children();
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(1);
          });
          it("Should create a new message directly after in a user-passed container", function() {
            var $specialContainer;
            mc = new MessageBubbleController({
              automateDateSections: false
            });
            $specialContainer = $("<div class='special-container' />").appendTo("body");
            $m1 = mc.add("A message", {
              container: $specialContainer
            });
            $m2 = mc.add("Another message", {
              after: $m1
            });
            expect($m2.parent()).toHaveClass("special-container");
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(1);
          });
          it("Should create a new message directly after even when given a conflicting container", function() {
            var $anotherSpecialContainer, $specialContainer;
            mc = new MessageBubbleController({
              automateDateSections: false
            });
            $specialContainer = $("<div class='special-container' />").appendTo("body");
            $anotherSpecialContainer = $("<div class='another-special-container' />").appendTo("body");
            $m1 = mc.add("A message", {
              container: $specialContainer
            });
            $m2 = mc.add("Another message", {
              after: $m1,
              container: $anotherSpecialContainer
            });
            expect($m2.parent()).toHaveClass("special-container");
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(1);
          });
          it("Should create a new message directly after even when given a conflicting before option", function() {
            mc = new MessageBubbleController({
              automateDateSections: false
            });
            $m1 = mc.add("A message");
            $m2 = mc.add("Another message");
            $m3 = mc.add("A final message", {
              after: $m2,
              before: $m1
            });
            expect(getDifferenceBetweenIndecesInParentSet($m2, $m3)).toBe(1);
            return expect(getDifferenceBetweenIndecesInParentSet($m3, $m1)).not.toBe(1);
          });
          return it("Should create a new message directly after even when automatic date sectioning would prevent this", function() {
            expect(mc.automateDateSections).toBe(true);
            $m1 = mc.add("A new message");
            $m2 = mc.add("Another message", {
              after: $m1,
              artificialDate: (new Date()).getTime() + 10000000000
            });
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(1);
          });
        });
        describe("Should respect the before option (comment #2)", function() {
          it("Should add the new message directly before in the default container", function() {
            var $parentChildrenSet;
            mc = new MessageBubbleController({
              automateDateSections: false
            });
            $m1 = mc.add("A message");
            $m2 = mc.add("Another message", {
              before: $m1
            });
            $parentChildrenSet = $m1.parent().children();
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(-1);
          });
          it("Should create a new message directly before in a user-passed container", function() {
            var $specialContainer;
            mc = new MessageBubbleController({
              automateDateSections: false
            });
            $specialContainer = $("<div class='special-container' />").appendTo("body");
            $m1 = mc.add("A message", {
              container: $specialContainer
            });
            $m2 = mc.add("Another message", {
              before: $m1
            });
            expect($m2.parent()).toHaveClass("special-container");
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(-1);
          });
          it("Should create a new message directly before even when given a conflicting container", function() {
            var $anotherSpecialContainer, $specialContainer;
            mc = new MessageBubbleController({
              automateDateSections: false
            });
            $specialContainer = $("<div class='special-container' />").appendTo("body");
            $anotherSpecialContainer = $("<div class='another-special-container' />").appendTo("body");
            $m1 = mc.add("A message", {
              container: $specialContainer
            });
            $m2 = mc.add("Another message", {
              before: $m1,
              container: $anotherSpecialContainer
            });
            expect($m2.parent()).toHaveClass("special-container");
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(-1);
          });
          return it("Should create a new message directly before even when automatic date sectioning would prevent this", function() {
            expect(mc.automateDateSections).toBe(true);
            $m1 = mc.add("A new message");
            $m2 = mc.add("Another message", {
              before: $m1,
              artificialDate: (new Date()).getTime() + 10000000000
            });
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(-1);
          });
        });
        describe("Should respect the automateDateSections setting (comment #3)", function() {
          it("Should not create a new date section when the date is on the same calendar day", function() {
            var d, endOfD;
            d = new Date(0);
            endOfD = new Date(86400000 - 1);
            $m1 = mc.add("A message", {
              artificialDate: d
            });
            $m2 = mc.add("Another message", {
              artificialDate: endOfD
            });
            expect($m2.parent()).not.toHaveClass("message-bubble-date-section");
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(1);
          });
          it("Should create a new date section when the date is on the next calendar day or later", function() {
            var d, endOfD;
            d = new Date(0);
            endOfD = new Date(86400000 + 1);
            $m1 = mc.add("A message", {
              artificialDate: d
            });
            $m2 = mc.add("Another message", {
              artificialDate: endOfD
            });
            expect($m2.parent()).toHaveClass("message-bubble-date-section");
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m2.parent())).toBe(1);
          });
          it("Should create another new new date section following the first one when a third day, at least one calendar day after the second, is added", function() {
            var d1, d2, d3;
            d1 = new Date(0);
            d2 = new Date(86400000 + 1);
            d3 = new Date(2 * 86400000 + 1);
            $m1 = mc.add("A message", {
              artificialDate: d1
            });
            $m2 = mc.add("Another message", {
              artificialDate: d2
            });
            $m3 = mc.add("A final message", {
              artificialDate: d3
            });
            expect($m2.parent()).toHaveClass("message-bubble-date-section");
            expect($m3.parent()).toHaveClass("message-bubble-date-section");
            expect($m2.parent().children(".message-bubble").length).toBe(1);
            expect($m3.parent().children(".message-bubble").length).toBe(1);
            return expect(getDifferenceBetweenIndecesInParentSet($m2.parent(), $m3.parent())).toBe(1);
          });
          return it("Should not create another new new date section following the first one when a third day, less than one calendar day after the second, is added", function() {
            var d1, d2, d3;
            d1 = new Date(0);
            d2 = new Date(86400000 + 1);
            d3 = new Date(2 * 86400000 - 1);
            $m1 = mc.add("A message", {
              artificialDate: d1
            });
            $m2 = mc.add("Another message", {
              artificialDate: d2
            });
            $m3 = mc.add("A final message", {
              artificialDate: d3
            });
            expect($m2.parent()).toHaveClass("message-bubble-date-section");
            expect($m3.parent()).toHaveClass("message-bubble-date-section");
            expect($m2.parent().children(".message-bubble").length).toBe(2);
            return expect($m2.parent()).toEqual($m3.parent());
          });
        });
        describe("Should create a message in the user-passed container (comment #4-5)", function() {
          var $specialContainer;
          $specialContainer = void 0;
          beforeEach(function() {
            $specialContainer = $("<div class='special-container' />").appendTo("body");
            return mc = new MessageBubbleController({
              container: $specialContainer
            });
          });
          afterEach(function() {
            return $specialContainer.remove();
          });
          it("Should do this when the container is passed to the MessageBubbleController init", function() {
            $m = mc.add("A message");
            return expect($m.parent()).toHaveClass("special-container");
          });
          it("Should do this when the container is passed in the add options object", function() {
            mc = new MessageBubbleController();
            $m1 = mc.add("A message", {
              container: $specialContainer
            });
            expect($m1.parent()).toHaveClass("special-container");
            mc.remove();
            $m2 = mc.add("Another message");
            return expect($m2.parent()).not.toHaveClass("special-container");
          });
          return it("Should create the message in the function options container if this conflicts with the init options", function() {
            var $anotherSpecialContainer;
            $anotherSpecialContainer = $("<div class='another-special-container' />").appendTo("body");
            $m1 = mc.add("A message", {
              container: $anotherSpecialContainer
            });
            expect($m1.parent()).toHaveClass("another-special-container");
            mc.remove();
            $m2 = mc.add("Another message");
            return expect($m2.parent()).toHaveClass("special-container");
          });
        });
        describe("Should create message in appropriate default container (comment #6)", function() {
          it("Should create a new message at the end of the message bubble container when such a container exists", function() {
            var lastSelector;
            $m1 = mc.add("The first message");
            lastSelector = ".message-bubble-container .message-bubble:last";
            expect($m1).toEqual(lastSelector);
            $m2 = mc.add("The second message");
            expect($m2).toEqual(lastSelector);
            return expect($m1).not.toEqual(lastSelector);
          });
          return it("Should create a message in the `body` when no message container exists", function() {
            var lastSelector;
            $(".message-bubble-container").remove();
            mc = new MessageBubbleController();
            $m1 = mc.add("The first message");
            lastSelector = "body .message-bubble:last";
            expect($m1).toEqual(lastSelector);
            $m2 = mc.add("The second message");
            expect($m2).toEqual(lastSelector);
            expect($m1).not.toEqual(lastSelector);
            return $(".message-bubble-container").appendTo("body");
          });
        });
        return describe("Should respect the append option", function() {
          beforeEach(function() {
            return mc = new MessageBubbleController({
              automateDateSections: false
            });
          });
          it("Should add to the end of the container by default", function() {
            var $fullSet;
            $m1 = mc.add("A message");
            $m2 = mc.add("Another message");
            $fullSet = $m2.parent().children();
            expect($fullSet.index($m2)).toBe($fullSet.length - 1);
            expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(1);
            $m3 = mc.add("A final message", {
              append: true
            });
            $fullSet = $m3.parent().children();
            expect($fullSet.index($m3)).toBe($fullSet.length - 1);
            return expect(getDifferenceBetweenIndecesInParentSet($m2, $m3)).toBe(1);
          });
          it("Should add to the beginning of the container when append is false", function() {
            var $fullSet;
            $m1 = mc.add("A message");
            $m2 = mc.add("Another message", {
              append: false
            });
            $fullSet = $m2.parent().children();
            expect($fullSet.index($m2)).toBe(0);
            expect(getDifferenceBetweenIndecesInParentSet($m1, $m2)).toBe(-1);
            $m3 = mc.add("A final message");
            $fullSet = $m3.parent().children();
            expect($fullSet.index($m3)).toBe($fullSet.length - 1);
            return expect(getDifferenceBetweenIndecesInParentSet($m1, $m3)).toBe(1);
          });
          it("Should insert the message into a specified container if append is a jQuery object", function() {
            var $specialContainer;
            $specialContainer = $("<div class='special-container' />").appendTo("body");
            $m1 = mc.add("A message");
            $m2 = mc.add("Another message", {
              append: $specialContainer
            });
            expect($m1.closest(".special-container").length).toBe(0);
            expect($m2.closest(".special-container").length).toBeGreaterThan(0);
            expect($m2.parent().children().index($m2)).toBe(0);
            $m3 = mc.add("A final message", {
              append: $specialContainer
            });
            expect($m3.closest(".special-container").length).toBeGreaterThan(0);
            return expect($m3.parent().children().index($m3)).toBe(1);
          });
          return it("Should insert the message into a specified container if append is a string", function() {
            var $specialContainer;
            $specialContainer = $("<div class='special-container' />").appendTo("body");
            $m1 = mc.add("A message");
            $m2 = mc.add("Another message", {
              append: ".special-container"
            });
            expect($m1.closest(".special-container").length).toBe(0);
            expect($m2.closest(".special-container").length).toBeGreaterThan(0);
            expect($m2.parent().children().index($m2)).toBe(0);
            $m3 = mc.add("A final message", {
              append: ".special-container"
            });
            expect($m3.closest(".special-container").length).toBeGreaterThan(0);
            return expect($m3.parent().children().index($m3)).toBe(1);
          });
        });
      });
      describe("Setting reply status", function() {
        it("Should add the reply class when that option is passed", function() {
          $m1 = mc.add("A message", {
            reply: true
          });
          expect($m1).toHaveClass("reply");
          $m1 = mc.add("Another message");
          return expect($m1).not.toHaveClass("reply");
        });
        it("Should add the reply status (or not) appropriately with the inReplyTo option", function() {
          $m1 = mc.add("A message");
          $m2 = mc.add("Another message", {
            inReplyTo: $m1
          });
          $m3 = mc.add("A final message", {
            inReplyTo: $m2
          });
          expect($m1).not.toHaveClass("reply");
          expect($m2).toHaveClass("reply");
          return expect($m3).not.toHaveClass("reply");
        });
        return it("Should respect the inReplyTo option over the reply option", function() {
          $m1 = mc.add("A message");
          $m2 = mc.add("Another message", {
            inReplyTo: $m1,
            reply: false
          });
          $m3 = mc.add("A final message", {
            inReplyTo: $m2,
            reply: true
          });
          expect($m1).not.toHaveClass("reply");
          expect($m2).toHaveClass("reply");
          return expect($m3).not.toHaveClass("reply");
        });
      });
      return describe("Setting whale-tail existence", function() {
        return it("Should set the no-tail class based on the tail option", function() {
          $m1 = mc.add("A mesage");
          $m2 = mc.add("Another message", {
            tail: false
          });
          expect($m1).not.toHaveClass("no-tail");
          return expect($m2).toHaveClass("no-tail");
        });
      });
    });
    describe("Manipulating the typing indicator", function() {
      it("Should add a typing indicator to the end of the message container", function() {
        $m1 = mc.add("A message");
        $m2 = mc.add("Another message");
        expect($(".typing-indicator").length).toBe(0);
        mc.typing();
        expect($(".typing-indicator").length).toBe(1);
        return expect(getDifferenceBetweenIndecesInParentSet($m2, $(".typing-indicator"))).toBe(1);
      });
      it("Should not add a typing indicator if one already exists", function() {
        $m1 = mc.add("A message");
        $m2 = mc.add("Another message");
        mc.typing();
        expect($(".typing-indicator").length).toBe(1);
        mc.typing();
        return expect($(".typing-indicator").length).toBe(1);
      });
      return it("Should remove the typing indicator if it exists", function() {
        $m1 = mc.add("A message");
        mc.typing(false);
        expect($(".typing-indicator").length).toBe(0);
        mc.typing(true);
        expect($(".typing-indicator").length).toBe(1);
        mc.typing(false);
        return expect($(".typing-indicator").length).toBe(0);
      });
    });
    describe("Date section creation", function() {});
    describe("Removing messages", function() {
      it("Should remove the message object to its internally stored collection", function() {
        $m1 = mc.add("New message").addClass("TRACKER");
        expect(mc.messages.length).toBe(1);
        mc.remove(".TRACKER");
        return expect(mc.messages.length).toBe(0);
      });
      it("Should remove the message from the DOM", function() {
        $m1 = mc.add("New message").addClass("TRACKER");
        mc.remove(".TRACKER");
        return expect($m1.closest("body").length).toBe(0);
      });
      it("Should remove a proper subset of the elements matching the passed selector", function() {
        var $removed;
        $m1 = mc.add("A message").addClass("SPECIAL");
        $m2 = mc.add("Another message");
        $m3 = mc.add("A final message").addClass("SPECIAL");
        $removed = mc.remove(".SPECIAL");
        expect($removed.length).toBe(2);
        expect($removed.index($m1)).toBeGreaterThan(-1);
        expect($removed.index($m2)).toBeLessThan(0);
        expect($removed.index($m3)).toBeGreaterThan(-1);
        expect($m1.closest("body").length).toBe(0);
        expect($m2.closest("body").length).toBe(1);
        return expect($m3.closest("body").length).toBe(0);
      });
      it("Should remove a proper subset of the elements matching the passed message string", function() {
        var $removed, matchingMessage;
        matchingMessage = "A message that should match";
        $m1 = mc.add(matchingMessage);
        $m2 = mc.add(matchingMessage);
        $m3 = mc.add("A non-matching message");
        $removed = mc.remove(matchingMessage);
        expect($removed.length).toBe(2);
        expect($removed.index($m1)).toBeGreaterThan(-1);
        expect($removed.index($m2)).toBeGreaterThan(-1);
        expect($removed.index($m3)).toBeLessThan(0);
        expect($m1.closest("body").length).toBe(0);
        expect($m2.closest("body").length).toBe(0);
        return expect($m3.closest("body").length).toBe(1);
      });
      return it("Should remove the date section the message is in if no other messages exist in that section", function() {
        var $dateHeading, $dateSection, d1, d2;
        d1 = 0;
        d2 = 86400000 + 1;
        $m1 = mc.add("A message", {
          artificialDate: d1
        });
        $m2 = mc.add("Another message", {
          artificialDate: d2
        }).addClass("TRACKER");
        $dateSection = $m2.closest(".message-bubble-date-section");
        $dateHeading = $dateSection.children(".message-bubble-heading");
        expect($dateSection.length).toBeGreaterThan(0);
        expect($dateHeading.length).toBeGreaterThan(0);
        expect(getDifferenceBetweenIndecesInParentSet($m1, $dateSection)).toBe(1);
        mc.remove(".TRACKER");
        expect($m2.closest("body").length).toBe(0);
        expect($dateSection.closest("body").length).toBe(0);
        return expect($dateHeading.closest("body").length).toBe(0);
      });
    });
    describe("Message subset creations", function() {
      var classTracker;
      classTracker = "SPECIAL";
      beforeEach(function() {
        $m1 = mc.add("A message").addClass(classTracker);
        $m2 = mc.add("Another message");
        return $m3 = mc.add("A final message").addClass(classTracker);
      });
      it("Returns all messages when no selector is given", function() {
        var $set;
        $set = mc.getSubsetOfMessages();
        expect($set.length).toBe(3);
        expect($set.index($m1)).toBeGreaterThan(-1);
        expect($set.index($m2)).toBeGreaterThan(-1);
        return expect($set.index($m3)).toBeGreaterThan(-1);
      });
      return it("Returns a proper subset based on the past selector", function() {
        var $set;
        $set = mc.getSubsetOfMessages("." + classTracker);
        expect($set.length).toBe(2);
        expect($set.index($m1)).toBeGreaterThan(-1);
        expect($set.index($m2)).toBeLessThan(0);
        return expect($set.index($m3)).toBeGreaterThan(-1);
      });
    });
    return describe("Message recoloring operations", function() {
      it("Should set the background color to the user-specified one", function() {
        var color, trackerClass;
        trackerClass = "M-ONE";
        $m1 = mc.add("A message").addClass(trackerClass);
        $m2 = mc.add("Another message");
        color = "rgba(255, 0, 0, 0)";
        mc.setBackgroundColor(color, "." + trackerClass);
        expect($m1.css("background-color")).toEqual(color);
        return expect($m2.css("background-color")).not.toEqual(color);
      });
      return it("Should set the text color to the user-specified one", function() {
        var color, trackerClass;
        trackerClass = "M-ONE";
        $m1 = mc.add("A message").addClass(trackerClass);
        $m2 = mc.add("Another message");
        color = "rgba(255, 0, 0, 0)";
        mc.setTextColor(color, "." + trackerClass);
        expect($m1.css("color")).toEqual(color);
        return expect($m2.css("color")).not.toEqual(color);
      });
    });
  });

}).call(this);
