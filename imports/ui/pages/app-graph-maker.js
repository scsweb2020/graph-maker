import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Graphs } from '/imports/api/graphs.js';

import './app-graph-maker.css';
import './app-graph-maker.html';
import '/public/input/sampleGraph.js';

Template.App_graphMaker.onCreated(function appGraphMakerOnCreated() {
    var self = this;
    self.autorun(function() {
      self.subscribe('allGraphs');
    })
});

Template.App_graphMaker.rendered = function() {

  console.log("Rendering graphmaker");
  // var initial_nodes = [];
  let currentGraph = Session.get("currentGraph");
  let initial_nodes = [];
  if (currentGraph.graphData === "EMPTY") {
      initial_nodes = sampleGraph;
  }
  var row_count = Math.floor(Math.sqrt(initial_nodes.length)) + 1;

  // initialize the graph
  cy = window.cy = cytoscape({

      container: document.getElementById('cy'),

      ready: function(){
        console.log("Graph is ready!")
      },

      //RB 11/15/16: This should be recalculated dynamically based on the nodes.
      layout: {
          name: 'grid',
          //cols: column_count,
          rows: row_count
      },

      wheelSensitivity: 0.3,

      style: [
          {
              selector: 'node',
              css: {
                  'content': 'data(name)',
                  // 'height': 100,
                  'height': function(ele) { return 100+(ele.data('paperID').length-1)*50 },
                  // 'width': 100,
                  'width': function(ele) { return 100+(ele.data('paperID').length-1)*50 },
                  'text-valign': 'center',
                  'text-halign': 'center',
                  'text-align': 'justify',
                  'background-color': '#eee',
                  'text-wrap': 'wrap',
                  'text-max-width': 200,
                  'text-outline-color': '#eee',
                  'text-outline-width': 3,
                  'border-width': 1,
                  'border-color': '#ccc'
              }
          },
          {
            selector: 'node:selected',
            css: {
              'content': 'data(name)',
              // 'height': 100,
              'height': function(ele) { return 100+(ele.data('paperID').length-1)*50 },
              // 'width': 100,
              'width': function(ele) { return 100+(ele.data('paperID').length-1)*50 },
              'text-valign': 'center',
              'text-halign': 'center',
              'text-align': 'justify',
              'background-color': '#eee',
              'text-wrap': 'wrap',
              'text-max-width': 200,
              'text-outline-color': '#eee',
              'text-outline-width': 3,
              'border-width': 4,
              'border-color': 'blue'
            }
          },
          {
              selector: 'node.why-hard',
              css: {
                  'shape': 'triangle',
                  'background-color': '#ffb3b3'
              }
          },

          {
              selector: 'edge',
              css: {
                  'curve-style': 'bezier',
                  'target-arrow-shape': 'triangle',
                  'target-arrow-color': 'green',
                  'line-color': 'green',
                  'width': 8
              }
          },

          // styles for advanced edge options
          // need to programmatically map to the values
          {
            selector: 'edge.negative',
            css: {
              'line-color': 'red',
              'target-arrow-color': 'red',
            }
          },

          {
            selector: 'edge.uncertain',
            css: {
              'opacity': 0.20,
              'line-style': 'dashed',
              // 'overlay-padding': '5px',
            }
          },

          // apparently order of this matters. if we put this before the
          // style options for the negative and uncertain classes,
          // conflicting style options are resolved by defaulting to the
          // earlier specified one.
          {
            selector: 'edge:selected',
            css: {
              'line-color': 'blue',
              'target-arrow-color': 'blue',
              'width': 16
            }
          },

          // some style for the ext

          {
              selector: '.edgehandles-hover',
              css: {
                  //'background-color': 'green'
              }
          },

          {
              selector: '.edgehandles-source',
              css: {
                  'border-width': 2,
                  'border-color': 'maroon'
              }
          },

          {
              selector: '.edgehandles-target',
              css: {
                  'border-width': 2,
                  'border-color': 'maroon'
              }
          },

          {
              selector: '.edgehandles-preview, .edgehandles-ghost-edge',
              css: {
                  'line-color': 'maroon',
                  'target-arrow-color': 'maroon',
                  'source-arrow-color': 'maroon'
              }
          }
      ],

      elements: {
          // nodes: initial_nodes,
          nodes: [],
          edges: []
      },
  });

  ur = cy.undoRedo({
    isDebug: true
  });

  cy.on("afterUndo", function (e, name) {
      console.log("Undid action: " + name);
  });

  cy.on("afterRedo", function (e, name) {
      console.log("Redid action: " + name);
  });

  cy.on("afterDo", function (e, name) {
      console.log("Did action: " + name);
  });

  // Track the x,y position of the last click
  var clickPosition;
  cy.on('click', function(event) {
    clickPosition = event.cyPosition;
  });

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.target.nodeName === 'BODY') {
      if (e.which === 90)
          ur.undo();
      else if (e.which === 89)
          ur.redo();
    }
  });

  // Add node on double click
  document.getElementById('cy').addEventListener('dblclick', function(event) {
      console.log("Double click event.");
      // unselect all currently selected stuff so it doesn't conflict
      // with the delete key listener
      cy.$(':selected').unselect();
      bootbox.prompt({
        size: "small",
        title: "(Re) name this node",
        inputType: "textarea",
        value: "New untitled node",
        callback: function(newName) {
          if (newName != null) {
            var data = {
                group: 'nodes',
                type: 'action',
                name: newName
            };
            ur.do("add", {
              data: data,
              position: clickPosition
            });
          }
        }
      });
  });

  window.addEventListener('keydown', function(event) {
      // Key codes for backspace and delete
      var deleteKeys = [8,46];

      // Check that focus is not in an input element
      if (deleteKeys.indexOf(event.keyCode) > -1 &&
        event.target.nodeName !== 'INPUT') {
          // cy.$(':selected').remove();
          ur.do("remove", cy.$(':selected'));
      }
  });

  // load the current graph from the mongoDB into cytoscape object, if available
  let toAdd = currentGraph.graphData
  if (toAdd != "EMPTY") {
    toAdd.elements.nodes.forEach(function(node) {
      cy.add(node);
    });
    toAdd.elements.edges.forEach(function(edge) {
      cy.add(edge);
    });
  }
  
  cy.edgehandles({
      toggleOffOnLeave: true,
      handleNodes: "node",
      handleSize: 10,
      handleColor: 'maroon',
      handleIcon: false,
      edgeType: function(){ return 'flat'; }
  });

  // controllers for context menus
  cy.contextMenus({
      menuItems: [
        {
          id: 'remove',
          title: 'remove',
          selector: 'node, edge',
          onClickFunction: function (event) {
            bootbox.confirm({
              size: "small",
              message: "Are you sure you want to remove this element? You cannot undo this action.",
              callback: function(ok) {
                if (ok) {
                  // event.cyTarget.remove();
                  ur.do("remove", event.cyTarget);
                }
              }
            });
          },
          // hasTrailingDivider: true
        },
        {
          id: 'edit-label',
          title: 'edit label',
          selector: 'node',
          onClickFunction: function (event) {
            // unselect all currently selected stuff so it doesn't conflict
            // with the delete key listener
            cy.$(':selected').unselect();
            // get the current name of the node
            let currentName = event.cyTarget.data('name');
            // prompt the user for a new name
            // (provide current name as default)
            bootbox.prompt({
              size: "small",
              title: "(Re) name this node",
              inputType: "textarea",
              value: currentName,
              callback: function(newName) {
                if (newName != null) {
                  event.cyTarget.data('name', newName);
                } else {
                  event.cyTarget.data('name', currentName);
                }
              }
            });
          }
        },
        {
          id: 'edit-metadata',
          title: 'edit metadata',
          selector: 'node',
          coreAsWell: true,
          onClickFunction: function (event) {
            // unselect all currently selected stuff so it doesn't conflict
            // with the delete key listener
            // cy.$(':selected').unselect();
            // get the current name of the node
            console.log(event.cyTarget);
            let currentPaperIDs = event.cyTarget.data('paperID');
            if (!currentPaperIDs) {
              currentPaperIDs = "";
            }
            // prompt the user for a new name
            // (provide current name as default)
            bootbox.prompt({
              size: "small",
              title: "Set paper ID(s) (if more than one, separate with commas)",
              // inputType: "textarea",
              value: currentPaperIDs,
              callback: function(ids) {
                if (ids != null) {
                  let toAdd = ids.split(",");
                  // let newIDs = event.cyTarget.data('paperID');
                  // if (newIDs) {
                  //   toAdd.forEach(function(i) {
                  //     if (newIDs.indexOf(i) < 0) {
                  //       newIDs.push(i);
                  //     }
                  //   });
                  //   event.cyTarget.data('paperID', newIDs);
                  // } else {
                    event.cyTarget.data('paperID', toAdd);
                  // }


                // } else {
                //   event.cyTarget.data('name', currentName);
                }
              }
            });
          }
        },
        {
          id: 'change-type',
          title: 'change type',
          selector: 'node',
          onClickFunction: function (event) {
            event.cyTarget.toggleClass("why-hard");
          }
        },
        {
          id: 'add-action',
          title: 'add node',
          coreAsWell: true,
          onClickFunction: function (event) {
            // var newName = prompt("Name this node");
            // unselect all currently selected stuff so it doesn't conflict
            // with the delete key listener
            cy.$(':selected').unselect();
            bootbox.prompt({
              size: "small",
              title: "(Re) name this node",
              inputType: "textarea",
              value: "New untitled node",
              callback: function(newName) {
                if (newName != null) {
                  var data = {
                      group: 'nodes',
                      type: 'action',
                      name: newName
                  };

                  cy.add({
                      data: data,
                      position: {
                          x: event.cyPosition.x,
                          y: event.cyPosition.y
                      },
                  });
                }
              }
            });
          }
        },
        {
          id: 'add-why-hard',
          title: 'add why-hard',
          coreAsWell: true,
          onClickFunction: function (event) {
            // unselect all currently selected stuff so it doesn't conflict
            // with the delete key listener
            cy.$(':selected').unselect();
            bootbox.prompt({
              size: "small",
              title: "(Re) name this node",
              inputType: "textarea",
              value: "New untitled node",
              callback: function(newName) {
                if (newName != null) {
                  var data = {
                      group: 'nodes',
                      type: 'why-hard',
                      name: newName
                  };

                  cy.add({
                      data: data,
                      position: {
                          x: event.cyPosition.x,
                          y: event.cyPosition.y
                      },
                      classes: "why-hard"
                  });
                }
              }
            });
            // var newName = prompt("Name this node");

          }
        },
        {
          id: 'remove-selected',
          title: 'remove selected',
          coreAsWell: true,
          onClickFunction: function (event) {
            // bootbox.confirm({
            //   size: "small",
            //   message: "Are you sure you want to remove these element? You cannot undo this action.",
            //   callback: function(ok) {
            //     if (ok) {
                  // event.cyTarget.remove();
                  ur.do("remove", event.cyTarget);
                // }
              // }
            // });
          }
        },
        {
          id: 'merge-selected',
          title: 'merged selected',
          coreAsWell: true,
          onClickFunction: function(event) {
            console.log(cy.$(':selected'));
          }
        },
        {
          id: 'select-all-nodes',
          title: 'select all nodes',
          selector: 'node',
          onClickFunction: function (event) {
            selectAllOfTheSameType(event.cyTarget);
          }
        },
        {
          id: 'select-all-edges',
          title: 'select all edges',
          selector: 'edge',
          onClickFunction: function (event) {
            selectAllOfTheSameType(event.cyTarget);
          },
          hasTrailingDivider: true
        },
        // advanced options for edges
        {
          id: 'toggle-type',
          title: 'switch pos/neg',
          selector: 'edge',
          onClickFunction: function (event) {
            event.cyTarget.toggleClass("negative");
          },
        },

        {
          id: 'toggle-certainty',
          title: 'switch certainty',
          selector: 'edge',
          onClickFunction: function(event) {
            event.cyTarget.toggleClass("uncertain");
          }
        },
    ]
  });

  var selectAllOfTheSameType = function(ele) {
      cy.elements().unselect();
      if(ele.isNode()) {
          cy.nodes().select();
      }
      else if(ele.isEdge()) {
          cy.edges().select();
      }
  };

  bf = cy.makeLayout({
    name: 'breadthfirst',
    directed: true,
    animate: true,
    spacingFactor: 1.25,
  });

}

Template.App_graphMaker.helpers({
  lastSaved: function() {
    // console.log(Graphs.findOne());
    let timeStr = Session.get("currentGraph").lastEditTime;
    return toTimeStampStr(timeStr);
  },
  title: function() {
    return Session.get("currentGraph").title;
  },
  paperID: function() {
    if (Session.get("currentGraph").metaData['paperID']) {
      return Session.get("currentGraph").metaData['paperID'];
    } else {
      return "";
    }
  },
  componentPapers: function() {
    if (Session.get("currentGraph").metaData['componentPapers']) {
      return Session.get("currentGraph").metaData['componentPapers'];
    } else {
      return "";
    }
  },
  userGraphs: function() {
    let currentUser = Session.get("currentUser");
    if (currentUser.userName === "ADMIN") {
      return Graphs.find({_id: {$ne: Session.get("currentGraph")._id}}, {sort: { lastEditTime : -1 }});
    } else {
      return Graphs.find({_id: {$ne: Session.get("currentGraph")._id},
                userID: currentUser._id}, {sort: { lastEditTime : -1 }});
    }
  }
});

Template.App_graphMaker.events({
  'click #auto-layout': function() {
    bf.run();
  },
  'click #center-graph': function() {
    cy.fit(75);
  },
  'click #record-png': function() {
    let png = cy.png({full: true})
     document.getElementById("export-png").setAttribute("href", png);
    document.getElementById("export-png").click();
  },
  'click #record-json': function() {

    //export the graph in a JSON format comparable to that
    //when initialized
    console.log(JSON.stringify(cy.json()));
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cy.json(), null, 3));
    var dlAnchorElem = document.getElementById('export-json');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "my-graph.json");
    dlAnchorElem.click();
  },
  'click #save-changes': function() {
    let title = $('#graph-title').val();
    let paperID = $('#graph-paper-ID').val();
    let componentPapers = $('#graph-component-papers').val().split(",");
    if (paperID != "aggregate") {
      cy.nodes().forEach(function(node) {
        let currentID = node.data('paperID');
        let newIDs;
        if(Object.prototype.toString.call(currentID) != '[object Array]') {
          newIDs = [currentID]
        } else {
          newIDs = node.data('paperID');
        }
        if (newIDs.indexOf(paperID) < 0) {
            newIDs.push(paperID);
        }
        console.log(newIDs);
        node.data('paperID', newIDs);
      });
    }
    Graphs.update({_id: Session.get("currentGraph")._id},
    {$set: {graphData: cy.json(),
      lastEditTime: new Date().getTime(),
      title: title,
      "metaData.paperID": paperID,
      "metaData.componentPapers": componentPapers,
    }});
    $('#save-dialog').removeClass("in");
  },
  'click #cancel-save': function() {
    $('#save-dialog').removeClass("in");
  }
});

// Template.EditGraphMetadata.helpers({
//   title: function() {
//     let graph = Graphs.findOne({_id: Session.get("currentGraph")._id});
//     return graph.title;
//   },
//   paperID: function() {
//     let graph = Graphs.findOne({_id: Session.get("currentGraph")._id});
//     if (graph.metaData['paperID']) {
//       return graph.metaData['paperID'];
//     } else {
//       return "";
//     }
//   }
// });
//
// Template.EditGraphMetadata.events({
//   'click #save-changes': function() {
//     let title = $('#graph-title').val();
//     let paperID = $('#graph-paper-ID').val();
//     if (paperID != "aggregate") {
//       cy.nodes().forEach(function(node) {
//         node.data('paperID', paperID);
//       });
//     }
//     Graphs.update({_id: Session.get("currentGraph")._id},
//     {$set: {graphData: cy.json(),
//       lastEditTime: new Date().getTime(),
//       title: title,
//       "metaData.paperID": paperID
//     }});
//   }
// });

Template.importGraphEntry.helpers({
  imported: function() {
    let result = false;
    if (!Session.get("currentGraph").metaData.hasOwnProperty("componentPapers")) {
      result = false;
    } else {
      let componentPapers = Session.get("currentGraph").metaData.componentPapers;
      console.log(componentPapers);
      console.log(this.metaData.paperID);
      if (componentPapers.indexOf(this.metaData.paperID) > -1) {
        result = true;
      } else {
        // result = false;
      }
    }
    console.log(result);
    return result;
  }
})

Template.importGraphEntry.events({
  'click .import-graph': function(event) {
    console.log("Importing graph!")
    console.log(this);
    importElements(this);
  },
});

let overlapID = function(targetID, destinationElements) {
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

let propagateNodeIDchange = function(oldID, newID, edges) {
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

let importElements = function(sourceGraph) {
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
