HTMLWidgets.widget({

  name: 'coffeewheel',

  type: 'output',

  initialize: function(el, width, height) {
    return {
      el: el,
      width: width,
      height: height
    }
  },

  renderValue: function(el, x, instance) {
    initializeCoffeeWheel(x, el, instance.width);
    this.x = x;
  },

  resize: function(el, width, height, instance) {
    el.innerHTML = "";
    initializeCoffeeWheel(this.x, el, width);
  }

});
