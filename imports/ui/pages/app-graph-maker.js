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
    // const graph_data = Graphs.find();
    // // const graph_data = Graphs.example();
    // // const graph_data = Graphs.findOne({id: 'example-graph'});
    // console.log("LOOK AT ME! LOOK HERE! HEY HEY! I'm the CLIENT!!!");
    // console.log(graph_data);
    // if (graph_data.count() === 0) {
    //     console.log("No data. Sorry.");
    // }
    // else {
    //     console.log("Pa-ching! Data found!")
    // }
});

Template.App_graphMaker.rendered = function() {

  console.log("Rendering graphmaker");
  // var initial_nodes = [];
  let currentGraph = Session.get("currentGraph");
  let initial_nodes = [];
  if (currentGraph.graphData === "EMPTY") {
      initial_nodes = sampleGraph;
  }
  // get initial data
  // $.ajax({
  //     type: "GET",
  //     url: "input/nodes.json",
  //     dataType: "json",
  //     async: false,
  //     success: function (data) {
  //         initial_nodes = data;
  //     }})
  //     .fail(function(xhr, status, error) {
  //         var err = status + ", " + error;
  //         console.log("Request failed: " + err)
  // });
  var row_count = Math.floor(Math.sqrt(initial_nodes.length)) + 1;

  // initialize the graph
  cy = cytoscape({

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
                  //'line-color': '#eee',
                  'width': 8
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
          nodes: initial_nodes,
          edges: []
      },
  });

  // remove an edge when it's clicked on
  // cy.on('click', 'edge', function(evnt) {
  //     var target = evnt.cyTarget;
  //     console.log(target.json());
  //     target.remove();
  // });
  // cy.on('keydown', 'nodes', function(evnt) {
  //     // Key codes for backspace and delete
  //     delete_keys = [8,46];
  //     console.log(evnt);
  //     if (delete_keys.indexOf(evnt.keyCode) > -1) {
  //         //cy.selected().remove();
  //         console.log("DELETE!");
  //         cy.$(':selected').remove();
  //     }
  // });

  // Track the position of the last click
  var clickPosition;
  cy.on('click', function(event) {
    clickPosition = event.cyPosition;
  });

  // Add node on double click
  document.getElementById('cy').addEventListener('dblclick', function(event) {
      console.log("Double click event.");
      var data = {
          group: 'nodes',
          name: 'new node'
      };

      cy.add({
          data: data,
          position: clickPosition
      });
  });

  window.addEventListener('keydown', function(event) {
      // Key codes for backspace and delete
      delete_keys = [8,46];

      // Check if node or edge has focus
      if (delete_keys.indexOf(event.keyCode) > -1) {
          //cy.selected().remove();
          console.log("DELETE!");
          cy.$(':selected').remove();
      }
  });

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

  var selectAllOfTheSameType = function(ele) {
      cy.elements().unselect();
      if(ele.isNode()) {
          cy.nodes().select();
      }
      else if(ele.isEdge()) {
          cy.edges().select();
      }
  };

  // controllers for context menus
  cy.contextMenus({
      menuItems: [
        {
          id: 'remove',
          title: 'remove',
          selector: 'node, edge',
          onClickFunction: function (event) {
            var ok = confirm("Are you sure? You cannot undo this action.");
            if (ok) {
              event.cyTarget.remove();
            }
          },
          // hasTrailingDivider: true
        },
        {
          id: 'edit-label',
          title: 'edit label',
          selector: 'node',
          onClickFunction: function (event) {
            // get the current name of the node
            var currentName = event.cyTarget.data('name');
            // prompt the user for a new name
            // (provide current name as default)
            var newName = prompt("Edit node label", currentName);
            if (!newName) {
                // use the old name if the user cancels
                event.cyTarget.data('name', currentName);
            } else {
                // put in the new name
                event.cyTarget.data('name', newName);
            }

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
        // {
        //   id: 'hide',
        //   title: 'hide',
        //   selector: '*',
        //   onClickFunction: function (event) {
        //     event.cyTarget.hide();
        //   },
        //   disabled: false
        // },
        {
          id: 'add-action',
          title: 'add node',
          coreAsWell: true,
          onClickFunction: function (event) {
            var newName = prompt("Name this node");
            var data = {
                group: 'nodes',
                name: newName
            };

            cy.add({
                data: data,
                position: {
                    x: event.cyPosition.x,
                    y: event.cyPosition.y
                }
            });
          }
        },
        {
          id: 'add-why-hard',
          title: 'add why-hard',
          coreAsWell: true,
          onClickFunction: function (event) {
            var newName = prompt("Name this node");
            var data = {
                group: 'nodes',
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
        },
        {
          id: 'remove-selected',
          title: 'remove selected',
          coreAsWell: true,
          onClickFunction: function (event) {
            var ok = confirm("Are you sure? You cannot undo this action.");
            if (ok) {
              cy.$(':selected').remove();
            }
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
          }
        }
    ]
  });

  // initiate "draw mode" for drawing edges
  document.querySelector('#draw-mode').addEventListener('click', function(e) {
      var draw_button = e.target;
      var draw_mode = draw_button.getAttribute("data-draw-mode");
      console.log(draw_mode);
      if (draw_mode === "drawon") {
          draw_mode = "drawoff";
          draw_button_switch = "OFF";
      }
      else {
          draw_mode = "drawon";
          draw_button_switch = "ON";
      }
      cy.edgehandles(draw_mode);
      draw_button.setAttribute("data-draw-mode", draw_mode);
      draw_button.innerHTML = "Draw mode: " + draw_button_switch;
  });

  // print the current state of the graph to console
  // when user clicks on the "record" button
  document.getElementById('record-json').addEventListener('click', function(){
      //this is an object, not an iterable
      var nodes = cy.nodes();
      var nodes_arr = [];
      for (var i = 0; i < nodes.length; i++) {
        nodes_arr.push(nodes[i].data());
      }
      var edges = cy.edges();
            var edges_arr = [];
      for (var i = 0; i < edges.length; i++) {
        edges_arr.push(edges[i].data());
      }

      //console.log(edges.json());
      console.log(JSON.stringify(nodes_arr));
      console.log(JSON.stringify(edges_arr));
      //export the graph in a JSON format comparable to that
      //when initialized
      console.log(JSON.stringify(cy.json()));
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cy.json(), null, 3));
      var dlAnchorElem = document.getElementById('export-json');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "my-graph.json");
      dlAnchorElem.click();
      // document.getElementById("export-json").setAttribute("href", cy.json());
      // document.getElementById("export-json").click();
  });

  // document.getElementById('record-png').addEventListener('click', function(){
  //   document.getElementById("export-png").setAttribute("href", cy.png());
  //   document.getElementById("export-png").click();
  // });

}

Template.App_graphMaker.helpers({
  graph: function() {
    console.log(Graphs.findOne());
    return Graphs.find().count();
  }
});

Template.App_graphMaker.events({
  'click #record-png': function() {
     document.getElementById("export-png").setAttribute("href", cy.png());
    document.getElementById("export-png").click();
  },
  'click #record-json': function() {
    var nodes = cy.nodes();
    var nodes_arr = [];
    for (var i = 0; i < nodes.length; i++) {
      nodes_arr.push(nodes[i].data());
    }
    var edges = cy.edges();
          var edges_arr = [];
    for (var i = 0; i < edges.length; i++) {
      edges_arr.push(edges[i].data());
    }

    //console.log(edges.json());
    console.log(JSON.stringify(nodes_arr));
    console.log(JSON.stringify(edges_arr));
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
    let newName = prompt("(Optional) name this graph", "Untitled graph");
    Graphs.update({_id: Session.get("currentGraph")._id},{$set: {graphData: cy.json()}});
    alert("Successfully saved!");
  }
});
