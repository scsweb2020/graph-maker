function circleSizeDefault(d) {
      var lengthRad = defaultRadius + Math.log(d.paperID.length) * 10;
      return lengthRad
}

function circleInit(selection) {
    selection
    .attr("class", "circles")
    .attr('r', d => 8)
    .style('opacity', .2)
    .style("fill", function (d) {
      if (d.type == 'action')
        return '#247';
      else if (d.type == 'why-hard')
        return 'red';
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
