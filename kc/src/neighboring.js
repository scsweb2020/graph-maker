function neighboring(d) { //only function called on nodeClick

    lastClickedNodeID = d.id;
    var nodeID = d.id;
    focusNodeID = d.id;

    // grab related nodes
    var listOfNodes;
    // d = node_neighborhoods;

    if (['action', 'why-hard'].indexOf(d.type) >= 0) {

      d3.json("data/node_neighborhoods.json", function (d) { //todo: don't load on every click
          if (document.getElementById("drop").value == '1') {
              listOfNodes = d[nodeID][1];
          }

          if (document.getElementById("drop").value == '2') {
              listOfNodes = d[nodeID][1];
              listOfNodes = listOfNodes.concat(d[nodeID][2]);
          }
          if (document.getElementById("drop").value == '3') {
              listOfNodes = d[nodeID][1];
              listOfNodes = listOfNodes.concat(d[nodeID][2]);
              listOfNodes = listOfNodes.concat(d[nodeID][3]);
          }

          listOfNodes = listOfNodes.concat(nodeID);

          listOfNodeIds = [];
          for (var i = 0; i < listOfNodes.length; i++) {
              //  listOfNodes[i]= '#id' + listOfNodes[i];
              listOfNodeIds.push('#id' + listOfNodes[i]);
          }
          var stringOfNodes = listOfNodeIds.toString();

          var listOfLabels = listOfNodeIds;
          listOfLabels = listOfLabels.concat('#id' + nodeID);
          for (i = 0; i < listOfLabels.length; i++) {
              listOfLabels[i] = listOfLabels[i].replace('#id', '#label');
          }
          var stringOfLabels = listOfLabels.toString();

          var listOfLinks = filterLinks(listOfNodes);
          for (i = 0; i < listOfLinks.length; i++) {
              listOfLinks[i] = '#link' + listOfLinks[i];
          }
          var stringOfLinks = listOfLinks.toString();

          masterContextNodes = listOfNodeIds;
          masterContextLabels = listOfLabels;
          masterContextLinks = listOfLinks;

          // get paper details
          var meta = paperDetails(listOfNodes);
        //   console.log('to filter by neighbo',focusNodeID, stringOfNodes, stringOfLabels, stringOfLinks, meta )
          // update the viz

          filterByNeighbors(focusNodeID, stringOfNodes, stringOfLabels, stringOfLinks, meta);

          // update author details
          authorDetails(meta['authors']);

        });

      } else if (d.type == "paper") {

        listOfNodes = papers_to_nodes[nodeID]

        listOfNodes = listOfNodes.concat(nodeID);

        listOfNodeIds = [];
        for (var i = 0; i < listOfNodes.length; i++) {
            //  listOfNodes[i]= '#id' + listOfNodes[i];
            listOfNodeIds.push('#id' + listOfNodes[i]);
        }
        var stringOfNodes = listOfNodeIds.toString();

        var listOfLabels = listOfNodeIds;
        listOfLabels = listOfLabels.concat('#id' + nodeID);
        for (i = 0; i < listOfLabels.length; i++) {
            listOfLabels[i] = listOfLabels[i].replace('#id', '#label');
        }
        var stringOfLabels = listOfLabels.toString();

        var listOfLinks = filterLinks(listOfNodes);
        for (i = 0; i < listOfLinks.length; i++) {
            listOfLinks[i] = '#link' + listOfLinks[i];
        }
        var stringOfLinks = listOfLinks.toString();

        masterContextNodes = listOfNodeIds;
        masterContextLabels = listOfLabels;
        masterContextLinks = listOfLinks;

        // get paper details
        var meta = paperDetails(listOfNodes);
        // console.log('to filter by neighbo',focusNodeID, stringOfNodes, stringOfLabels, stringOfLinks, meta )
        // update the viz

        filterByNeighbors(focusNodeID, stringOfNodes, stringOfLabels, stringOfLinks, meta);

        // update author details
        authorDetails(meta['authors']);

      } else {
        // focus node is author

        listOfNodes = authors_to_nodes[nodeID]

        listOfNodes = listOfNodes.concat(nodeID);

        listOfNodeIds = [];
        for (var i = 0; i < listOfNodes.length; i++) {
            //  listOfNodes[i]= '#id' + listOfNodes[i];
            listOfNodeIds.push('#id' + listOfNodes[i]);
        }
        var stringOfNodes = listOfNodeIds.toString();

        var listOfLabels = listOfNodeIds;
        listOfLabels = listOfLabels.concat('#id' + nodeID);
        for (i = 0; i < listOfLabels.length; i++) {
            listOfLabels[i] = listOfLabels[i].replace('#id', '#label');
        }
        var stringOfLabels = listOfLabels.toString();

        var listOfLinks = filterLinks(listOfNodes);
        for (i = 0; i < listOfLinks.length; i++) {
            listOfLinks[i] = '#link' + listOfLinks[i];
        }
        var stringOfLinks = listOfLinks.toString();

        masterContextNodes = listOfNodeIds;
        masterContextLabels = listOfLabels;
        masterContextLinks = listOfLinks;

        // get paper details
        var meta = paperDetails(listOfNodes);
        // console.log('to filter by neighbo',focusNodeID, stringOfNodes, stringOfLabels, stringOfLinks, meta )
        // update the viz

        filterByNeighbors(focusNodeID, stringOfNodes, stringOfLabels, stringOfLinks, meta);

        // update author details
        authorDetails(meta['authors']);

      }
        // debugger
    // });

}

function filterByNeighbors(focusNodeID, nodes, labels, links, meta) {

    resetBaseLayer("transition");

    // show the papers
    var metaPaperIDs = [];
    var metaPaperLabels = [];
    meta.papers.forEach(function (p) {
        metaPaperIDs.push("#id" + p);
        metaPaperLabels.push("#label" + p);
    });
    masterContextNodes = masterContextNodes.concat(metaPaperIDs);
    masterContextLabels = masterContextLabels.concat(metaPaperLabels);

    // show the authors
    var metaAuthorIDs = [];
    var metaAuthorLabels = [];
    meta.authors.forEach(function (a) {
        metaAuthorIDs.push("#id" + a.id);
        metaAuthorLabels.push("#label" + a.id);
    });
    masterContextNodes = masterContextNodes.concat(metaAuthorIDs);
    masterContextLabels = masterContextLabels.concat(metaAuthorLabels);

    // show links between authors and papers
    var authorsAndPapers = [];
    metaPaperIDs.forEach(function(p) {
      authorsAndPapers.push(p.replace("#id", ""));
    });
    metaAuthorIDs.forEach(function(a) {
      authorsAndPapers.push(a.replace("#id", ""));
    });
    authorPaperLinks = filterLinks(authorsAndPapers);
    for (i = 0; i < authorPaperLinks.length; i++) {
        authorPaperLinks[i] = '#link' + authorPaperLinks[i];
    }
    masterContextLinks = masterContextLinks.concat(authorPaperLinks);

    // draw related nodes
    var nodeSelector = nodes + "," + metaPaperIDs.toString() + metaAuthorIDs.toString();
    d3.selectAll(nodeSelector).call(nodesSelected)

    // draw focus node //orange dashes on selected node
    d3.select("#id" + focusNodeID).transition()
        .style("opacity", 1)
        // .style("stroke-dasharray", ("5,4"))
        .style("stroke", "orange")
        .style("stroke-width", "10px");

    // draw related links. selected links get thicker and darker
    var linkSelector = links + "," + authorPaperLinks.toString();
    d3.selectAll(linkSelector).call(linkSelected)



    // d3.selectAll(metaPaperIDs.toString())
    //     .transition()
    //     .style("opacity", 1);

    // draw related labels (inlcuding paper labels)
    var labelSelector = labels + "," + metaPaperLabels.toString() + metaAuthorLabels.toString();
    d3.selectAll(labelSelector).call(textSelected)
}

function resetBaseLayer(purpose) {
    // console.log("calling reset base layer");
    d3.selectAll(".dataNodes").call(nodeInit)
    d3.selectAll(".dataLabels").call(textInit)
    d3.selectAll(".dataLinks").style('opacity', .2).style('stroke-width', 1)
}
