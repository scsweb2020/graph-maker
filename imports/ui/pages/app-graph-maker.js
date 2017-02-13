import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Graphs } from '/imports/api/graphs.js';

import './app-graph-maker.css';
import './app-graph-maker.html';
import '/public/input/sampleGraph.js';
import '/imports/ui/cytoscape/cy-stylesheet.js';
import '/imports/ui/cytoscape/cy-context-menu-options.js';
import '/imports/ui/components/importGraphEntry.js';

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

      style: userGraphStyle,

      elements: {
          // nodes: initial_nodes,
          nodes: [],
          edges: []
      },
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

  /************************************************
  *
  * Undo/redo plugin
  *
  ************************************************/
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

  // listener for undo/redo --> CTRL+Z/Y
  var controlKeyDown;
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.target.nodeName === 'BODY') {
      controlKeyDown = true;
      console.log("control key down: " + controlKeyDown);
      if (e.which === 90)
          ur.undo();
      else if (e.which === 89)
          ur.redo();
    }
  });

  /************************************************
  *
  * Listeners
  *
  ************************************************/
  // Track the x,y position of the last click
  var clickPosition;
  cy.on('click', function(event) {
    clickPosition = event.cyPosition;
  });

  // focus on selected node;
  document.addEventListener("keyup", function (e) {
    if (e.ctrlKey) {
      controlKeyDown = false;
      console.log("control key down: " + controlKeyDown);
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

  // Delete on backspace
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

  $('#search-query').keydown(function(e) {
    if (e.keyCode === 13) {
      $('#apply-search').click();
    }
  });

  /************************************************
  *
  * Edgehandles plugin
  *
  ************************************************/

  cy.edgehandles({
      toggleOffOnLeave: true,
      handleNodes: "node",
      handleSize: 10,
      handleColor: 'maroon',
      handleIcon: false,
      edgeType: function(){ return 'flat'; }
  });

  /************************************************
  *
  * ContextMenus plugin
  *
  ************************************************/
  cy.contextMenus(userContextMenuOptions);

  cy.on("click", 'node', function(event) {
    if (controlKeyDown == true) {
      cy.center(event.cyTarget.closedNeighborhood());
      controlKeyDown = false;
      console.log("control key down: " + controlKeyDown);
    }
  })

  var selectAllOfTheSameType = function(ele) {
      cy.elements().unselect();
      if(ele.isNode()) {
          cy.nodes().select();
      }
      else if(ele.isEdge()) {
          cy.edges().select();
      }
  };

  /************************************************
  *
  * Layouts
  *
  ************************************************/

  bf = cy.makeLayout({
    name: 'breadthfirst',
    directed: true,
    animate: true,
    spacingFactor: 1.25,
  });

  /************************************************
  *
  * highlights plugin
  *
  ************************************************/
  highlighter = cy.viewUtilities();
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
  numComponentPapers: function() {
    if (Session.get("currentGraph").metaData['componentPapers']) {
      return Session.get("currentGraph").metaData['componentPapers'].length;
    } else {
      return 0;
    }
  },
  componentPapers: function() {
    if (Session.get("currentGraph").metaData['componentPapers']) {
      return Session.get("currentGraph").metaData['componentPapers'].join("\n");
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
  'click #apply-search': function() {
    ur.do("removeHighlights");
    let query = $('#search-query').val().split(" ");
    matches = cy.filter(function(i, element){
      let matching = false;
      if(element.isNode())  {
        query.forEach(function(q) {
          if (element.data("name").indexOf(q) > -1) {
            matching = true;
          }
        })
      }
      return matching;
    });
    ur.do("highlight", matches);
  },
  'click #clear-search': function() {
    $('#search-query').val("");
    ur.do("removeHighlights");
  },
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
    let componentPapers = $('#graph-component-papers').val().split("\n");
    if (paperID != "aggregate") {
      cy.nodes().forEach(function(node) {
        let currentID = node.data('paperID');
        if (currentID) {
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
        } else {
          node.data('paperID', [paperID]);
        }
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

Template.importGraphEntry.helpers({
  imported: function() {
    let result = false;
    if (!Session.get("currentGraph").metaData.hasOwnProperty("componentPapers")) {
      result = false;
    } else {
      let componentPapers = Session.get("currentGraph").metaData.componentPapers;
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
