document.addEventListener('DOMContentLoaded', () => {
  // --- STATE VARIABLES ---
  let stock = 100.0;
  const SIMULATION_INTERVAL = 1500; // in milliseconds

  // --- DOM ELEMENT REFERENCES ---
  // Controls
  const inflowSlider = document.getElementById('inflowSlider');
  const inflowValue = document.getElementById('inflowValue');
  const outflowSlider = document.getElementById('outflowSlider');
  const outflowValue = document.getElementById('outflowValue');
  const shockInput = document.getElementById('shockInput');
  const applyShockBtn = document.getElementById('applyShockBtn');

  // Scenarios
  const disasterBtn = document.getElementById('disasterBtn');
  const boomBtn = document.getElementById('boomBtn');
  const taxBtn = document.getElementById('taxBtn');

  // Display
  const stockDisplay = document.getElementById('stockDisplay');
  const stockRect = document.querySelector('#diagram rect'); // For visual feedback

  // --- INITIALIZATION ---
  
  /**
   * Updates the display text for a slider.
   * @param {HTMLInputElement} slider - The slider element.
   * @param {HTMLElement} valueDisplay - The element to show the value.
   */
  const updateSliderDisplay = (slider, valueDisplay) => {
    valueDisplay.textContent = slider.value;
  };

  /**
   * Updates the main stock display and the visual diagram.
   */
  const updateStockDisplay = () => {
    // Update the numerical display
    stockDisplay.textContent = stock.toFixed(1);

    // Update the visual size of the stock rectangle in the SVG
    // Clamp the scale between a min and max value for better visuals
    const scale = Math.max(0.1, Math.min(2, stock / 100));
    stockRect.style.transformOrigin = 'center';
    stockRect.style.transform = `scaleY(${scale})`;
    stockRect.style.transition = 'transform 0.5s ease';
  };
  
  // Set initial values from HTML
  updateSliderDisplay(inflowSlider, inflowValue);
  updateSliderDisplay(outflowSlider, outflowValue);
  updateStockDisplay();


  // --- EVENT LISTENERS ---

  // Listen for changes on the inflow slider
  inflowSlider.addEventListener('input', () => {
    updateSliderDisplay(inflowSlider, inflowValue);
  });

  // Listen for changes on the outflow slider
  outflowSlider.addEventListener('input', () => {
    updateSliderDisplay(outflowSlider, outflowValue);
  });

  // Apply a one-time shock
  applyShockBtn.addEventListener('click', () => {
    const shockAmount = parseFloat(shockInput.value);
    if (!isNaN(shockAmount)) {
      stock += shockAmount;
      if (stock < 0) stock = 0; // Prevent stock from going negative
      updateStockDisplay();
      shockInput.value = ''; // Clear the input
    }
  });

  // --- SCENARIO BUTTONS ---

  // Disaster Shock: Massive one-time expenditure, reduced inflow for a period
  disasterBtn.addEventListener('click', () => {
    stock -= 50; // Immediate hit from the disaster
    if (stock < 0) stock = 0;
    
    inflowSlider.value = 10; // Inflow drops
    outflowSlider.value = 60; // Outflow increases
    
    updateSliderDisplay(inflowSlider, inflowValue);
    updateSliderDisplay(outflowSlider, outflowValue);
    updateStockDisplay();
    
    // Reset to normal after a delay
    setTimeout(() => {
        inflowSlider.value = 50;
        outflowSlider.value = 40;
        updateSliderDisplay(inflowSlider, inflowValue);
        updateSliderDisplay(outflowSlider, outflowValue);
    }, 8000);
  });

  // Business Boom: Increased inflow
  boomBtn.addEventListener('click', () => {
    inflowSlider.value = 75;
    outflowSlider.value = 45; // More business might mean slightly more expenditure
    updateSliderDisplay(inflowSlider, inflowValue);
    updateSliderDisplay(outflowSlider, outflowValue);
  });

  // New Tax Policy: Slightly higher inflow, slightly higher outflow (admin costs)
  taxBtn.addEventListener('click', () => {
    inflowSlider.value = 58;
    outflowSlider.value = 42;
    updateSliderDisplay(inflowSlider, inflowValue);
    updateSliderDisplay(outflowSlider, outflowValue);
  });


  // --- SIMULATION LOOP ---

  /**
   * The core logic that runs at each time step of the simulation.
   */
  const runSimulationStep = () => {
    const currentInflowRate = parseFloat(inflowSlider.value) / 100;
    const currentOutflowRate = parseFloat(outflowSlider.value) / 100;

    // For this model, let's assume rates are a percentage of a base income/expenditure,
    // not a percentage of the current stock, which is more stable.
    // Let's define a base value, e.g., 50 units.
    const baseFlowValue = 50; 
    
    const inflowAmount = baseFlowValue * currentInflowRate;
    const outflowAmount = baseFlowValue * currentOutflowRate;

    const netChange = inflowAmount - outflowAmount;
    
    stock += netChange;

    // Ensure stock doesn't fall below zero
    if (stock < 0) {
      stock = 0;
    }

    updateStockDisplay();
  };

  // Start the simulation loop
  setInterval(runSimulationStep, SIMULATION_INTERVAL);
});
