function filterByFocus(focusItemID, focusNodeID, nodes, labels, links) {

  resetBaseLayer("transition");

  // drawHighlightedNodes();
  d3.selectAll(masterContextNodes.toString()).call(nodesSelected);
  d3.selectAll(masterContextLabels.toString()).call(textSelected);
  d3.selectAll(masterContextLinks.toString()).call(linkSelected);

  // // // make sure the active papers remain visible
  // // var activePapers = [];
  // // var activePaperLabels = [];
  // // masterContextPaperIDs.forEach(function(p) {
  // //   activePapers.push("#id" + p);
  // //   activePaperLabels.push("#label" + p);
  // // })
  //
  // d3.selectAll(activePapers.toString())
  //   .transition()
  //   .style("opacity", 1)
  //
  // d3.selectAll(activePaperLabels.toString())
  //   .transition()
  //   .style("opacity", 1)
  //   .style("font-size", "16px")
  //   .text(function(d) {
  //       var string = d.name
  //       if (string.length > defaultTextLength) {
  //         return string.substring(0,defaultTextLength+2)+'...';
  //       } else {
  //         return string;
  //       }
  // });

  // highlight the focus node
  d3.select("#id" + focusNodeID).transition()
    .style("stroke-dasharray", ("5,4"))
    .style("stroke", "orange")
    .style("stroke-width", "7px");

  // highlight the focus item
  d3.select("#id" + focusItemID).transition()
    .style("stroke", "orange")
    .style("stroke-width", "3px")

  // highlight the item-related nodes
  d3.selectAll(nodes)
    .transition()
    .duration(toggleTime)
    .style("stroke", "orange")
    .style("stroke-width", "3px")
    .style("opacity", function(d) {
      if (masterContextNodes.indexOf("#id" + d.id) >= 0) {
        return 1
      } else {
        return 0.7 // if outside of the current context
      }
    })

  // highlight the item-related labels
  d3.selectAll(labels)
    .transition()
    .duration(toggleTime)
    .style("opacity", function(d) {
      if (masterContextNodes.indexOf("#id" + d.id) >= 0) {
        return 1
      } else {
        return 0.7 // if outside of the current context
      }
    })

  // highlight the item-related links
  d3.selectAll(links)
    .transition()
    .duration(toggleTime)
    .style("stroke", "orange")
    .style("stroke-width", "2px")

  //  simulation.alpha(1)
  //  .force('collide', d3.forceColliderestart() // doesn't seem to do anything
}
