const inflowSlider = document.getElementById('inflowSlider');
const outflowSlider = document.getElementById('outflowSlider');
const shockInput = document.getElementById('shockInput');
const applyShockBtn = document.getElementById('applyShockBtn');
const inflowValue = document.getElementById('inflowValue');
const outflowValue = document.getElementById('outflowValue');
const svg = document.getElementById('stockFlowChart');

const disasterBtn = document.getElementById('disasterBtn');
const boomBtn = document.getElementById('boomBtn');
const taxBtn = document.getElementById('taxBtn');

let reserves = 100;
let history = [];

// update labels
inflowSlider.addEventListener('input', () => {
  inflowValue.textContent = inflowSlider.value;
});
outflowSlider.addEventListener('input', () => {
  outflowValue.textContent = outflowSlider.value;
});

// apply shock
applyShockBtn.addEventListener('click', () => {
  const shock = parseFloat(shockInput.value);
  if (!isNaN(shock) && shock >= 0) {
    reserves -= shock;
    if (reserves < 0) reserves = 0;
    addToHistory(reserves);
    renderChart();
  } else {
    alert('Enter a valid non-negative number.');
  }
});

// scenarios
disasterBtn.addEventListener('click', () => {
  reserves -= 20;
  if (reserves < 0) reserves = 0;
  addToHistory(reserves);
  renderChart();
});

boomBtn.addEventListener('click', () => {
  reserves += 15;
  addToHistory(reserves);
  renderChart();
});

taxBtn.addEventListener('click', () => {
  inflowSlider.value = parseInt(inflowSlider.value) + 10;
  inflowValue.textContent = inflowSlider.value;
});

// update reserves each second
function simulateStep() {
  const inflow = parseFloat(inflowSlider.value);
  const outflow = parseFloat(outflowSlider.value);
  reserves += (inflow - outflow) * 0.1;
  if (reserves < 0) reserves = 0;
  addToHistory(reserves);
  renderChart();
}

// draw chart
function renderChart() {
  svg.innerHTML = '';
  history.forEach((v, i) => {
    const barHeight = Math.max(0, Math.min(250, v * 2));
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', i * 20);
    rect.setAttribute('y', 300 - barHeight);
    rect.setAttribute('width', 15);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', '#00796b');
    svg.appendChild(rect);
  });
}

// add to history
function addToHistory(value) {
  history.push(value);
  if (history.length > 30) history.shift();
}

// loop
setInterval(simulateStep, 1000);

// init
addToHistory(reserves);
renderChart();
