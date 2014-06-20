(function() {
  $(function() {
    return $(".component-actions button").on("click", function(event) {
      var target;
      event.preventDefault();
      target = "." + ($(this).text().toLowerCase().replace(/\s+/g, "-"));
      return $(target).addClass("active").siblings().removeClass("active");
    });
  });

}).call(this);
