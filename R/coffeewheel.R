#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
coffeewheel <- function(treeData, size="400px") {
  width <- height <- size;

  # create widget
  htmlwidgets::createWidget(
    name = 'coffeewheel',
    treeData,
    width = width,
    height = height,
    package = 'coffeewheel'
  );
}

#' Widget output function for use in Shiny
#'
#' @export
coffeewheelOutput <- function(outputId, width = '400px', height = '400px') {
  shinyWidgetOutput(outputId, 'coffeewheel', width, height, package = 'coffeewheel');
}

#' Widget render function for use in Shiny
#'
#' @export
renderCoffeewheel <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, coffeewheelOutput, env, quoted = TRUE);
}

#' Sample data for wheel initialization
#'
#' @export
sampleWheelData <- list(
  list(
    name="R",
    children=list(
      list(name="R_1", colour="#110000"),
      list(name="R_3", colour="#330000"),
      list(name="R_5", colour="#550000"),
      list(name="R_7", colour="#770000"),
      list(name="R_9", colour="#990000"),
      list(name="R_b", colour="#bb0000"),
      list(name="R_d", colour="#dd0000"),
      list(name="R_f", colour="#ff0000")
    )
  ),
  list(
    name="G",
    children=list(
      list(name="G_1", colour="#001100"),
      list(name="G_3", colour="#003300"),
      list(name="G_5", colour="#005500"),
      list(name="G_7", colour="#007700"),
      list(name="G_9", colour="#009900"),
      list(name="G_b", colour="#00bb00"),
      list(name="G_d", colour="#00dd00"),
      list(name="G_f", colour="#00ff00")
    )
  ),
  list(
    name="B",
    children=list(
      list(name="B_1", colour="#000011"),
      list(name="B_3", colour="#000033"),
      list(name="B_5", colour="#000055"),
      list(name="B_7", colour="#000077"),
      list(name="B_9", colour="#000099"),
      list(name="B_b", colour="#0000bb"),
      list(name="B_d", colour="#0000dd"),
      list(name="B_f", colour="#0000ff")
    )
  )
);
