$( document ).ready(function() {
var toggleTime=300;
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("data/graph.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr("class", function(d){
              return d.paperID;
    })
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));


    var text =svg.append("g")
     .attr("class", "textNode")
    .data(graph.nodes)
    .enter().append("text")
    .text(function (d) { return d.name; })
    .attr("x", 12)
    .attr("dy", ".35em");
    
    
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});
    
//createFilter();
//createFilter2();     

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
    
     // Method to filter graph
    function filterGraph(aType, aVisibility) {
       // alert("ok");
        // change the visibility of the connection link
        link.style("visibility", function (o) {
            var lOriginalVisibility = $(this).css("visibility");
            return o.type === aType ? aVisibility : lOriginalVisibility;
        });

        // change the visibility of the node
        // if all the links with that node are invisibile, the node should also be invisible
        // otherwise if any link related to that node is visibile, the node should be visible
        node.style("visibility", function (o, i) {
            var lHideNode = true;
            link.each(function (d, i) {
                if (d.source === o || d.target === o) {
                    if ($(this).css("visibility") === "visible") {
                        lHideNode = false;
                        // we need show the text for this circle
                        d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "visible");
                        return "visible";
                    }
                }
            });
            if (lHideNode) {
                // we need hide the text for this circle 
                d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "hidden");
                return "hidden";
            }
        });
    }
    
    function filterGraph2(aType, aVisibility) {
         //alert("ok2");
        // change the visibility of the connection link
        link.style("visibility", function (o) {
            var lOriginalVisibility = $(this).css("visibility");
            return o.type2 === aType ? aVisibility : lOriginalVisibility;
        });

        // change the visibility of the node
        // if all the links with that node are invisibile, the node should also be invisible
        // otherwise if any link related to that node is visibile, the node should be visible
        node.style("visibility", function (o, i) {
            var lHideNode = true;
            link.each(function (d, i) {
                if (d.source === o || d.target === o) {
                    if ($(this).css("visibility") === "visible") {
                        lHideNode = false;
                        // we need show the text for this circle
                        d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "visible");
                        return "visible";
                    }
                }
            });
            if (lHideNode) {
                // we need hide the text for this circle 
                d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "hidden");
                return "hidden";
            }
        });
    }
    
    
});

function showPaper1(){
        alert("ok");
//         $(".6UGSWD8D").opacity(1);
//         $(".7V9JCFSV").opacity(0.1);
//         $(".AFWXF8CH").opacity(0.1);
//         $(".HTFNIQDD").opacity(0.1);
//        d3.selectAll('.6UGSWD8D').transition().duration(toggleTime).style("opacity", 1);
//        d3.selectAll('.7V9JCFSV').transition().duration(toggleTime).style("opacity", 0.1);
//        d3.selectAll('.AFWXF8CH').transition().duration(toggleTime).style("opacity", 0.1);
//        d3.selectAll('.HTFNIQDD').transition().duration(toggleTime).style("opacity", 0.1);
    
    d3.selectAll('.AFWXF8CH').remove();

}