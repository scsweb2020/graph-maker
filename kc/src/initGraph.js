plotControl = {
  circles: true,
  links: true,
  text: true,
  rects:false,
  pauseTime: 1000
};

var g = svg.append("g");
d3.queue() //if you want to load more than one file
.defer(d3.json, 'data/graph.json')
.await(function (error, graph) {
  var distFromRootArr = distFromRoot(graph); //lots hardcoded
  var scaleY = d3.scaleLinear().domain(d3.extent(distFromRootArr)).range([0, height]);

  bboxes = calcBBoxes(graph);
  bbox_array = bboxes.map(x => [[-x.width /2, -x.height * .6], [x.width /2, x.height *.6]]) // bbox collision in filterByNeighbors needs this

  radius = 40;
  // set the force-directed layout properties
  simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
      return d.id;
    }))
    .force("charge", d3.forceManyBody().strength(function (d) {
      // return -20;
      return -19 - Math.log(d.paperID.length) * 250; // give greater repulsion for larger nodes
    }))
    .force("y", d3.forceY((d, i) => {
      return scaleY(distFromRootArr[i])
    }).strength(1))
    .force("x", d3.forceX())
    .force("center", d3.forceCenter(width / 2, (height / 2) + 300))
    .velocityDecay(.6)
    .force("collide", d3.forceCollide(radius))


  if (error) throw error;
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
  .selectAll("rect")
  .data(graph.nodes)
  .enter().append("rect")
  .attr("stroke", "grey")
  .attr("fill", "none")
  .attr("width",(d,i) =>{ 
    return bbox_array[i][1][0]*2
    }) ////from center: [[topLeftX, topLeftY(- is up)], [bottomRightX, bottomRightY(+ is down)]]
  .attr("height",(d,i) =>{ return bbox_array[i][1][1]*2})
}

  // initialize and draw nodes
  if (plotControl.circles) {
  var node = g.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
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

  setTimeout(() => { //todo: fix position for unselected nodes and restart
    simulation.stop()
    d3.selectAll('circle').attr('---', (d, i) => {
      //fix position of all nodes 
      d.fx = d.x;
      d.fy = d.y;
    })
  }
    , plotControl.pauseTime) //how long until stoping the simulation


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
    text.attr("x", function (d) { return d.x; })
      .attr("y", function (d) { return d.y; });
    }

    if (plotControl.rects) {
    rects.attr("x", function(d,i) { return d.x - bboxes[i].width/2})
        .attr("y", function(d,i) {  return d.y -  bboxes[i].height/2});    
    }
  }

});