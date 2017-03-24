//http://embed.plnkr.co/YBCAc3/
d3.util = d3.util || {};
d3.util.wrap = function(_wrapW){ 
    return function(d, i){
        var that = this;

        function tspanify(){ 
            var lineH = this.node().getBBox().height;
            this.text('')
                .selectAll('tspan')
                .data(lineArray)
                .enter().append('tspan')
                .attr({
                    x: 0,
                    y: function(d, i){ return (i + 1) * lineH; } 
                })
                .text(function(d, i){ return d.join(' '); })
        }   

        function checkW(_text){ 
            var textTmp = that
                .style({visibility: 'hidden'})
                .text(_text);
            var textW = textTmp.node().getBBox().width;
            that.style({visibility: 'visible'}).text(text);
            return textW; 
        }

        var text = this.text();
        var parentNode = this.node().parentNode;
        var textSplitted = text.split(' ');
        var lineArray = [[]];
        var count = 0;
        textSplitted.forEach(function(d, i){ 
            if(checkW(lineArray[count].concat(d).join(' '), parentNode) >= _wrapW){
                count++;
                lineArray[count] = [];
            }
            lineArray[count].push(d)
        });

        this.call(tspanify)
    }
};