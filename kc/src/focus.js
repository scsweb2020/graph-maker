    function focus(focusNodeID, focusItemID, focusType) {

      $('.node-metadata').removeClass("focused");

      // add highlights to related nodes
      var listOfNodes;
      var listOfNodeIDs = [];
      var listOfLinks;
      if (focusType === "paper") {
        listOfNodes = papers_to_nodes[focusItemID]
        for (i=0; i<listOfNodes.length; i++) {
          listOfNodeIDs.push("#id" + listOfNodes[i]);
        }
        listOfLinks = filterLinks(listOfNodes);
        for (i=0; i<listOfLinks.length; i++) {
          listOfLinks[i] = "#link" + listOfLinks[i];
        }
        filterByFocus(focusItemID, focusNodeID, listOfNodeIDs.toString(), listOfLinks.toString());
      }

    }