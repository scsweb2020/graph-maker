   function filterLinks(nodes) {
      var edgeIDs = [];
      edges.forEach(function(edge) {
        if (nodes.indexOf(edge.source) >= 0 && nodes.indexOf(edge.target) >= 0) {
          edgeIDs.push(edge.id);
        }
      });
      return edgeIDs;
    }