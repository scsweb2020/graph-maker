   var masterContextNodes;
    var masterContextPaperIDs;
    var focusNodeID = null;
    var masterContextLabels;
    var masterContextLinks;
    var lastClickedNodeID;
    var lastClickedMetadataID;
    isFocusing = false;

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var footerHeight = $('.footer').height();
    console.log("window viewport height = " + windowHeight.toString());
    console.log("window viewport width = " + windowWidth.toString());
    $('.graphContainer').height(windowHeight-20-footerHeight);
    $('.graphContainer').css("max-height", windowHeight-20-footerHeight);
    $('.graphContainer').width(windowWidth-20);
    $('.graphContainer').css("max-width", windowWidth-20);

    $('.graph').height(windowHeight-20-footerHeight);
    $('.graph').css("max-height", windowHeight-20-footerHeight);
    $('.graph').width(windowWidth-20);
    $('.graph').css("max-width", windowWidth-20);

    $('#tabs-1').css("max-height", windowHeight/3);
    $('#tabs-2').css("max-height", windowHeight/3)

    $('.info-icon').click();

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height")

    zoom = d3.zoom()
      .scaleExtent([1 / 10, 4])
      .on("zoom", zoomed);

    function zoomed() {
      g.attr("transform", d3.event.transform);
    }

    svg.append("rect")
      .attr("width", windowWidth-20)
      .attr("height", windowHeight-20-footerHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(d3.zoom()
        .scaleExtent([1/10, 4])
        .on("zoom", zoomed)
      );
