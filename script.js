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
const scenario1Label = document.getElementById('scenario1Label');
const scenario2Label = document.getElementById('scenario2Label');
const scenario3Label = document.getElementById('scenario3Label');
const scenario1Btn = document.getElementById('scenario1Btn');
const scenario2Btn = document.getElementById('scenario2Btn');
const scenario3Btn = document.getElementById('scenario3Btn');

// Display
const stockDisplay = document.getElementById('stockDisplay');
const stockRect = document.querySelector('#diagram .stock-rect');

// --- INITIALIZATION ---
const updateSliderDisplay = (slider, valueDisplay) => {
valueDisplay.textContent = slider.value;
};

const updateStockDisplay = () => {
stockDisplay.textContent = stock.toFixed(1);
const scale = Math.max(0.1, Math.min(2, stock / 1000)); // Base stock is 1000
stockRect.style.transformOrigin = 'center';
stockRect.style.transform = scaleY(${scale});
stockRect.style.transition = 'transform 0.5s ease';
};

// Set initial UI states
updateSliderDisplay(inflowSlider, inflowValue);
updateSliderDisplay(outflowSlider, outflowValue);
updateStockDisplay();
scenario1Btn.textContent = scenario1Label.value;
scenario2Btn.textContent = scenario2Label.value;
scenario3Btn.textContent = scenario3Label.value;

// --- EVENT LISTENERS FOR DYNAMIC LABELS ---

inflowLabelInput.addEventListener('input', () => {
inflowTextSVG.textContent = inflowLabelInput.value;
});

outflowLabelInput.addEventListener('input', () => {
outflowTextSVG.textContent = outflowLabelInput.value;
});

scenario1Label.addEventListener('input', () => {
scenario1Btn.textContent = scenario1Label.value;
});
scenario2Label.addEventListener('input', () => {
scenario2Btn.textContent = scenario2Label.value;
});
scenario3Label.addEventListener('input', () => {
scenario3Btn.textContent = scenario3Label.value;
});

// --- EVENT LISTENERS FOR CONTROLS ---

inflowSlider.addEventListener('input', () => updateSliderDisplay(inflowSlider, inflowValue));
outflowSlider.addEventListener('input', () => updateSliderDisplay(outflowSlider, outflowValue));

applyShockBtn.addEventListener('click', () => {
const shockAmount = parseFloat(shockInput.value);
if (!isNaN(shockAmount)) {
stock += shockAmount;
if (stock < 0) stock = 0;
updateStockDisplay();
shockInput.value = '';
}
});

// --- SCENARIOS ---

scenario1Btn.addEventListener('click', () => {
stock -= 300; // Disaster
if (stock < 0) stock = 0;
inflowSlider.value = 15;
outflowSlider.value = 70;
updateSliderDisplay(inflowSlider, inflowValue);
updateSliderDisplay(outflowSlider, outflowValue);
updateStockDisplay();
});

scenario2Btn.addEventListener('click', () => {
inflowSlider.value = 75; // Boom
outflowSlider.value = 50;
updateSliderDisplay(inflowSlider, inflowValue);
updateSliderDisplay(outflowSlider, outflowValue);
});

scenario3Btn.addEventListener('click', () => {
inflowSlider.value = 58; // Policy
outflowSlider.value = 42;
updateSliderDisplay(inflowSlider, inflowValue);
updateSliderDisplay(outflowSlider, outflowValue);
});

// --- SIMULATION LOOP ---
const runSimulationStep = () => {
const currentInflowRate = parseFloat(inflowSlider.value) / 100;
const currentOutflowRate = parseFloat(outflowSlider.value) / 100;

const baseFlowValue = 50; 
const inflowAmount = baseFlowValue * currentInflowRate;
const outflowAmount = baseFlowValue * currentOutflowRate;
const netChange = inflowAmount - outflowAmount;

stock += netChange;
if (stock < 0) stock = 0;

updateStockDisplay();
};

setInterval(runSimulationStep, SIMULATION_INTERVAL);
});
