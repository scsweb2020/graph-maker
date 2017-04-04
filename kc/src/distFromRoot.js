function distFromRoot(graph) {
    var cyNodesFormat = graph.nodes.map(node => {
        return { data: { id: node.id } }
    });
    var cyEdgesFormat = graph.links.map(link => {
        return { data: { id: link.id, source: link.source, target: link.target } }
    });

    var cy = cytoscape({ elements: cyNodesFormat.concat(cyEdgesFormat) })
    var dijkstra = cy.elements().dijkstra('#7cc5b2db-fbe1-4d38-8450-8b65b2aa9094'); //root is 'Improve design work'

    var distFromRoot = cy.nodes().map(ele => {
        return dijkstra.distanceTo(ele) !== Infinity? dijkstra.distanceTo(ele): 10;
    });
    return distFromRoot;
}
