/************************
* Node filtering/selection functions
*************************/


/////// given a selected author, return (directly associated nodes)
// lookup
function author_to_nodes(author, author_connections) {
  return author_connections[author];
}

/////// given a selected topic, return (directly associated nodes)
// at some point, verify that this is a topic node
// find all nodes that are linked to this topic --> find all links that have topic as either source or target
function topic_to_nodes(topicID, node_connections) {
  return node_connections[topicID];
}

/////// given min and max year, return (nodes in range)
function years_to_nodes(min, max, nodes) {
  result = [];
  nodes.forEach(function(n) {
    n.year.forEach(function(y) {
      if (y >= min && y <= max) {
        result.push(n)
      }
    });
  });
  return result;
}

/************************
* Info manager functions
*************************/

// given a set of N selected nodes, where N >= 1
// return set of associated authors and papers
function node_info(nodes) {
  var authors = [];
  var paperIDs = [];
  nodes.forEach(function(n) {
    n.paperID.forEach(function(p) {
      if (papers.indexOf(p) < 0) {
        paperIDs.push(p);
      }
    });
    n.authors.forEach(function(a) {
      if (authors.indexOf(a) < 0){
        authors.push(a);
      })
    })
  });
  return {'authors': authors, 'paperIDs': paperIDs}
}
