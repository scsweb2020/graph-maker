function textInit(selection){
    selection
    .attr('x',0)
    .attr('y',0)
    .attr('class','dataLabels')
    .style('opacity', d => d.paperID.length >= 3 ? .7 : 0)
    .attr("font-size", d => sizeText(d, 'init'))
    .attr('id', function (d) { return 'label' + d.id; })
    .attr('dy', "1em") 
    .attr('fill', (d,i) =>{
      if (d.type === 'action' || d.type === 'paper'){
          return 'white'
      } else {
        return 'white'
      }

    })
    .text(d => d.name)
    .call(wrap, 250)
  }


  function textSelected(selection){
        selection
        .transition()
        .duration(toggleTime)
        .style("opacity", 1)
        // .style("fill", function (d) {
        //     if (d.type === "paper") {
        //         return "#00BFFF"
        //     } else {
        //         return "black"
        //     }
        // })
  }

function textReset(selection, purpose){
    selection.transition()
        .duration(toggleTime)
        .style('opacity', d => d.paperID.length >= 3 ? .4 : 0)
    //         .attr("font-size", d => sizeText(d, 'init'))
    // .attr('id', function (d) { return 'label' + d.id; })
    // .attr('dy', "1em") 
    // .text(d => d.name)
    // .call(wrap, 200)
    //     .style("opacity", function(d) {
    //       if (purpose === "transition") {
    //         return 0;
    //       } else {
    //         if (d.paperID.length >= 2) {
    //           return 0.5+d.paperID.length/10;
    //         } else {
    //           return 0;
    //         }
    //       }
    //     })
    //     .attr("font-size", d => sizeText(d, 'reset'))
    //     .style("fill", function(d) {
    //       if (d.type === "paper") {
    //         return "#00BFFF"
    //       } else {
    //         return "black"
    //       }
    //     })
    //     .text(d => modText(d));
}

function modText(d, state) { //init and reset
      var string = d.name
      if (d.paperID.length >= 2) {
        if (string.length > defaultTextLength) {
          return string.substring(0, defaultTextLength + 2) + '...';
        } else {
          return string
        }
      } else {
        return "";
      }
    }

function modFocusedText(d) { //selected
    var string = d.name
    if (string.length > focusTextLength) {
        return string.substring(0, focusTextLength + 2) + '...';
    } else {
        return string;
    }
}

function sizeText(d, state) {
    if (state === 'init' || state === 'reset'){
         var logSize = parseInt(6 + Math.log(d.paperID.length) * 10).toString()

         return logSize < 10 ? 10+'px' : logSize+'px';
    }
    if (state === 'selected') {
        if (d.type === "paper") {
                return 16;
            } else {
                return parseInt(8 + Math.log(d.paperID.length) * 10).toString() + 'px';
            }
    }
}

