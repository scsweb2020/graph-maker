
function clearFocus(focusNodeID) {

    $('.node-metadata').removeClass("selected");
    resetBaseLayer("transition");
    drawHighlightedNodes();

    // make sure the active papers remain visible
    var activePapers = [];
    var activePaperLabels = [];
    masterContextPaperIDs.forEach(function (p) {
        activePapers.push("#id" + p);
        activePaperLabels.push("#label" + p);
    })

    d3.selectAll(activePapers.toString())
        .transition()
        .style("opacity", 1)

    d3.selectAll(activePaperLabels.toString())
        .transition()
        .style("opacity", 1)
        .style("font-size", "16px")
        .text(function (d) {
            var string = d.name
            if (string.length > focusTextLength) {
                return string.substring(0, focusTextLength + 2) + '...';
            } else {
                return string;
            }
        })
        .style("fill", function (d) {
            if (d.type === "paper") {
                return "#00BFFF"
            } else {
                return "black"
            }
        })

    // highlight the focus node
    d3.select("#id" + focusNodeID).transition()
        .style("stroke-dasharray", ("5,4"))
        .style("stroke", "orange")
        .style("stroke-width", "3px");

    simulation.restart()
}