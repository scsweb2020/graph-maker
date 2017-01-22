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
                  'height': 100,
                  'width': 100,
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
              'height': 100,
              'width': 100,
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

  // handles = new CytoscapeEdgeEditation;
  // handles.init(cy);

  // handles.registerHandle({
  //   positionX: "left",          //horizontal position of the handle  (left | center | right)
  //   positionY: "center",        //vertical position of the handle  (top | center | bottom)
  //   color: "#48FF00",           //color of the handle
  //   type: "some_type",          //stored as data() attribute, can be used for styling
  //   single: true,               //wheter only one edge of this type can start from same node (default false)
  //   nodeTypeNames: ["action", "why-hard"],    //which types of nodes will contain this handle
  //   noMultigraph: false         //whereter two nodes can't be connected with multiple edges (does not consider orientation)
  // });

  // Track the x,y position of the last click
  var clickPosition;
  cy.on('click', function(event) {
    clickPosition = event.cyPosition;
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

            cy.add({
                data: data,
                position: clickPosition
            });
          }
        }
      });
      // var data = {
      //     group: 'nodes',
      //     name: 'new node'
      // };
      //
      // cy.add({
      //     data: data,
      //     position: clickPosition
      // });
  });

  window.addEventListener('keydown', function(event) {
      // Key codes for backspace and delete
      var deleteKeys = [8,46];

      // Check that focus is not in an input element
      if (deleteKeys.indexOf(event.keyCode) > -1 &&
        event.target.nodeName !== 'INPUT') {
          cy.$(':selected').remove();
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
                  event.cyTarget.remove();
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
            // let currentName = event.cyTarget.data('name');
            // prompt the user for a new name
            // (provide current name as default)
            bootbox.prompt({
              size: "small",
              title: "Set paper ID",
              // inputType: "textarea",
              // value: currentName,
              callback: function(id) {
                if (id != null) {
                  event.cyTarget.data('paperID', id);
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
                  event.cyTarget.remove();
                // }
              // }
            // });
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

  // initiate "draw mode" for drawing edges
  // document.querySelector('#draw-mode').addEventListener('click', function(e) {
  //     var draw_button = e.target;
  //     var draw_mode = draw_button.getAttribute("data-draw-mode");
  //     console.log(draw_mode);
  //     if (draw_mode === "drawon") {
  //         draw_mode = "drawoff";
  //         draw_button_switch = "OFF";
  //     }
  //     else {
  //         draw_mode = "drawon";
  //         draw_button_switch = "ON";
  //     }
  //     cy.edgehandles(draw_mode);
  //     draw_button.setAttribute("data-draw-mode", draw_mode);
  //     draw_button.innerHTML = "Draw mode: " + draw_button_switch;
  // });

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
  // 'click .save-changes': function() {
  //   // cy.$(':selected').unselect();
  //   let currentName = Session.get("currentGraph").title;
  //   let currentPaperID = "";
  //   if (Session.get("currentGraph").metaData['paperID']) {
  //     currentPaperID = Session.get("currentGraph").metaData['paperID'];
  //   }
  //   let message = '<div class="bootbox-form"><div class="form-group row"><label for="graph-title" class="col-2 col-form-label">Title</label><div class="col-10"><input class="bootbox-input bootbox-input-text form-control" type="text" value="' + currentName +
  //   '" id="graph-title"></div></div><div class="form-group row"><label for="graph-paper-ID" class="col-2 col-form-label">PaperID</label><div class="col-10"><input class="bootbox-input bootbox-input-text form-control" type="text" value="' + currentPaperID + '" id="graph-paper-ID"></div></div></div></div>'
  //   // let message = '<div class="form-container"><div class="form-group row"><label for="graph-title" class="col-2 col-form-label">Title</label><div class="col-10"><input class="form-control" type="text" value="' + currentName +
  //   // '" id="graph-title"></div></div><div class="form-group row"><label for="graph-paper-ID" class="col-2 col-form-label">PaperID</label><div class="col-10"><input class="form-control" type="text" value="' + currentPaperID + '" id="graph-paper-ID"></div></div></div></div>'
  //   // console.log("saving changes");
  //   bootbox.dialog({
  //     title: "Save changes",
  //     message: message,
  //     buttons: {
  //       confirm: {
  //           label: 'Save',
  //           className: 'btn-success'
  //       },
  //       cancel: {
  //           label: 'Cancel',
  //           className: 'btn-danger'
  //       }
  //     },
  //     callback: function(result) {
  //       console.log("doing callback stuff with " + result);
  //       let title = $('#graph-title').val();
  //       let paperID = $('#graph-paper-ID').val();
  //       cy.nodes().forEach(function(node) {
  //         node.data('paperID', paperID);
  //       });
  //       Graphs.update({_id: Session.get("currentGraph")._id},
  //       {$set: {graphData: cy.json(),
  //         lastEditTime: new Date().getTime(),
  //         title: title,
  //         "metadata.paperID": paperID
  //       }});
  //     }
  //   })
  //
  //   //     bootbox.prompt({
  //   //   size: "small",
  //   //   title: "(Optional) (Re)name this graph",
  //   //   // inputType: "textarea",
  //   //   value: currentName,
  //   //   callback: function(newName) {
  //   //     if (newName != null) {
  //   //       Graphs.update({_id: Session.get("currentGraph")._id},
  //   //       {$set: {graphData: cy.json(),
  //   //         lastEditTime: new Date().getTime(),
  //   //         title: newName}});
  //   //     }
  //   //   }
  //   // });
  //
  //   // let newName = prompt("(Optional) (re)name this graph", currentName);
  //   // Graphs.update({_id: Session.get("currentGraph")._id},
  //   // {$set: {graphData: cy.json(),
  //   //   lastEditTime: new Date().getTime(),
  //   //   title: newName}});
  //   // alert("Successfully saved!");
  // },
  // 'contextmenu': function() {
  //   console.log("right click!");
  // }
  'click #save-changes': function() {
    let title = $('#graph-title').val();
    let paperID = $('#graph-paper-ID').val();
    cy.nodes().forEach(function(node) {
      node.data('paperID', paperID);
    });
    Graphs.update({_id: Session.get("currentGraph")._id},
    {$set: {graphData: cy.json(),
      lastEditTime: new Date().getTime(),
      title: title,
      "metaData.paperID": paperID
    }});
    $('#save-dialog').removeClass("in");
  },
  'click #cancel-save': function() {
    $('#save-dialog').removeClass("in");
  }
});

Template.EditGraphMetadata.helpers({
  title: function() {
    let graph = Graphs.findOne({_id: Session.get("currentGraph")._id});
    return graph.title;
  },
  paperID: function() {
    let graph = Graphs.findOne({_id: Session.get("currentGraph")._id});
    if (graph.metaData['paperID']) {
      return graph.metaData['paperID'];
    } else {
      return "";
    }
  }
});

Template.EditGraphMetadata.events({
  'click #save-changes': function() {
    let title = $('#graph-title').val();
    let paperID = $('#graph-paper-ID').val();
    cy.nodes().forEach(function(node) {
      node.data('paperID', paperID);
    });
    Graphs.update({_id: Session.get("currentGraph")._id},
    {$set: {graphData: cy.json(),
      lastEditTime: new Date().getTime(),
      title: title,
      "metadata.paperID": paperID
    }});
  }
});
