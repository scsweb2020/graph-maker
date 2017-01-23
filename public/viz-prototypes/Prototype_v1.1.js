function pageHeight() {
    var lReturn = window.innerHeight;
    if (typeof lReturn == "undefined") {
        if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientHeight != "undefined") {
            lReturn = document.documentElement.clientHeight;
        } else if (typeof document.body != "undefined") {
            lReturn = document.body.clientHeight;
        }
    }
    return lReturn;
}

// method to get page width
function pageWidth() {
    var lReturn = window.innerWidth;
    if (typeof lReturn == "undefined") {
        if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined") {
            lReturn = document.documentElement.clientWidth;
        } else if (typeof document.body != "undefined") {
            lReturn = document.body.clientWidth;
        }
    }
    return lReturn;
}

// Create Graph using d3.js force-directed layout
$(function () {
    // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
    var links = [
        {source: "A Contingency View of Transferring and Adapting Best Practices Within Online Communities", target: "Workers want to maximize earnings", type: "Kittur", type2:"2015"},
//        {source: "A Contingency View of Transferring and Adapting Best Practices Within Online Communities", target: "Improving Crowd Innovation with Expert Facilitation", type: "Kittur", type2:"2015"},
        {source: "Reduce fatigue", target: "Increase quality of work on crowdsourcing platforms", type: "Dow", type2:"2016"},
        {source: "Provide gold standard examples", target: "Increase quality of work on crowdsourcing platforms", type: "Dow", type2:"2016"},
        {source: "Collect good ideas from crowds", target: "Increase quality of work on crowdsourcing platforms", type: "Chan", type2:"2017"},
        {source: "Improving Crowd Innovation with Expert Facilitation", target: "Reduce fatigue", type: "Dow", type2:"2016"},
        {source: "Workers videorecord responses", target: "Increase quality of work on crowdsourcing platforms", type: "Forlizzi", type2:"2016"},
        {source: "A Contingency View of Transferring and Adapting Best Practices Within Online Communities", target: "Enable broad exploration", type: "Forlizzi", type2:"2016"},
        {source: "A Contingency View of Transferring and Adapting Best Practices Within Online Communities", target: "Enable deep exploration of ideas", type: "Dow", type2:"2016"},
//        {source: "Introduce short diversions that contain small amounts of entertainment", target: "Workers videorecord responses", type: "Dow",  type2:"2016"},
        {source: "Workers may not know how to clearly articulate needs", target: "Improving Crowd Innovation with Expert Facilitation", type: "Forlizzi",  type2:"2016"},
        {source: "A Contingency View of Transferring and Adapting Best Practices Within Online Communities", target: "Enable deep exploration of ideas", type: "Forlizzi",  type2:"2016"},
//        {source: "Reduce fatigue", target: "Workers may not know how to clearly articulate needs", type: "Chan",  type2:"2017"},
        {source: "Improve design work", target: "Novice workers may rely on the wrong signals", type: "Chan",  type2:"2017"},
        {source: "Collect good ideas from crowds", target: "In-person feedback", type: "Dow",  type2:"2016"},
        {source: "Enable broad exploration", target: "In-person feedback", type: "Forlizzi",  type2:"2016"},
//        {source: "Refresh workers' cognitive resources", target: "Enable broad exploration", type: "Chan", type2:"2016"},
        {source: "Workers videorecord responses", target: "Enable broad exploration of ideas", type: "Chan", type2:"2016"},
        {source: "Adapt the transferred practice to fit the local environment", target: "Enable broad exploration", type: "Chan", type2:"2016"},
        {source: "Enable broad exploration of ideas", target: "Adapt the transferred practice to fit the local environment", type: "Dow", type2:"2016"},
//        {source: "A Contingency View of Transferring and Adapting Best Practices Within Online Communities", target: "Provide gold standard examples", type: "Dow", type2:"2016"},
        {source: "Provide gold standard examples", target: "Enable broad exploration of ideas", type: "Forlizzi", type2:"2016"},
        {source: "Increase innovation", target: "Novice workers may rely on the wrong signals", type: "Dow", type2:"2016"},
        {source: "Increase innovation", target: "Novice workers may rely on the wrong signals", type: "Forlizzi", type2:"2016"},
        {source: "Refresh workers' cognitive resources", target: "Reduce fatigue", type: "Chan", type2:"2017"},
        {source: "Increase quality of work on crowdsourcing platforms", target: "Reduce fatigue", type: "Dow", type2:"2016"},
        {source: "Collect good ideas from crowds", target: "Obtain early-stage feedback from online crowds", type: "Forlizzi", type2:"2016"},
//        
    ];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target
        });
    });

    var w = pageWidth() - 10,
        h = pageHeight() - 10;

    var force = d3.layout.force()
                  .nodes(d3.values(nodes))
                  .links(links)
                  .size([w, h])
                  .linkDistance(60)
                  .charge(-300)
                  .on("tick", tick)
                  .start();
    
    
    
    

    var svg = d3.select(".graphContainer").append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                 .call(d3.behavior.zoom().on("zoom", redraw));
    

    var path = svg.append("svg:g")
                  .selectAll("path")
                  .data(force.links())
                  .enter().append("svg:path")
//                   
                  .attr("class", function (d) {
                      var c="";
                      
                      c="link " + d.type;
                      
                      c+= "link " + d.type2;
                      
                      return c;
                  });
    
//    svg.append('defs').append('marker')
//        .attr({'id':'arrowhead',
//               'viewBox':'-0 -5 10 10',
//               'refX':25,
//               'refY':0,
//               //'markerUnits':'strokeWidth',
//               'orient':'auto',
//               'markerWidth':10,
//               'markerHeight':10,
//               'xoverflow':'visible'})
//        .append('svg:path')
//            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
//            .attr('fill', '#ccc')
//            .attr('stroke','#ccc');

    var circle = svg.append("svg:g")
                    .selectAll("circle")
                    .data(force.nodes())
                    .enter().append("svg:circle")
                    .attr("r", 6)
                    .on("click", function (d){
                        //d3.select("#info").text(d.text);
                        console.log(d.text);
                    })
                    .call(force.drag);
    
    

    
    circle.on("dblclick.zoom", function(d) { d3.event.stopPropagation();
	var dcx = (window.innerWidth/2-d.x*zoom.scale());
	var dcy = (window.innerHeight/2-d.y*zoom.scale());
	zoom.translate([dcx,dcy]);
	 g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
	 });
    
    
//    var drag = force.drag()
//      .on("dragstart", function(d) {
//		d3.event.sourceEvent.stopPropagation();
//      });
//    

    var text = svg.append("svg:g")
                  .selectAll("g")
                  .data(force.nodes())
                  .enter().append("svg:g")
                  .attr("class", "nodeText");

    // A copy of the text with a thick white stroke for legibility.
    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .attr("class", "shadow")
        .text(function (d) {
            return d.name;
        });

    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function (d) {
            return d.name;
        });
    


    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y;
        });

        circle.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        text.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }
    
//    function display(d){
//        var arrayObj = d3.select(this).name;
//        console.log(arrayObj);
//        
//        d3.select("#info").text(d.text);
//    } 

   
    // Method to create the filter
    createFilter();
    createFilter2(); 
    
    
    ////zoom and pan
    
    function redraw() {
      svg.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
    }   

    // Method to create the filter, generate checkbox options on fly
    function createFilter() {
        //alert("createFilter");
        d3.select(".filterContainer").selectAll("div")
          .data(["Kittur", "Dow", "Chan", "Forlizzi"])
          .enter()  
          .append("div")
          .attr("class", "checkbox-container")
          
          .append("label")
          .each(function (d) {
                // create checkbox for each data
                d3.select(this).append("input")
                  .attr("type", "checkbox")
                  .attr("id", function (d) {
                      return "chk_" + d;
                   })
                  .attr("checked", true)
                  .on("click", function (d, i) {
                      // register on click event
                      var lVisibility = this.checked ? "visible" : "hidden";
                      filterGraph(d, lVisibility);
                   })
                d3.select(this).append("span")
                    .text(function (d) {
                        return d;
                    });
        });
        $("#sidebar").show();
    }
    
    
    function createFilter2() {
        //alert("createFilter2");
        d3.select(".filterContainer2").selectAll("div")
          .data(["2014", "2015", "2016", "2017"])
          .enter()  
          .append("div")
          .attr("class", "checkbox-container")
          
          .append("label")
          .each(function (d) {
                // create checkbox for each data
                d3.select(this).append("input")
                  .attr("type", "checkbox")
                  .attr("id", function (d) {
                      return "chk_" + d;
                   })
                  .attr("checked", true)
                  .on("click", function (d, i) {
                      // register on click event
                      var lVisibility = this.checked ? "visible" : "hidden";
                      filterGraph2(d, lVisibility);
                   })
                d3.select(this).append("span")
                    .text(function (d) {
                        return d;
                    });
        });
        $("#sidebar2").show();
        //alert("here");
    }
    

    // Method to filter graph
    function filterGraph(aType, aVisibility) {
       // alert("ok");
        // change the visibility of the connection link
        path.style("visibility", function (o) {
            var lOriginalVisibility = $(this).css("visibility");
            return o.type === aType ? aVisibility : lOriginalVisibility;
        });

        // change the visibility of the node
        // if all the links with that node are invisibile, the node should also be invisible
        // otherwise if any link related to that node is visibile, the node should be visible
        circle.style("visibility", function (o, i) {
            var lHideNode = true;
            path.each(function (d, i) {
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
        path.style("visibility", function (o) {
            var lOriginalVisibility = $(this).css("visibility");
            return o.type2 === aType ? aVisibility : lOriginalVisibility;
        });

        // change the visibility of the node
        // if all the links with that node are invisibile, the node should also be invisible
        // otherwise if any link related to that node is visibile, the node should be visible
        circle.style("visibility", function (o, i) {
            var lHideNode = true;
            path.each(function (d, i) {
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