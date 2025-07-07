// Tooltip logic for SVG flow arrows
const tooltip = document.getElementById('tooltip');
document.querySelectorAll('svg .flow-arrow').forEach(el => {
  el.addEventListener('mouseover', e => {
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.opacity = '1';
  });
  el.addEventListener('mousemove', e => {
    tooltip.style.top = (e.pageY + 10) + 'px';
    tooltip.style.left = (e.pageX + 10) + 'px';
  });
  el.addEventListener('mouseout', () => { tooltip.style.opacity = '0'; });
});

// Element references
const inflowSlider = document.getElementById('inflowSlider');
const outflowSlider = document.getElementById('outflowSlider');
const collectionSlider = document.getElementById('collectionSlider');
const spendGrowthSlider = document.getElementById('spendGrowthSlider');
const shockInput = document.getElementById('shockInput');
const applyShockBtn = document.getElementById('applyShock');

const inflowLabel = document.getElementById('inflowLabel');
const outflowLabel = document.getElementById('outflowLabel');
const stockValueEl = document.getElementById('stockValue');
const readoutStockEl = document.getElementById('readoutStock');

// Value displays
const inflowValue = document.getElementById('inflowValue');
const outflowValue = document.getElementById('outflowValue');
const collectionValue = document.getElementById('collectionValue');
const spendGrowthValue = document.getElementById('spendGrowthValue');

// Initialize variables
let stock = 100.0;
let baseInflow = parseFloat(inflowSlider.value);
let baseOutflow = parseFloat(outflowSlider.value);
let inflow = baseInflow;
let outflow = baseOutflow;
let collectionRate = parseFloat(collectionSlider.value) / 100;
let spendGrowth = parseFloat(spendGrowthSlider.value) / 100;
let shock = 0;

// Update display for slider values
function updateSliderDisplays() {
  inflowValue.textContent = inflowSlider.value;
  outflowValue.textContent = outflowSlider.value;
  collectionValue.textContent = collectionSlider.value;
  spendGrowthValue.textContent = spendGrowthSlider.value;
}
updateSliderDisplays();

// Slider event handlers
inflowSlider.oninput = () => {
  baseInflow = parseFloat(inflowSlider.value);
  updateSliderDisplays();
  updateLabels();
};
outflowSlider.oninput = () => {
  baseOutflow = parseFloat(outflowSlider.value);
  updateSliderDisplays();
  updateLabels();
};
collectionSlider.oninput = () => {
  collectionRate = parseFloat(collectionSlider.value) / 100;
  updateSliderDisplays();
  updateLabels();
};
spendGrowthSlider.oninput = () => {
  spendGrowth = parseFloat(spendGrowthSlider.value) / 100;
  updateSliderDisplays();
  updateLabels();
};

function updateLabels() {
  inflow = baseInflow * collectionRate;
  inflowLabel.textContent = `Income: ${inflow.toFixed(1)}`;
  outflowLabel.textContent = `Spending: ${outflow.toFixed(1)}`;
}

// Apply shock button
applyShockBtn.onclick = () => {
  let val = parseFloat(shockInput.value) || 0;
  if (val > 0) {
    shock += val;
    shockInput.value = 0;
  }
};

// Stock update logic
function updateStock() {
  const dt = 1; // 1 time unit per tick (e.g., year)
  inflow = baseInflow * collectionRate;
  outflow = outflow * (1 + spendGrowth * dt); // compound spending growth
  stock += (inflow - outflow) * dt - shock;
  if (stock < 0) stock = 0;
  stockValueEl.textContent = stock.toFixed(1);
  readoutStockEl.textContent = stock.toFixed(1);
  inflowLabel.textContent = `Income: ${inflow.toFixed(1)}`;
  outflowLabel.textContent = `Spending: ${outflow.toFixed(1)}`;
  shock = 0; // Reset shock after applying
}

// Reset the outflow to base for each new tick (avoid compounding indefinitely)
function resetOutflowToBase() {
  outflow = baseOutflow;
}

// Simulation step (every 1.2 seconds)
setInterval(() => {
  resetOutflowToBase();
  updateStock();
}, 1200);

// Scenario button logic
window.simScenario = function(type) {
  switch (type) {
    case 'improveCollection':
      collectionSlider.value = Math.min(110, parseInt(collectionSlider.value) + 10);
      collectionSlider.oninput();
      break;
    case 'iraCut':
      collectionSlider.value = Math.max(50, parseInt(collectionSlider.value) - 20);
      collectionSlider.oninput();
      break;
    case 'spendGrowth':
      spendGrowthSlider.value = 10;
      spendGrowthSlider.oninput();
      break;
    case 'disasterShock':
      shockInput.value = 50;
      applyShockBtn.onclick();
      break;
    default: break;
  }
  updateSliderDisplays();
  updateLabels();
};

// Initial label update
updateLabels();
