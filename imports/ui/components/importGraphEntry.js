overlapID = function(targetID, destinationElements) {
  let result = false;
  destinationElements.forEach(function(d) {
    if (targetID === d.data.id) {
      console.log(targetID);
      console.log(d.data.id);
      result = true;
    }
  })
  return result;
}

propagateNodeIDchange = function(oldID, newID, edges) {
  console.log("Propagating node ID changes");
  let modifiedEdges = [];
  edges.forEach(function(e) {
    if (e.data.source === oldID) {
      console.log("Old edge: " + JSON.stringify(e));
      e.data.source = newID;
      console.log("New edge: " + JSON.stringify(e));
    } else if (e.data.target === newID) {
      console.log("Old edge: " + JSON.stringify(e));
      e.data.target = newID;
      console.log("New edge: " + JSON.stringify(e));
    } else {
      //
    }
    modifiedEdges.push(e);
  });
  return modifiedEdges;
}

importElements = function(sourceGraph) {
    let destinationGraph = Session.get("currentGraph").graphData;
    let destNodes = destinationGraph.elements.nodes;
    let destEdges = destinationGraph.elements.edges;
    let srcEdges = sourceGraph.graphData.elements.edges;
    let newNodes = [];

    if (!destNodes) {
      newNodes = sourceGraph.graphData.elements.nodes;
    } else {
      // first make sure nodes don't overlap
      // propagate changes
      sourceGraph.graphData.elements.nodes.forEach(function(n) {
        let copy = n;
        if (overlapID(n.data.id, destNodes)) {
          console.log("Overlapping node ID from source graph! Fixing...");
          let oldID = n.data.id;
          let newID = Random.hexString(20).toLowerCase();
          while (overlapID(newID, newNodes)) {
            newID = Random.hexString(20).toLowerCase();
          }
          copy.data.id = newID;
          srcEdges = propagateNodeIDchange(oldID, newID, srcEdges);
        }
        newNodes.push(copy);
      });
    }

    let newEdges = [];
    if (!destEdges) {
      newEdges = sourceGraph.graphData.elements.edges;
    } else {
      // then make sure edge ids don't overlap
      srcEdges.forEach(function(e) {
        let copy = e;
        if (overlapID(e.data.id, destEdges)) {
          console.log("Overlapping edge ID from source graph! Fixing...");
          let oldID = e.data.id;
          let newID = Random.hexString(20).toLowerCase();
          while (overlapID(newID, newEdges)) {
            newID = Random.hexString(20).toLowerCase();
          }
          copy.data.id = newID;
        }
        newEdges.push(copy);
      });
    }
    console.log({'newNodes': newNodes, 'newEdges': newEdges});
    newNodes.forEach(function(n) {
      ur.do("add", n);
    });
    newEdges.forEach(function(e) {
      ur.do("add", e);
    });
    // autosave
    if (Session.get("currentGraph").metaData.hasOwnProperty("componentPapers")) {
      let componentPapers = Session.get("currentGraph").metaData.componentPapers;
      console.log(sourceGraph.metaData.paperID);
      // if(Object.prototype.toString.call(sourceGraph.metaData.paperID) != '[object Array]') {
      //   sourceGraph.metaData.paperID.forEach(function(p) {
      //     if (componentPapers.indexOf(p) < 0) {
      //       componentPapers.push(p);
      //     }
      //   });
      // } else {
        if (componentPapers.indexOf(sourceGraph.metaData.paperID) < 0) {
          componentPapers.push(sourceGraph.metaData.paperID);
        }
      // }
      Graphs.update({_id: Session.get("currentGraph")._id},
      {$set: {graphData: cy.json(),
        lastEditTime: new Date().getTime(),
        "metaData.componentPapers": componentPapers
      }});
    } else {
      Graphs.update({_id: Session.get("currentGraph")._id},
      {$set: {graphData: cy.json(),
        lastEditTime: new Date().getTime(),
        "metaData.componentPapers": sourceGraph.metaData.paperID
      }});
    }
}
