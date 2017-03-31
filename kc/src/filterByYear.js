function filterByYear(min, max) {
    d3.json("data/graph.json", function (d) {

        var listOfFilteredNodeIDs = [];
        var listOfNodes = d.nodes;


        for (i = 0; i < listOfNodes.length; i++) {

            for (j = 0; j < (listOfNodes[i].years).length; j++) {
                if (listOfNodes[i].years[j] <= max && listOfNodes[i].years[j] >= min) {
                    listOfFilteredNodeIDs.push(listOfNodes[i].id);

                }
            }

        }

        for (i = 0; i < listOfFilteredNodeIDs.length; i++) {
            listOfFilteredNodeIDs[i] = '#id' + listOfFilteredNodeIDs[i];
        }

        var stringOfNodes = listOfFilteredNodeIDs.toString();

        nodesByYearFilter = listOfFilteredNodeIDs;

        finalFilter();
    });

}