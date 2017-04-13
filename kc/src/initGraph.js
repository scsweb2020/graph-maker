plotControl = {
  circles: true,
  links: true,
  text: true,
  rects:true,
  divs: false,
  pauseTime: 25000
};

var g = svg.append("g");
// d3.csv("data/activations0.75.csv").row((data) => {
//   console.log('data',data)
// })


d3.queue() //if you want to load more than one file
.defer(d3.json, 'data/graph.json')
.defer(d3.json, "data/node_neighborhoods.json")
.defer(d3.json, "data/activations0.75.json")
.await(function (error, graph, node_neighborhoods, activations) {
  graph.nodes =  _.sortBy(graph.nodes, [function(node) { return node.id; }])
  console.log('sorted graph nodes === sorted activation nodes', _.isEqual(graph.nodes.map(x=>x.id), activations.nodeIDs) )

  var distFromRootArr = distFromRoot(graph); //lots hardcoded
  var scaleY = d3.scaleLinear().domain(d3.extent(distFromRootArr)).range([0, height]);
  console.log(activations)

  bboxes = calcBBoxes(graph);
  bboxes.forEach((box,i) => {
    graph.nodes[i].boxWidth = box.width;
    graph.nodes[i].boxHeight = box.height;
  })
  bbox_array = bboxes.map(x => [[-x.width /2, -x.height/2], [x.width /2, x.height/2]]) // bbox collision in filterByNeighbors needs this
  rectangleCollide = d3.bboxCollide(function (d,i) {
          return bbox_array[i]
        })
        .strength(.1)
        .iterations(1)

  radius = 30;
  // set the force-directed layout properties
  simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
      if (!d.id) debugger
      return d.id;
    })
      .strength(function(d) {
        if (d.type == "analogy") {
          return 0.2;
        } else {
          return 1;
        }
      }))
    .force("charge", d3.forceManyBody().strength(function (d) {
      if (!d.paperID.length) debugger
      // return -19 - Math.log(d.paperID.length) * 250 * 70; // give greater repulsion for larger nodes
      return -19 - Math.log(d.paperID.length) * 250 * 4; // give greater repulsion for larger nodes
      // return -100
    }))
    // .force("y", d3.forceY().strength(.5))
    // .force("y", d3.forceY((d, i) => {
    //         if (isNaN(scaleY(distFromRootArr[i]))) debugger
    //
    //   return scaleY(distFromRootArr[i])
    // }).strength(1))
    // .force("x", d3.forceX().strength(.8))
    .force("center", d3.forceCenter(width / 2, (height / 2) + 300))
    .velocityDecay(.6)
    .force("collide", rectangleCollide)


  if (error) throw error;

  // initialize and draw nodes
  if (plotControl.circles) {
  var node = g.append("g")
    .attr("class", "circles")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append('circle').call(circleInit)
  }
if (plotControl.links) {
  // initialize and draw edges
  var link = g.append("g")
    .attr("class", "links")
    .data(graph.nodes)
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .call(linkInit)
}

if (plotControl.rects) {
  var rects = g.append("g")
  .attr("class", "nodes")
  .selectAll("rect")
  .data(graph.nodes)
  .enter().append("rect")
  .call(nodeInit)

}



  svg.append("defs").append("marker") //
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

  // initialize + draw node labels ***************************************************************
  if (plotControl.text) {
  var text = g.append("g") //text init
    .attr("class", "labels")
    .selectAll("text")
    .data(graph.nodes)
    .enter().append("text")
    .call(textInit)
  }

  // apply force-directed layout
  simulation
    .nodes(graph.nodes)
    .on("tick", ticked); //

  simulation.force("link")
    .links(graph.links);

  // setTimeout(() => { //todo: fix position for unselected nodes and restart
  //   simulation.stop()
  //   d3.selectAll('circle').attr('---', (d, i) => {
  //     //fix position of all nodes
  //     d.fx = d.x;
  //     d.fy = d.y;
  //   })
  // }
  //   , plotControl.pauseTime) //how long until stoping the simulation


  function ticked() {
    if (plotControl.links) {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });
    }

    if (plotControl.circles) {
    node
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });
    }

    if (plotControl.text) {
    text.attr("x", 0 )
        .attr("y", 0 )
        .attr('transform', (d,i) => {
          var moveX = (d.x-(d.boxWidth/2)) + d.boxWidth*.01;
          var moveY = (d.y-(d.boxHeight/2));

          return "translate(" + moveX + ',' + moveY + ")"
        })
    }

    if (plotControl.rects) {
    rects.attr("x", function(d,i) {
      return d.x - bboxes[i].width/2;})
        .attr("y", function(d,i) {  return d.y -  bboxes[i].height/2});
    }

    // if (plotControl.divs){
    // divs.attr("x", function (d) { return d.x; })
    //   .attr("y", function (d) { return d.y; });
    // }

  }

});
