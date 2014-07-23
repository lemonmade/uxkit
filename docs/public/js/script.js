(function() {
  var PageHeader;

  $(function() {
    var header, playgroundCommand, playgroundCommands;
    header = new PageHeader;
    $(".component-actions button").on("click", function(event) {
      var $this, target, text;
      event.preventDefault();
      $this = $(this);
      text = $this.find(".component-action-label").text().toLowerCase();
      target = "." + ((function() {
        switch (text) {
          case "source":
            return "source-code";
          case "api":
            return "api";
          case "requires":
            return "requirements";
        }
      })());
      console.log($(target));
      $this.addClass("active").siblings().removeClass("active");
      return $(target).addClass("active").siblings().removeClass("active");
    });
    $(".sidebar-toggle").on("click", function(event) {
      var $mainContent, sidebarSize, translation;
      event.preventDefault();
      sidebarSize = $(".sidebar").outerWidth();
      sidebarSize = "" + (sidebarSize / 16) + "em";
      $mainContent = $(".main-content");
      console.log($mainContent.css("transform"));
      if ($mainContent.css("transform") === "none") {
        translation = "translateX(" + sidebarSize + ")";
        $mainContent.css("transform", translation);
        if (header.smallHeaderActive) {
          return header.translate(translation);
        }
      } else {
        $mainContent.css("transform", "");
        if (header.smallHeaderActive) {
          return header.translate("");
        }
      }
    });
    $(document).on("click", ".api-method .section-hide", function() {
      var $apiClass, $apiClassButton, $apiMethod, $this, showing;
      $this = $(this);
      $apiMethod = $this.closest(".api-method");
      $apiClass = $apiMethod.closest(".api-class");
      $apiClassButton = $apiClass.find("h3 .section-hide");
      showing = $apiMethod.hasClass("hidden");
      if ((!$apiMethod.hasClass("hidden")) && $apiMethod.siblings(".api-method:not(.hidden)").length === 0) {
        $apiClass.addClass("hidden");
        $apiClassButton.text("Show");
      } else {
        $apiClass.removeClass("hidden");
        $apiClassButton.text("Hide");
      }
      $apiMethod.toggleClass("hidden");
      return $this.text(showing ? "Hide" : "Show");
    });
    $(document).on("click", ".api-class h3 .section-hide", function() {
      var $apiClass;
      $apiClass = $(this).closest(".api-class");
      if ($apiClass.hasClass("hidden")) {
        return $apiClass.find(".api-method.hidden .section-hide").trigger("click");
      } else {
        return $apiClass.find(".api-method:not(.hidden) .section-hide").trigger("click");
      }
    });
    $(document).on("click", ".example-css-toggle", function() {
      var $this;
      $this = $(this);
      $this.text($this.text().match(/without/) ? "(try it with CSS)" : "(try it without CSS)");
      return $(".example-component").toggleClass("no-css");
    });
    $(document).on("scroll", header.checkForSmallActivation.bind(header));
    playgroundCommands = [];
    playgroundCommand = 0;
    $(".playground-input").on("keydown", function(event) {
      var $output, $this, code, command, commands, e, result;
      code = event.keyCode ? event.keyCode : event.which;
      $output = $(".playground-output code");
      $this = $(this);
      switch (code) {
        case 13:
          event.preventDefault();
          command = $this.val();
          try {
            result = eval(command);
          } catch (_error) {
            e = _error;
            result = "error: " + e.message;
          }
          $output.append("<div>=> " + result + "</div>");
          $this.val("");
          playgroundCommands.push(command);
          return playgroundCommand = 0;
        case 38:
          commands = playgroundCommands.length;
          if (playgroundCommands[commands - playgroundCommand - 1] != null) {
            playgroundCommand += 1;
            command = playgroundCommands[commands - playgroundCommand];
            $this.val(command);
            return setTimeout(function() {
              return $this[0].setSelectionRange(command.length, command.length);
            }, 0);
          }
          break;
        case 40:
          commands = playgroundCommands.length;
          if (playgroundCommands[commands - playgroundCommand + 1] != null) {
            playgroundCommand -= 1;
            command = playgroundCommands[commands - playgroundCommand];
            $this.val(command);
            return setTimeout(function() {
              return $this[0].setSelectionRange(command.length, command.length);
            }, 0);
          } else if (playgroundCommand === 1) {
            playgroundCommand = 0;
            return $this.val("");
          }
      }
    });
    $(".example-commands button").on("click", function() {
      var $input;
      $input = $(".playground-input");
      $input.val($(this).data("command"));
      return $input.focus();
    });
    return $(".resizable-handle").on("mousedown", function(e) {
      var $resizable, initialWidth, startX;
      startX = e.pageX;
      $resizable = $(this).closest(".resizable");
      initialWidth = $resizable.outerWidth();
      e.preventDefault();
      $resizable.parent().on("mousemove", function(e) {
        console.log(startX, e.pageX);
        e.preventDefault();
        return $resizable.css("width", initialWidth + (e.pageX - startX) * 2);
      });
      return $resizable.parent().on("mouseup", function(e) {
        console.log("UP");
        return $resizable.parent().off("mousemove");
      });
    });
  });

  PageHeader = (function() {
    function PageHeader() {
      var $header, $smallHeader;
      $header = $(".page-header");
      $smallHeader = $header.clone().addClass("small").appendTo("body");
      this.header = $header;
      this.smallHeader = $smallHeader;
      this.headerHeight = $header.outerHeight();
      this.smallHeaderActive = false;
    }

    PageHeader.prototype.translate = function(translation) {
      return this.smallHeader.css("transform", translation);
    };

    PageHeader.prototype.activateSmall = function() {
      if (!this.smallHeaderActive) {
        this.smallHeader.addClass("active");
        return this.smallHeaderActive = true;
      }
    };

    PageHeader.prototype.deactivateSmall = function() {
      if (this.smallHeaderActive) {
        this.smallHeader.removeClass("active");
        return this.smallHeaderActive = false;
      }
    };

    PageHeader.prototype.checkForSmallActivation = function() {
      var pos;
      pos = window.scrollY;
      if (pos > this.headerHeight && !this.smallHeaderActive) {
        return this.activateSmall();
      } else if (pos < this.headerHeight && this.smallHeaderActive) {
        return this.deactivateSmall();
      }
    };

    return PageHeader;

  })();

}).call(this);
