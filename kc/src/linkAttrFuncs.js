function linkInit(selection){
    selection.classed("dataLinks", true)
    .style("stroke", function (d) {
      if (d.type == "paper-edge") {
        return "none";
      } else {
        return "#aaa";
      }
    })
    .attr("id", function (d) {
      return 'link' + d.id;
    })
    .attr("stroke-dasharray", function (d) {
      if (d.type == "analogy") {
        return "5,5";
      }
    })
    .attr("marker-end", function (d) {
      if (d.type == "analogy" || d.type == "paper-edge") {
        return null;
      } else {
        return "url(#arrow)";
      }
    })
    .attr("opacity", 0.25);
}

function linkSelected(selection){
    selection.transition()
        .duration(toggleTime)
        .style("opacity", 0.5)
        .style("stroke-width", "3px")
}

function linkReset(selection){
    selection.transition()
        .duration(toggleTime)
        .style("opacity", 0.25)
        .style("stroke-width", "1px")
        .style("stroke", function(d){
          if (d.type=="paper-edge") {
            return "none";
          } else {
            return "#aaa";
          }
        })
        .attr("marker-end", function(d) {
          if (d.type == "analogy" || d.type == "paper-edge") {
            return null;
          } else {
            return "url(#arrow)";
          }
        })
}