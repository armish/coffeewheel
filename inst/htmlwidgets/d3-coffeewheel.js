var initializeCoffeeWheel = function(data, el, width, height, partitionAttribute, mainTitle) {
	  var minSize = Math.min(width, height)-20;

    var div = d3.select(el);
    if(mainTitle.length > 0) {
      var mainTitleEl = div.append("h1")
        .attr("id", "main")
        .text(mainTitle);

      minSize -= 50;
    } 

    height = width = minSize;

    var radius = width / 2,
        x = d3.scale.linear().range([0, 2 * Math.PI]),
        y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),
        padding = 0,
        duration = 1000;

    var vis = div.append("svg")
        .attr("width", width + padding * 2)
        .attr("height", height + padding * 2)
        .append("g")
        .attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

    var partition = d3.layout.partition()
        .sort(null)
        .value(function(d) {
	        return d[partitionAttribute];
        });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

    function isParentOf(p, c) {
      if (p === c) return true;
      if (p.children) {
        return p.children.some(function(d) {
          return isParentOf(d, c);
        });
      }
      return false;
    }

    function colour(d) {
      if (d.colour == undefined && d.children) {
        // There is a maximum of two children!
        var colours = d.children.map(colour);
        var sum = { r: 0, g: 0, b: 0 };
        for(var i=0; i < colours.length; i++) {
          var aColor = d3.rgb(colours[i]);
          sum.r = Math.max(aColor.r, sum.r);
          sum.g = Math.max(aColor.g, sum.g);
          sum.b = Math.max(aColor.b, sum.b);
        }
        return d3.rgb(sum.r, sum.g, sum.b);
      }

      return d.colour || "#fff";
    }

    // Interpolate the scales!
    function arcTween(d) {
      var my = maxY(d),
          xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(y.domain(), [d.y, my]),
          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d) {
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
      };
    }

    function maxY(d) {
      return d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
    }

    // http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
    function brightness(rgb) {
      return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
    }

    (function(json) {
      var assignSizes = function(node) {
      	if(node.children == undefined || node.children.length < 1) {
      		return;
      	} else {
      		var numOfChilds = node.children.length
      		for(var ci=0; ci < numOfChilds; ci++) {
      			var childNode = node.children[ci];
      			childNode.value = 1.0/numOfChilds;
      			assignSizes(childNode);
      		}
      	}
      };

      for(var i=0; i < json.length; i++) {
      	assignSizes(json[i]);
      }

      var nodes = partition.nodes({children: json});

      var path = vis.selectAll("path").data(nodes);
      path.enter().append("path")
          .attr("id", function(d, i) { return "path-" + i; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", colour)
          .on("click", click);

      var text = vis.selectAll("text").data(nodes);
      var textEnter = text.enter().append("text")
          .style("fill-opacity", 1)
          .style("fill", function(d) {
            return brightness(d3.rgb(colour(d))) < 125 ? "#eee" : "#000";
          })
          .attr("text-anchor", function(d) {
            return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
          })
          .attr("dy", ".2em")
          .attr("transform", function(d) {
            var angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                rotate = angle;
            return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
          })
          .on("click", click);
      textEnter.append("tspan")
          .attr("x", 0)
          .text(function(d) { return d.depth ? d.name.split(" ")[0] : ""; });

      function click(d) {
        path.transition()
          .duration(duration)
          .attrTween("d", arcTween(d));

        // Somewhat of a hack as we rely on arcTween updating the scales.
        text.style("visibility", function(e) {
              return isParentOf(d, e) ? null : d3.select(this).style("visibility");
            })
          .transition()
            .duration(duration)
            .attrTween("text-anchor", function(d) {
              return function() {
                return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
              };
            })
            .attrTween("transform", function(d) {
              var multiline = (d.name || "").split(" ").length > 1;
              return function() {
                var angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                    rotate = angle + (multiline ? -.5 : 0);
                return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
              };
            })
            .style("fill-opacity", function(e) { return isParentOf(d, e) ? 1 : 1e-6; })
            .each("end", function(e) {
              d3.select(this).style("visibility", isParentOf(d, e) ? null : "hidden");
            });
      }
    })(data);

};