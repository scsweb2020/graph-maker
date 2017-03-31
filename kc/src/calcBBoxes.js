  function calcBBoxes(graph){
    bboxes = []; //going to fill this with text bounding boxes as d3 puts titles on the nodes
    graph.nodes.map(function (node) {
        var fontSize = parseInt(6 + Math.log(node.paperID.length) * 10) + 'px';
        var textSizeTest = svg.append("text").attr('font-size', fontSize).attr('class', 'size-check')
        .text(function (d) {
            var string = node.name
            if (node.paperID.length >= 2) {
            if (string.length > defaultTextLength) {
                return string.substring(0, defaultTextLength + 2) + '...';
            } else {
                return string
            }
            } else {
            return string;
            }
        })
        .attr('transform', function (d) {
            bboxes.push(this.getBBox())

            return "translate(0,0)"
        })
        textSizeTest.remove()
    })
    return bboxes;
  }
