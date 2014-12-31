#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
coffeewheel <- function(message, width = NULL, height = NULL) {

  # forward options using x
  x = list(
    message = message
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'coffeewheel',
    x,
    width = width,
    height = height,
    package = 'coffeewheel'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
coffeewheelOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'coffeewheel', width, height, package = 'coffeewheel')
}

#' Widget render function for use in Shiny
#'
#' @export
renderCoffeewheel <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, coffeewheelOutput, env, quoted = TRUE)
}
