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
      hoverinfro: 'y',
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
      title: 'Maximum Run Length Histogram',
      xaxis: { title: 'Run Length' },
      yaxis: { title: 'Frequency' },
      showlegend: false
    };
  
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
Plotly.relayout('plotlyDiv', {
    'xaxis.autorange': true,
    'yaxis.autorange': true
});
generateHistogram();
}, 250));  // 250 milliseconds delay