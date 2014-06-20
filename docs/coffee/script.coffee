$ ->
    $(".component-actions button").on "click", (event) ->
        event.preventDefault()
        target = ".#{$(this).text().toLowerCase().replace /\s+/g, "-"}"
        $(target).addClass("active").siblings().removeClass "active"