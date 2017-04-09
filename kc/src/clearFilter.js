    function clearFilter() {

      resetBaseLayer("reset");

      document.getElementById("tabs-1").innerHTML = "Click on a node to explore papers in the 'conceptual neighborhood' of the node";
      document.getElementById("tabs-2").innerHTML = "Click on a node to explore authors in the 'conceptual neighborhood' of the node";

      document.getElementById("tab-authors-badge").innerText = 0;
      document.getElementById("tab-papers-badge").innerText = 0;

      masterContextLinks = [];
      masterContextNodes = [];
      masterContextLabels = [];
      masterContextPaperIDs = [];
      focusNodeID = null;

      // svg.transition()
      //   .duration(500)
      //   .call(zoom.transform,
      //   d3.zoomIdentity
      //   .translate(0, 0)
      //   .scale(1)
      // );

    }
