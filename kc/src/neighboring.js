function neighboring(d) {

    lastClickedNodeID = d.id;

    var nodeID = d.id;
    focusNodeID = d.id;

    // grab related nodes
    var listOfNodes;
    d3.json("data/node_neighborhoods.json", function (d) {
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
        console.log(meta)
        // update the viz
        filterByNeighbors(focusNodeID, stringOfNodes, stringOfLabels, stringOfLinks, meta);

        // update author details
        authorDetails(meta['authors']);

    });

}