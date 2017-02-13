userGraphStyle = [
    {
        selector: 'node',
        css: {
            'content': 'data(name)',
            // 'height': 100,
            'height': function(ele) {
              if (ele.data('paperID')) {
                return 100+(ele.data('paperID').length-1)*75;
              } else {
                return 100;
              }
            },
            // 'width': 100,
            'width': function(ele) {
              if (ele.data('paperID')) {
                return 100+(ele.data('paperID').length-1)*75;
              } else {
                return 100;
              }
            },
            'text-valign': 'center',
            'text-halign': 'center',
            'text-align': 'justify',
            'background-color': '#eee',
            'text-wrap': 'wrap',
            'text-max-width': 200,
            'text-outline-color': '#eee',
            'text-outline-width': 3,
            'border-width': 1,
            'border-color': '#ccc',
            'font-size': function(ele) {
              if (ele.data('paperID')) {
                return 14+(ele.data('paperID').length-1)*4
              } else {
                return 14;
              }
            },
        }
    },
    {
      selector: 'node:selected',
      css: {
        'content': 'data(name)',
        // 'height': 100,
        'height': function(ele) {
          if (ele.data('paperID')) {
            return 100+(ele.data('paperID').length-1)*75;
          } else {
            return 100;
          }
        },
        // 'width': 100,
        'width': function(ele) {
          if (ele.data('paperID')) {
            return 100+(ele.data('paperID').length-1)*75;
          } else {
            return 100;
          }
        },
        'text-valign': 'center',
        'text-halign': 'center',
        'text-align': 'justify',
        'background-color': '#eee',
        'text-wrap': 'wrap',
        'text-max-width': 200,
        'text-outline-color': '#eee',
        'text-outline-width': 3,
        'border-width': 4,
        'border-color': 'blue',
        'font-size': function(ele) {
          if (ele.data('paperID')) {
            return 14+(ele.data('paperID').length-1)*4
          } else {
            return 14;
          }
        },
      }
    },
    {
        selector: 'node.why-hard',
        css: {
            'shape': 'triangle',
            'background-color': '#ffb3b3'
        }
    },

    {
        selector: 'edge',
        css: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'green',
            'line-color': 'green',
            'width': 5
        }
    },

    // styles for advanced edge options
    // need to programmatically map to the values
    {
      selector: 'edge.negative',
      css: {
        'line-color': 'red',
        'target-arrow-color': 'red',
      }
    },

    {
      selector: 'edge.uncertain',
      css: {
        'opacity': 0.20,
        'line-style': 'dashed',
        // 'overlay-padding': '5px',
      }
    },
    {
      selector: 'edge.analog',
      css: {
          'opacity': 0.50,
          'line-color': 'grey',
          'line-style': 'dashed',
          'target-arrow-shape': 'none',
          'width': 3
      }
    },

    // apparently order of this matters. if we put this before the
    // style options for the negative and uncertain classes,
    // conflicting style options are resolved by defaulting to the
    // earlier specified one.
    {
      selector: 'edge:selected',
      css: {
        'line-color': 'blue',
        'target-arrow-color': 'blue',
        'width': 10
      }
    },

    // some style for the ext

    {
        selector: '.edgehandles-hover',
        css: {
            //'background-color': 'green'
        }
    },

    {
        selector: '.edgehandles-source',
        css: {
            'border-width': 2,
            'border-color': 'maroon'
        }
    },

    {
        selector: '.edgehandles-target',
        css: {
            'border-width': 2,
            'border-color': 'maroon'
        }
    },

    {
        selector: '.edgehandles-preview, .edgehandles-ghost-edge',
        css: {
            'line-color': 'maroon',
            'target-arrow-color': 'maroon',
            'source-arrow-color': 'maroon'
        }
    }
];
