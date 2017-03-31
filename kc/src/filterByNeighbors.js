function filterByNeighbors(focusNodeID, nodes, labels, links, meta) {

    resetBaseLayer("transition");

    // draw related nodes
    d3.selectAll(nodes).call(nodesSelected)

    //from center: [[topLeftX, topLeftY(- is up)], [bottomRightX, bottomRightY(+ is down)]]
    rectangleCollide = d3.bboxCollide(function (d, i) {
        return bbox_array[i]
    }).strength(.1).iterations(1)

    simulation.force("collide", rectangleCollide.strength(1).iterations(15))
        .force("charge", null)
        .force("y", null)
        .force("x", null)
        .force("center", null)
        .velocityDecay(.8)
        .alphaDecay(.7)
        .alpha(1)
        .restart()

    // draw focus node //orange dashes on selected node
    d3.select("#id" + focusNodeID).transition()
        .style("opacity", 1)
        .style("stroke-dasharray", ("5,4"))
        .style("stroke", "orange")
        .style("stroke-width", "2px");

    // draw related links. selected links get thicker and darker
    d3.selectAll(links).call(linkSelected)

    // show the papers
    var metaPaperIDs = [];
    var metaPaperLabels = [];
    meta.papers.forEach(function (p) {
        metaPaperIDs.push("#id" + p);
        metaPaperLabels.push("#label" + p);
    });

    d3.selectAll(metaPaperIDs.toString())
        .transition()
        .style("opacity", 1);

    // draw related labels (inlcuding paper labels)
    var labelSelector = labels + "," + metaPaperLabels.toString();
    d3.selectAll(labelSelector).call(textSelected)

}