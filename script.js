// Get elements
const inflowSlider = document.getElementById('inflowSlider');
const outflowSlider = document.getElementById('outflowSlider');
const shockInput = document.getElementById('shockInput');
const applyShockBtn = document.getElementById('applyShockBtn');

const inflowValue = document.getElementById('inflowValue');
const outflowValue = document.getElementById('outflowValue');
const svg = document.getElementById('stockFlowChart');

// Initialize state
let reserves = 100;

// Update values live
inflowSlider.addEventListener('input', () => {
  inflowValue.textContent = inflowSlider.value;
  inflowSlider.setAttribute('aria-valuenow', inflowSlider.value);
  updateChart();
});

outflowSlider.addEventListener('input', () => {
  outflowValue.textContent = outflowSlider.value;
  outflowSlider.setAttribute('aria-valuenow', outflowSlider.value);
  updateChart();
});

// Apply shock
applyShockBtn.addEventListener('click', () => {
  const shock = parseFloat(shockInput.value);
  if (!isNaN(shock) && shock >= 0) {
    reserves -= shock;
    if (reserves < 0) reserves = 0;
    updateChart();
  } else {
    alert('Please enter a valid non-negative number.');
  }
});

// Update chart (simple demo visualization)
function updateChart() {
  const inflow = parseFloat(inflowSlider.value);
  const outflow = parseFloat(outflowSlider.value);

  reserves += (inflow - outflow) * 0.1; // Simplified model
  if (reserves < 0) reserves = 0;

  renderChart(reserves);
}

// Draw bar chart (placeholder)
function renderChart(value) {
  svg.innerHTML = ''; // Clear previous
  const barHeight = Math.min(250, value * 2); 
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '250');
  rect.setAttribute('y', 300 - barHeight);
  rect.setAttribute('width', '100');
  rect.setAttribute('height', barHeight);
  rect.setAttribute('fill', '#00796b');
  svg.appendChild(rect);
}

// Initialize first chart
updateChart();
