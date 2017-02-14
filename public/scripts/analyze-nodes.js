let root_ids = [];
cy.nodes().roots().forEach(function(r) {
   root_ids.push(r.data("id"));
});

cy.nodes().forEach(function(n) {
  let node_id = n.data("id");
  if (root_ids.indexOf(node_id) < 0) {
    let distances = [];
    root_ids.forEach(function(root_id) {
      let shortest_to_root = cy.elements().aStar({
        root: '#' + root_id,
        goal: '#' + node_id
      })
      if (shortest_to_root.found === true) {
        distances.push(shortest_to_root.distance);
      }
    });
    let total = 0;
    for(let i = 0; i < distances.length; i++) {
        total += distances[i];
    }
    let avg = total/distances.length;
    console.log(node_id + " avg distance from root = " + avg);
    cy.$('#' + node_id).data("avg_distance_from_root", avg);
  } else {
    cy.$('#' + node_id).data("avg_distance_from_root", 0);
  }
});
