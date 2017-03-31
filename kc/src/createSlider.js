    var slider = document.getElementById('slider');
    noUiSlider.create(slider, {
    	start: [2013, 2017],
      tooltips: true,
    	connect: true,
      step: 1,
    	range: {
    		'min': 2013,
    		'max': 2017
    	},
      format: wNumb({ decimals: 0 })
    });

    slider.noUiSlider.on('change', function(){
    	var rangeValues=slider.noUiSlider.get();
      var min=rangeValues[0];
      var max=rangeValues[1];

      filterByYear(min,max);

    });