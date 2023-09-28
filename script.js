function maxRunLength(arr) {
    let maxRun = 0;
    let currentRun = 1;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === arr[i - 1]) {
        currentRun++;
      } else {
        maxRun = Math.max(maxRun, currentRun);
        currentRun = 1;
      }
    }
    return Math.max(maxRun, currentRun);
  }

document.getElementById("m").addEventListener("input", function() {
    document.getElementById("m-output").textContent = this.value;
  });
document.getElementById("n").addEventListener("input", function() {
    document.getElementById("n-output").textContent = this.value;
});


function updateOutputAndGenerateHistogram(sliderID, outputID) {
    const slider = document.getElementById(sliderID);
    const output = document.getElementById(outputID);
    output.textContent = slider.value;
  
    // Update output in real-time
    slider.addEventListener("input", function() {
      output.textContent = this.value;
    });
  
    // Regenerate histogram when slider is released
    slider.addEventListener("change", function() {
      generateHistogram();
    });
  }
  
  // Update output elements when sliders are moved and regenerate histogram
  updateOutputAndGenerateHistogram("m", "m-output");
  updateOutputAndGenerateHistogram("n", "n-output");
  

function generateHistogram() {
    const m = parseInt(document.getElementById("m").value);
    const n = parseInt(document.getElementById("n").value);

    const maxRunLengths = [];

    for (let i = 0; i < m; i++) {
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 2));
    const maxRun = maxRunLength(arr);
    maxRunLengths.push(maxRun);
    }

    const meanMaxRun = maxRunLengths.reduce((a, b) => a + b, 0) / m;
    document.getElementById("meanValue").textContent = meanMaxRun.toFixed(2);
    console.log(`Mean Maximum Run Length: ${meanMaxRun}`);

    // Manually calculate histogram bins
    const binSize = 1; // You can adjust this value
    const bins = {};
    maxRunLengths.forEach((length) => {
      const bin = Math.floor(length / binSize) * binSize;
      bins[bin] = (bins[bin] || 0) + 1;
    });
  
    const x = Object.keys(bins).map(Number);
    const y = Object.values(bins);
  
    // Create the histogram trace
    const histogramTrace = {
      x: x,
      y: y,
      type: 'bar',
      opacity: 0.6,
      marker: {
        color: 'blue',
      },
      hoverinfo: 'y',
      name: 'Frequency',
    };
  
    // Create the smooth curve trace
    const curveTrace = {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines',
      line: { shape: 'spline' },
      opacity: 0.6,
      marker: { color: 'red' },
      hoverinfo: 'skip',
    };
  
    // Combine the histogram and curve traces
    const data = [histogramTrace, curveTrace];
  
    // Layout options
    const plotLayout = {
      title: 'Max. Run Histogram',
      xaxis: { title: 'Run Length' },
      yaxis: { title: 'Frequency' },
      showlegend: false,
    };

  if (window.innerWidth <= 767) {
    plotLayout.yaxis.title = '';
    plotLayout.margin = {l : 0, r : 0};
  }
  
    // Generate the Plotly chart
    Plotly.newPlot('plotlyDiv', data, plotLayout);
}
  

generateHistogram();

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  window.addEventListener("resize", debounce(function() {
    if (document.getElementById("CoinToss").style.display === "block") {
      // Redraw the coin toss plot
      Plotly.relayout('plotlyDiv', {
        'xaxis.autorange': true,
        'yaxis.autorange': true
      });
      generateHistogram();
    } else if (document.getElementById("Clusters").style.display === "block") {
      // Redraw the clusters plot
      generateClusters();
    }
  }, 250));  // 250 milliseconds delay

function updateValueAndHistogram(event) {
    const output = document.getElementById(event.target.id + "Value");
    output.value = event.target.value;
    generateHistogram();
  }
  
  // Add event listeners for swipe-friendly controls
  document.querySelectorAll('.swipe-control').forEach((input) => {
    input.addEventListener('input', (event) => {
      // Update output value but don't regenerate histogram
      const output = document.getElementById(event.target.id + "-output");
      output.value = event.target.value;
    });
  
    input.addEventListener('change', updateValueAndHistogram);  // Regenerate histogram on change
  });


  function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

  if (tabName === 'Clusters') {
    generateClusters();
  }
  }

  
  // Show the first tab by default
document.getElementById("CoinToss").style.display = "block";




/****************
 * 
 *  Cluster stuff
 * 
 ******************/

// Global variables to store cluster data
let redX, redY, blueX, blueY, numDiseasePoints;

if (window.innerWidth <= 767) {
  numDiseasePoints = 500;  // For mobile screens
} else {
  numDiseasePoints = 1000;  // For desktop screens
}

// Generate data when the document is loaded
document.addEventListener("DOMContentLoaded", function() {
  redX = Array.from({ length: numDiseasePoints }, () => Math.random());
  redY = Array.from({ length: numDiseasePoints }, () => Math.random());
  blueX = Array.from({ length: 10 }, () => Math.random());
  blueY = Array.from({ length: 10 }, () => Math.random());
});

function generateClusters() {
  // Create the trace for disease cases
  const redTrace = {
    x: redX,
    y: redY,
    mode: 'markers',
    type: 'scatter',
    marker: { color: 'red', size: 6 },
    name: 'Disease'
  };

  // Create the trace for factories
  const blueTrace = {
    x: blueX,
    y: blueY,
    mode: 'markers',
    type: 'scatter',
    marker: { color: 'blue', size: 12 },
    name: 'Factory'
  };

  // Combine the traces
  const data = [redTrace, blueTrace];

  // Layout options
  const layout = {
    xaxis: { showgrid: false, zeroline: false, showticklabels: false },
    yaxis: { showgrid: false, zeroline: false, showticklabels: false },
    showlegend: true,
    legend: {
      x: 0.9,  // x-position (1 means all the way to the right)
      xanchor: 'right',  // anchor point for x (left means the left side of the legend box will be at x)
      y: -0.2,  // y-position (1 means all the way to the top)
      yanchor: 'bottom'  // anchor point for y (bottom means the bottom of the legend box will be at y)
    },
    shapes: [
      {
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: 0,
        y0: 0,
        x1: 1,
        y1: 1,
        line: { color: 'black', width: 1 }
      }
    ],
    margin: {
      l: 0,
      r: 0,
    },
  };

  // Generate the Plotly chart
  Plotly.newPlot('clusterPlot', data, layout);
}

function toggleDropdown() {
  const content = document.getElementById("dropdown-content");
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}


// Show the first tab by default
document.getElementById("CoinToss").style.display = "block";
// Generate the initial cluster plot
generateClusters();

window.onload = function() {
  generateHistogram();  // Or whatever function you use to draw the chart
};
