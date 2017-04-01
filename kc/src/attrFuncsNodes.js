function nodeSizeDefault(d) {
      var lengthRad = defaultRadius + Math.log(d.paperID.length) * 50;
      return lengthRad < 30 ? 30 : lengthRad;
}

function nodeInit(selection) {
    selection
    .attr("r", d => nodeSizeDefault(d)
    // function (d) {
    //   if (d.type == 'action' || d.type == 'why-hard')
    //     // return defaultRadius;
    //     return defaultRadius + Math.log(d.paperID.length) * 10;
    //   if (d.type == 'paper')
    //     return topicRadius;
    // }
    )
    .attr("class", "dataNodes")
    .attr('id', function (d) { return 'id' + d.id; })
    .style('opacity', .8
    
    //  function (d) {
    //   if (d.paperID.length >= 2) {
    //     return 0.5 + d.paperID.length / 10;
    //   } else if (d.type === "paper") {
    //     return 0;
    //   } else {
    //     return 0.25;
    //   }
  // }
  )
    .style("fill", function (d) {
      if (d.type == 'action')
        return '#247';
      else if (d.type == 'why-hard')
        return 'red';
      else if (d.type == 'paper')
        return '#00BFFF';
    })
    // .on("mouseover", function (d) { // for tooltips
    //   div.transition()
    //     .duration(200)
    //     .style("opacity", .9);
    //   div.html(d.name)
    //     .style("left", (d3.event.pageX) + "px")
    //     .style("top", (d3.event.pageY - 28) + "px");
    // })
    // .on("mouseout", function (d) {
    //   div.transition()
    //     .duration(500)
    //     .style("opacity", 0);
    // })
    .on("click", function (d) {
      if (d.type == "paper") {
        var focusItemID = d.id;
        if (focusItemID === lastClickedMetadataID && isFocusing) {
          isFocusing = false;
          clearFocus(focusNodeID);
        } else {
          isFocusing = true;
          focus(focusNodeID, focusItemID, "paper"); //click
          $('.node-metadata').removeClass("selected");
          // $(this).addClass("selected");
          lastClickedMetadataID = focusItemID;
        }
      } else {
        neighboring(d);
      }
    })
}

function nodesSelected(selection){
            selection
            .transition()
            .duration(toggleTime)
            .attr('r', d => nodeSizeDefault(d)) 
            .attr('stroke', 'black')
        //     .attr("r", function (d) { //click radius change
        //     if (d.type == 'paper') {
        //         return topicRadius;
        //     } else {
        //         return 2 + defaultRadius + Math.log(d.paperID.length) * 10;
        //     }
        // })
        .attr('---', (d, i) => {
            //unfix these nodes so the are re-simulated
            d.fx = null;
            d.fy = null;
        })
}

function nodeReset(selection, purpose){
  selection
    .transition()
        .duration(toggleTime)
        .style("opacity", .6
        
        // function(d) {
        //   if (purpose === "transition") {
        //     if (d.type === "paper") {
        //       return 0;
        //     } else {
        //       return 0.1;
        //     }
        //   } else {
        //     if (d.paperID.length >= 2) {
        //       return 0.5+d.paperID.length/10;
        //     } else if (d.type === "paper") {
        //       return 0;
        //     } else {
        //       return 0.25;
        //     }
        //   }
        // }
        )
        .attr('r', d => nodeSizeDefault(d)) 
        // .attr("r", function(d){ 
        //    if(d.type=='action' || d.type=='why-hard')
        //    return defaultRadius+Math.log(d.paperID.length)*10;
        //    if(d.type=='paper')
        //        return topicRadius;
        // })
        .style("stroke", "none")
}
