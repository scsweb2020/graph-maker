function circleSizeDefault(d) {
      var lengthRad = defaultRadius + Math.log(d.paperID.length) * 10;
      return lengthRad
}

function circleInit(selection) {
    selection
    .attr("class", "circles")
    .attr('r', d => 8)
    .style('opacity', .5)
    .style("fill", function (d) {
      if (d.type == 'author')
        return '#d9534f';
      else if (d.type == 'paper')
        return '#5cb85c';
      else {
        // return '#247';
        // return '#8a5757';
        return '#5bc0de';
      }
    })
    .on("click", function (d) {
        neighboring(d);
    })
    .on("mouseover", function (d) { // for tooltips
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d.name)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })

}

// function circleSelected(selection){
//             selection
//             .transition()
//             .duration(toggleTime)
//             .attr('opacity', 0)
// }

// function circleReset(selection, purpose){
//   selection
//     .transition()
//         .duration(toggleTime)
//         .style("opacity", .25)
//         // .attr('r', d => nodeSizeDefault(d))
//         .style("stroke", "none")
// }
