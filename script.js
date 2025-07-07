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


-----

### 4\. `manifest.json`

This file allows the application to be installed on a user's device, providing a native-app-like experience. You will need to create `icon-192.png` and `icon-512.png` images and place them in your project directory.

&lt;immersive type=&quot;code&quot; title=&quot;manifest.json&quot;&gt;
```json
{
  &quot;name&quot;: &quot;Dynamic Stock &amp; Flow Simulator&quot;,
  &quot;short_name&quot;: &quot;StockSim&quot;,
  &quot;description&quot;: &quot;A PWA for modeling financial systems with customizable labels.&quot;,
  &quot;start_url&quot;: &quot;.&quot;,
  &quot;display&quot;: &quot;standalone&quot;,
  &quot;background_color&quot;: &quot;#f0f4f8&quot;,
  &quot;theme_color&quot;: &quot;#0D47A1&quot;,
  &quot;icons&quot;: [
    {
      &quot;src&quot;: &quot;icon-192.png&quot;,
      &quot;type&quot;: &quot;image/png&quot;,
      &quot;sizes&quot;: &quot;192x192&quot;
    },
    {
      &quot;src&quot;: &quot;icon-512.png&quot;,
      &quot;type&quot;: &quot;image/png&quot;,
      &quot;sizes&quot;: &quot;512x512&quot;
    }
  ]
}
```

-----

### 5\. `service-worker.js`

This script enables the PWA to work offline by caching the essential files.

&lt;immersive type=&quot;code&quot; title=&quot;service-worker.js&quot;&gt;
```javascript
const CACHE_NAME = &#39;stock-flow-simulator-v1&#39;;
const urlsToCache = [
  &#39;.&#39;,
  &#39;index.html&#39;,
  &#39;style.css&#39;,
  &#39;script.js&#39;,
  &#39;icon-192.png&#39;,
  &#39;icon-512.png&#39;
];

// Install the service worker and cache the app shell
self.addEventListener('install', event =\> {
event.waitUntil(
caches.open(CACHE\_NAME)
.then(cache =\> {
console.log('Opened cache');
return cache.addAll(urlsToCache);
})
);
});

// Fetch assets from cache or network
self.addEventListener('fetch', event =\> {
event.respondWith(
caches.match(event.request)
.then(response =\> {
// Cache hit - return response
if (response) {
return response;
}
// Not in cache - fetch from network
return fetch(event.request);
}
)
);
});

// Clean up old caches
self.addEventListener('activate', event =\> {
const cacheWhitelist = [CACHE\_NAME];
event.waitUntil(
caches.keys().then(cacheNames =\> {
return Promise.all(
cacheNames.map(cacheName =\> {
if (cacheWhitelist.indexOf(cacheName) === -1) {
return caches.delete(cacheName);
}
})
);
})
);
});
