userContextMenuOptions = {
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
          } else {
            currentPaperIDs = currentPaperIDs.join("\n");
          }
          // prompt the user for a new name
          // (provide current name as default)
          bootbox.prompt({
            size: "large",
            title: "Set paper ID(s) (if more than one, separate with commas)",
            inputType: "textarea",
            value: currentPaperIDs,
            callback: function(ids) {
              if (ids != null) {
                let toAdd = ids.split("\n");
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
        id: 'toggle-valence',
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
      {
        id: 'toggle-analog',
        title: 'switch cause/related',
        selector: 'edge',
        onClickFunction: function(event) {
          event.cyTarget.toggleClass("analog");
        }
      },

  ]
}
