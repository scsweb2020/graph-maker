function nodeSizeDefault(d) {
      var lengthRad = defaultRadius + Math.log(d.paperID.length) * 50;
      return lengthRad
      // return lengthRad < 30 ? 30 : lengthRad;
}

function nodeInit(selection) {
    selection
    .attr("class", "dataNodes")
    .attr('id', function (d) { return 'id' + d.id; })
    .style('opacity', function(d,i) {
      console.log(_.isEqual(window.activations.nodeIDs[i], d.id), 'ids match')
      // d => d.paperID.length >= 3 ? .7 : 0)
      if (d.type == "paper") {
        return 0;
      } else {
        // authors are always visible to start with
        if (d.type == "author") {
          return 0.7;
        // } else if (d.paperID.length >= 3) {
        // } else if (d.paperID.length >= 3 || d.distance_from_root_min == 0) {
        } else if (d.distance_from_root_min == 0) {
          return 0.7
        } else {
          return 0;
        }
      }
    })
    .style("fill", function (d) {
      if (d.type == 'author')
        return 'red';
      else if (d.type == 'paper')
        return '#00BFFF';
      else {
        return '#247';
      }
    })
    .attr("width",(d,i) =>{
      return bbox_array[i][1][0]*2
      }) ////from center: [[topLeftX, topLeftY(- is up)], [bottomRightX, bottomRightY(+ is down)]]
    .attr("height",(d,i) =>{
      return bbox_array[i][1][1]*2;
    })
    .attr('ry', '5')
    .on("contextmenu",  function (d,i)  {
      var hasClass = d3.select(this).classed('rightClicked');
      d3.select(this).classed('rightClicked', !hasClass);

        d3.event.preventDefault();
       if( _.includes(window.dblClickedIDs, d.id)) {
          _.remove(window.dblClickedIDs, (n)=> n===d.id )
       } else {
         window.dblClickedIDs.push(d.id)
       }

    })
    .on("click", function (d, i) {
       var allClickIDs = _.uniq(_.concat(window.dblClickedIDs, d.id))
       var arr = allClickIDs.map( (cur, i) => window.activations[cur])
       var zippedArr =  _.zip.apply(_, arr);
       var geoMean = zippedArr.map(row => jStat(row).mean())
       console.log(allClickIDs)
      selection.style('opacity', (data, ix) => {
        // console.log(_.isEqual(window.activations.nodeIDs[ix], data.id), 'ids match')
        // console.log(window.activations[d.id], d.id, ix)
        // return window.activations[d.id][ix]
        return geoMean[ix] * 1.5 //
      })
      window.textSelection.style('opacity', (data, ix) => {
        // console.log(_.isEqual(window.activations.nodeIDs[ix], data.id), 'ids match')
        // console.log(window.activations[d.id], d.id, ix)
        // return window.activations[d.id][ix]
        return geoMean[ix] * 1.5
      })
      // neighboring(d);
      // if (["action", "why-hard"].indexOf(d.type) >= 0) {
      //   neighboring(d);
      // } else {
      //   var focusItemID = d.id;
      //   if (focusItemID === lastClickedMetadataID && isFocusing) {
      //     isFocusing = false;
      //     clearFocus(focusNodeID);
      //   } else {
      //      isFocusing = true;
      //      focus(focusNodeID, focusItemID, d.type); //click
      //      $('.node-metadata').removeClass("selected");
      //      // $(this).addClass("selected");
      //      lastClickedMetadataID = focusItemID;
      //   // focus(focusNodeID, d.id, d.type);
      //   }
      // }
    })
    .on("mouseover", function (d) { // for tooltips
      //  if (d3.select(this).style('opacity') < 1) {
          div.transition()
              .duration(200)
              .style("opacity", .9);
          div.html(d.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
      //  }
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })
}

function nodesSelected(selection){
  console.log('node selection',selection)
            selection
            .transition()
            .duration(toggleTime)
            // .attr('r', d => nodeSizeDefault(d))
            .style('opacity', 1)

        //     .attr("r", function (d) { //click radius change
        //     if (d.type == 'paper') {
        //         return topicRadius;
        //     } else {
        //         return 2 + defaultRadius + Math.log(d.paperID.length) * 10;
        //     }
        // })
        // .attr('---', (d, i) => {
        //     //unfix these nodes so the are re-simulated
        //     d.fx = null;
        //     d.fy = null;
        // })
}

function nodeReset(selection, purpose){
  selection
    .transition()
        .duration(toggleTime)
        // .style('opacity', d => d.paperID.length >= 3 ? .4 : 0)
        .style('opacity', function(d) {
          // d => d.paperID.length >= 3 ? .7 : 0)
          if (purpose == "reset") {
            if (d.type == "paper") {
              return 0;
            } else {
              // authors are always visible to start with
              if (d.type == "author") {
                return 0.7;
              } else if (d.distance_from_root_min == 0) {
                return 0.7
              } else {
                return 0;
              }
            }
          } else {
            if (d.type == "paper") {
              return 0;
            } else {
              if (d.paperID.length >= 3 || d.distance_from_root_min == 0) {
                return 0.2
              } else {
                return 0;
              }
            }
          }

        })
        .style('stroke', 'none')


        // function(d) {
        //   if (purpose === "transition") {
        //     if (d.type === "paper") {
        //       return 0;
        //     } else {
        //       return 0.1;
        //     }
        //   } else {
        //     if (d.paperID.length >= 2) {
        //       return 0.5+d.paperID.length/10;
        //     } else if (d.type === "paper") {
        //       return 0;
        //     } else {
        //       return 0.25;
        //     }
        //   }
        // }

        // .attr('r', d => nodeSizeDefault(d))
        // .attr("r", function(d){
        //    if(d.type=='action' || d.type=='why-hard')
        //    return defaultRadius+Math.log(d.paperID.length)*10;
        //    if(d.type=='paper')
        //        return topicRadius;
        // })
}
