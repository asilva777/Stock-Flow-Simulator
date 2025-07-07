// --- DOM ELEMENT REFERENCES ---
// Labels
const inflowLabelInput = document.getElementById('inflowLabelInput');
const outflowLabelInput = document.getElementById('outflowLabelInput');
const inflowTextSVG = document.getElementById('inflowTextSVG');
const outflowTextSVG = document.getElementById('outflowTextSVG');

// Sliders & Shock
const inflowSlider = document.getElementById('inflowSlider');
const inflowValue = document.getElementById('inflowValue');
const outflowSlider = document.getElementById('outflowSlider');
const outflowValue = document.getElementById('outflowValue');
const shockInput = document.getElementById('shockInput');
const applyShockBtn = document.getElementById('applyShockBtn');

// Scenarios
const scenarioLabels = [
  document.getElementById('scenario1Label'),
  document.getElementById('scenario2Label'),
  document.getElementById('scenario3Label')
];
const scenarioButtons = [
  document.getElementById('scenario1Btn'),
  document.getElementById('scenario2Btn'),
  document.getElementById('scenario3Btn')
];

// Display
const stockDisplay = document.getElementById('stockDisplay');
const stockRect = document.querySelector('#diagram .stock-rect');

// --- SIMULATION VARIABLES ---
let stock = 1000;
const SIMULATION_INTERVAL = 1000; // milliseconds
const BASE_FLOW_VALUE = 50;

// --- UTILITY FUNCTIONS ---
function updateSliderDisplay(slider, valueDisplay) {
  valueDisplay.textContent = slider.value;
}

function updateStockDisplay() {
  stockDisplay.textContent = stock.toFixed(1);
  const scale = Math.max(0.1, Math.min(2, stock / 1000));
  stockRect.style.transformOrigin = 'center';
  stockRect.style.transform = `scaleY(${scale})`;
  stockRect.style.transition = 'transform 0.5s ease';
}

function applyShock(amount) {
  if (!isNaN(amount)) {
    stock += amount;
    if (stock < 0) stock = 0;
    updateStockDisplay();
  }
}

// --- INITIALIZATION ---
updateSliderDisplay(inflowSlider, inflowValue);
updateSliderDisplay(outflowSlider, outflowValue);
updateStockDisplay();

// Set initial scenario button labels
scenarioLabels.forEach((label, index) => {
  scenarioButtons[index].textContent = label.value;
});

// --- EVENT LISTENERS ---
// Dynamic label updates
inflowLabelInput.addEventListener('input', () => {
  inflowTextSVG.textContent = inflowLabelInput.value;
});
outflowLabelInput.addEventListener('input', () => {
  outflowTextSVG.textContent = outflowLabelInput.value;
});
scenarioLabels.forEach((label, index) => {
  label.addEventListener('input', () => {
    scenarioButtons[index].textContent = label.value;
  });
});

// Slider updates
inflowSlider.addEventListener('input', () => updateSliderDisplay(inflowSlider, inflowValue));
outflowSlider.addEventListener('input', () => updateSliderDisplay(outflowSlider, outflowValue));

// Apply shock
applyShockBtn.addEventListener('click', () => {
  const shockAmount = parseFloat(shockInput.value);
  applyShock(shockAmount);
  shockInput.value = '';
});

// Scenario buttons
scenarioButtons[0].addEventListener('click', () => {
  stock -= 300; // Disaster
  if (stock < 0) stock = 0;
  inflowSlider.value = 15;
  outflowSlider.value = 70;
  updateSliderDisplay(inflowSlider, inflowValue);
  updateSliderDisplay(outflowSlider, outflowValue);
  updateStockDisplay();
});
scenarioButtons[1].addEventListener('click', () => {
  inflowSlider.value = 75; // Boom
  outflowSlider.value = 50;
  updateSliderDisplay(inflowSlider, inflowValue);
  updateSliderDisplay(outflowSlider, outflowValue);
});
scenarioButtons[2].addEventListener('click', () => {
  inflowSlider.value = 58; // Policy
  outflowSlider.value = 42;
  updateSliderDisplay(inflowSlider, inflowValue);
  updateSliderDisplay(outflowSlider, outflowValue);
});

// --- SIMULATION LOOP ---
function runSimulationStep() {
  const inflowRate = parseFloat(inflowSlider.value) / 100;
  const outflowRate = parseFloat(outflowSlider.value) / 100;

  const inflowAmount = BASE_FLOW_VALUE * inflowRate;
  const outflowAmount = BASE_FLOW_VALUE * outflowRate;
  const netChange = inflowAmount - outflowAmount;

  stock += netChange;
  if (stock < 0) stock = 0;

  updateStockDisplay();
}

setInterval(runSimulationStep, SIMULATION_INTERVAL);
