    function drawHighlightedNodes() {

      // highlight the nodes
      d3.selectAll(masterContextNodes.toString())
      .transition()
      .duration(toggleTime)
      .style("opacity", 1)
      .attr("r", function(d){
          if(d.type=='paper') {
            return topicRadius;
          } else {
            return 2+defaultRadius+Math.log(d.paperID.length)*10;
          }
       })

       // highlight the focus node
       if (focusNodeID != null) {
          d3.select("#id" + focusNodeID).transition().duration(toggleTime)
            .style("stroke-dasharray", ("5,4"))
            .style("stroke", "orange")
            .style("stroke-width", "3px");
       }

      d3.selectAll(masterContextLabels.toString())
        .transition()
        .duration(toggleTime)
        .attr("font-size", function(d) {
          return parseInt(8+Math.log(d.paperID.length)*10).toString() + 'px';
        })
        .text(function(d) {
          var string = d.name
          if (string.length > focusTextLength) {
            return string.substring(0,focusTextLength+2)+'...';
          } else {
            return string;
          }
        })
        .style("fill", function(d) {
          if (d.type === "paper") {
            return "#00BFFF"
          } else {
            return "black"
          }
        })

      d3.selectAll(masterContextLinks.toString())
        .transition()
        .duration(toggleTime)
        .style("opacity", 0.5)
        .style("stroke", "#aaa")

    }