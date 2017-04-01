 /*********
    * Unused
    *********/

    // unselect all nodes
    var active = d3.select(null);

    /***
    Control interactions with nodes
    CURRENTLY INACTIVE
    ***/
    function clicked(d) {


      // do nothing if it's the one we already selected
      if (active.node() === this){
        active.classed("active", false);
        return reset();
      }

      // grab the active node(s)
      active = d3.select(this).classed("active", true);


      if(d.type=='action' || d.type=='why-hard')  {
       //focus around the spot of the selected node(s)
      svg.transition()
        .duration(750)
        .call(zoom.transform,
          d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scaleFactor)
          .translate(-(+active.attr('cx')), -(+active.attr('cy')))

        );
         console.log(active);
    }

        d3.select("#tabs-1").text(d.authors);
        d3.select("#tabs-2").text(d.id);

    }

    // var nodesByYearFilter=[];
    // var nodesByAuthorFilter=[];
    //
    // //var allNodesInGraph=[];
    // returnAllNodes();
    //
    //
    //
    // function returnAllNodes(){
    //
    //   d3.json("data/nodes.json", function(d){
    //
    //     for (var i=0; i<d.length; i++){
    //       nodesByYearFilter[i]="#id"+(d[i].id);
    //     }
    //
    //     for (var i=0; i<d.length; i++){
    //       nodesByAuthorFilter[i]="#id"+(d[i].id);
    //     }
    //
    //   });
    //
    // }

    $( function() {
        $( "#tabs" ).tabs();
    });
    //
    //
    // $(function() {
    //     var availableTags = [
    //     "Jodi L. Forlizzi",
    //     "Walter Lasecki",
    //     "Aniket Kittur",
    //     "Alessandro Acquisti",
    //     "Lorrie Faith Cranor",
    //     "Kurt Luther",
    //     "Sophie Vennix",
    //     "Robert E. Kraut",
    //     "Sara Kiesler",
    //     "Laura Dabbish",
    //     "Gabriela Marcu",
    //     "Scott Hudson",
    //     "Nathaniel Fruchter",
    //     "Felicia Y Ng",
    //     "W. Ben Towne",
    //     "Jeffrey M. Rzeszotarski",
    //     "Anita Williams Woolley",
    //     "Steven Dang",
    //     "Manya Sleeper",
    //     "Jeffrey Bigham",
    //     "Anind Dey",
    //     "Winnie Leung",
    //     "Laura A. Dabbish",
    //     "Thomas Garncarz",
    //     "Lixiu Yu",
    //     "Min Kyung Lee",
    //     "Yi-Chia Wang",
    //     "Mark E Whiting",
    //     "Joel Chan",
    //     "Steven P. Dow",
    //     "Anind K. Dey",
    //     "Haiyi Zhu",
    //     "Jeffrey P. Bigham"
    //   ];
    //     $( "#tags" ).autocomplete({
    //       source: availableTags
    //     });
    //   } );

    // $( "#tags" ).on( "autocompleteselect", function( event, ui ) {
    //     FilterByAuthor();
    // } );

    function FilterByAuthor(){

      d3.json("data/author_connections.json", function(d) {

      var listOfNodes=(d[document.getElementById("tags").value]);

          for(i=0; i< listOfNodes.length; i++){
          listOfNodes[i]= '#id' + listOfNodes[i];
          }

          nodesByAuthorFilter=listOfNodes;


          finalFilter();
      });
    }

    function authorHighlight(d){
      console.log(masterContextNodes);
      var nodeAuthors = singleNodePaperDetails(d.id, masterContextNodes);
      singleAuthorDetails(nodeAuthors);

      d3.selectAll(".dataNodes")
      .transition()
      .duration(toggleTime)
      .style("opacity", 0.1)
      .attr("r", function(d){
          if(d.type=='action' || d.type=='why-hard')
          // return defaultRadius;
          return defaultRadius+Math.log(d.paperID.length)*10;

          if(d.type=='topic')
              return topicRadius;
        })
        .style("stroke", "none");

        d3.selectAll(masterContextNodes.toString())
        .transition()
        .duration(toggleTime)
        .style("opacity", 1)
        // .attr("r", defaultRadius+5);
        .attr("r", function(d){
            if(d.type=='action' || d.type=='why-hard')
            // return defaultRadius;
            return 2+defaultRadius+Math.log(d.paperID.length)*10;

            if(d.type=='topic')
                return topicRadius;})

        if (focusNodeID != null) {
            console.log(focusNodeID);
            // console.log("focusNode in paper nodes? " + (nodes.indexOf(focusNodeID) >= 0));
            d3.select("#id" + focusNodeID).transition().duration(toggleTime)
              .style("stroke-dasharray", ("5,4"))
             .style("stroke", "orange")
             .style("stroke-width", "3px");
        }

      d3.select("#id" + d.id).transition()
        .style("stroke", "#D3D3D3")
        .style("stroke-width")

    }

    function intersect(a, b) {
        var t;
        if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
        return a.filter(function (e) {
            if (b.indexOf(e) !== -1) return true;
        });
    }

    //    function filterByName(nodes, labels){
    function finalFilter(){

        //console.log(allNodesInGraph);
        console.log("Year="+nodesByYearFilter);
        console.log("Author"+nodesByAuthorFilter);


        var finalListOfLabels=[];
        // var finalListOfLinks=[];


        var finalListOfNodes=intersect(nodesByAuthorFilter, nodesByYearFilter);
        console.log("intersectionOfNodes"+finalListOfNodes);

        var finalStringOfNodes = finalListOfNodes.toString();


        for(i=0; i< finalListOfNodes.length; i++){
            finalListOfLabels[i]= finalListOfNodes[i].replace('#id', '#label');

         }

         var finalStringOfLabels=finalListOfLabels.toString();


         var nodeList = []
         finalListOfNodes.forEach(function(n) {
           nodeList.push(n.replace("#id",""));
         });
         var finalListOfLinks=filterLinks(nodeList);
         for(i=0; i< finalListOfLinks.length; i++){
                  finalListOfLinks[i]= '#link' + finalListOfLinks[i];

         }

         var finalStringOfLinks=finalListOfLinks.toString();


            d3.selectAll(".dataNodes").transition().duration(toggleTime).style("opacity", 0.1);
            d3.selectAll(".dataLabels").transition().duration(toggleTime)
              .style("opacity", 0.2)
              .text(function(d) {
                  var string = d.name

                  if (string.length > 15)
                      return string.substring(0,17)+'...';
                  else
                      return string;
                 });
            d3.selectAll(".dataLinks").transition().duration(toggleTime).style("opacity", 0.1);


            d3.selectAll(finalStringOfNodes).transition().duration(toggleTime).style("opacity", 1);
            d3.selectAll(finalStringOfLabels).transition().duration(toggleTime)
              .style("opacity", 1)
              .text(function(d) {
                  var string = d.name

                  if (string.length > 40)
                      return string.substring(0,42)+'...';
                  else
                      return string;
                 });;
            d3.selectAll(finalStringOfLinks).transition().duration(toggleTime).style("opacity", 0.5);


    }

    function singleNodePaperDetails(nodeID, singleNodeNodes){
      // console.log("calling paperDetails")
      // console.log(papers);
        console.log(singleNodeNodes);
        var combinedNodes = [];
        singleNodeNodes.forEach(function(n) {
          combinedNodes.push(n.replace("#id", ""));
        });
        // var combinedNodes = contextNodes
        // combinedNodes.push(nodeID);
        console.log("number of nodes for singleNodePaperDetails: " + combinedNodes.length);
        var selectedPapers = [];
        var authors=[];
        var authorNames = [];
        for(i=0; i<papers.length; i++){
            console.log(papers[i]);
            console.log(combinedNodes);
            if (findOne(papers[i].nodeIDs, combinedNodes)) {
              console.log("found a match!");
              var copyOf = papers[i];
              if (papers[i].nodeIDs.indexOf(nodeID) >= 0) {
                copyOf['focus'] = 1
              } else {
                copyOf['focus'] = 0;
              }
              selectedPapers.push(copyOf);
              var paperAuthors = papers[i].author_arr
              for (j=0; j<paperAuthors.length; j++) {
                if (authorNames.indexOf(paperAuthors[j]) < 0) {
                  // TODO: do focus computation here
                  var authorObj = {
                      'name': paperAuthors[j],
                      'title': "CMU HCII Faculty",
                      'url': "",
                      'focus': 0
                  }
                  if (authors_to_nodes.hasOwnProperty(paperAuthors[j])) {
                    if (authors_to_nodes[paperAuthors[j]].indexOf(nodeID) >= 0) {
                      authorObj['focus'] = 1;
                    }
                  }
                  authors.push(authorObj);
                  authorNames.push(paperAuthors[j]);
                }
              };
            }
        }
        var p = document.getElementById("tabs-2");
        p.innerHTML = "";

        selectedPapers.sort(function(a, b) { return b.focus-a.focus });
        selectedPapers.forEach(function(paper) {
          var paperDOM = newPaper(paper);
          if (paper.focus == 1) {
            paperDOM.classList.add("focused");
          }
          p.appendChild(paperDOM);
        });
        tabBadge = document.getElementById("tab-papers-badge");
        tabBadge.innerText = selectedPapers.length;

        // set up event listener
        $('.node-metadata').on("click", function(e, target) {
          // console.log("Clicked!");
          // console.log(this);
          var focusItemID = this.id.replace("paper-", "");
          console.log("this metadataID: " + focusItemID);
          console.log("lastClickedMetadataID: " + lastClickedMetadataID);
          if (focusItemID === lastClickedMetadataID && isFocusing) {
            isFocusing = false;
            clearFocus(focusNodeID);
          } else {
            isFocusing = true;
            focus(focusNodeID, focusItemID, "paper");
            $('.node-metadata').removeClass("selected");
            $(this).addClass("selected");
            lastClickedMetadataID = focusItemID;
          }
        });
        return authors;
    }

    function singleAuthorDetails(authors) {

       var p = document.getElementById("tabs-1");
       p.innerHTML = "";
       authors.sort(function(a, b) { return b.focus-a.focus});
       authors.forEach(function(author) {
         var authorDOM = newAuthor(author);
         if (author.focus == 0) {
           authorDOM.classList.add("focused");
         }
         p.appendChild(authorDOM);

       });
       var tabBadge = document.getElementById("tab-authors-badge");
       tabBadge.innerText = authors.length;
    }