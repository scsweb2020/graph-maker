  function calcBBoxes(graph){
    bboxes = []; //going to fill this with text bounding boxes as d3 puts titles on the nodes
        var textSizeTest = 
        svg.append("g").selectAll(".bbox")
        .data(graph.nodes)
        .enter()
        .append("text").attr('class','bbox')
        .call(textInit)
        .attr('transform', function (d) {
            var box = this.getBBox();
            box.width = box.width*1.1;
            box.height = box.height + 2;
            bboxes.push(box)
            return "translate(0,0)"
        })
        textSizeTest.remove()
        console.log(bboxes)
    return bboxes;
  }
