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
    console.log(`Mean Maximum Run Length: ${meanMaxRun}`);
  
    const trace = {
      x: maxRunLengths,
      type: 'histogram',
    };
    const layout = {
      title: 'Histogram of Maximum Run Lengths',
      xaxis: { title: 'Maximum Run Length' },
      yaxis: { title: 'Frequency' },
    };
    Plotly.newPlot('plotlyDiv', [trace], layout);
  }
  