// --- MODULE: StockFlowSimulator ---
class StockFlowSimulator {
  constructor() {
    this.stock = parseFloat(localStorage.getItem('stock')) || 1000;
    this.interval = parseInt(localStorage.getItem('interval')) || 1000;
    this.running = true;
    this.history = [];

    this.cacheElements();
    this.bindEvents();
    this.initUI();
    this.startSimulation();
  }

  cacheElements() {
    this.inflowSlider = document.getElementById('inflowSlider');
    this.outflowSlider = document.getElementById('outflowSlider');
    this.inflowValue = document.getElementById('inflowValue');
    this.outflowValue = document.getElementById('outflowValue');
    this.stockDisplay = document.getElementById('stockDisplay');
    this.stockRect = document.querySelector('#diagram .stock-rect');
    this.shockInput = document.getElementById('shockInput');
    this.applyShockBtn = document.getElementById('applyShockBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.intervalInput = document.getElementById('intervalInput');
    this.toast = document.getElementById('toast');
    this.chartCanvas = document.getElementById('stockChart');
    this.exportBtn = document.getElementById('exportBtn');
  }

  bindEvents() {
    this.inflowSlider.addEventListener('input', () => this.updateSliderDisplay(this.inflowSlider, this.inflowValue));
    this.outflowSlider.addEventListener('input', () => this.updateSliderDisplay(this.outflowSlider, this.outflowValue));
    this.applyShockBtn.addEventListener('click', () => this.applyShock());
    this.pauseBtn.addEventListener('click', () => this.toggleSimulation());
    this.intervalInput.addEventListener('change', () => this.updateInterval());
    this.exportBtn.addEventListener('click', () => this.exportData());
  }

  initUI() {
    this.updateSliderDisplay(this.inflowSlider, this.inflowValue);
    this.updateSliderDisplay(this.outflowSlider, this.outflowValue);
    this.updateStockDisplay();
    this.initChart();
  }

  updateSliderDisplay(slider, valueDisplay) {
    valueDisplay.textContent = slider.value;
  }

  updateStockDisplay() {
    this.stockDisplay.textContent = this.stock.toFixed(1);
    const scale = Math.max(0.1, Math.min(2, this.stock / 1000));
    this.stockRect.style.transformOrigin = 'center';
    this.stockRect.style.transform = `scaleY(${scale})`;
    this.stockRect.style.transition = 'transform 0.5s ease';
    localStorage.setItem('stock', this.stock);
  }

  applyShock() {
    const shockAmount = parseFloat(this.shockInput.value);
    if (!isNaN(shockAmount)) {
      this.stock += shockAmount;
      if (this.stock < 0) this.stock = 0;
      this.updateStockDisplay();
      this.showToast(`Shock of ${shockAmount} applied.`);
      this.shockInput.value = '';
    }
  }

  toggleSimulation() {
    this.running = !this.running;
    this.pauseBtn.textContent = this.running ? 'Pause' : 'Resume';
  }

  updateInterval() {
    const newInterval = parseInt(this.intervalInput.value);
    if (!isNaN(newInterval) && newInterval > 0) {
      this.interval = newInterval;
      localStorage.setItem('interval', this.interval);
      clearInterval(this.simulationTimer);
      this.startSimulation();
      this.showToast(`Interval set to ${this.interval} ms`);
    }
  }

  startSimulation() {
    this.simulationTimer = setInterval(() => {
      if (this.running) this.runSimulationStep();
    }, this.interval);
  }

  runSimulationStep() {
    const inflowRate = parseFloat(this.inflowSlider.value) / 100;
    const outflowRate = parseFloat(this.outflowSlider.value) / 100;
    const baseFlow = 50;
    const inflow = baseFlow * inflowRate;
    const outflow = baseFlow * outflowRate;
    const net = inflow - outflow;

    this.stock += net;
    if (this.stock < 0) this.stock = 0;
    this.updateStockDisplay();
    this.updateChart();
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('visible');
    setTimeout(() => this.toast.classList.remove('visible'), 3000);
  }

  initChart() {
    this.chart = new Chart(this.chartCanvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Stock Level',
          data: [],
          borderColor: '#0D47A1',
          fill: false
        }]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          x: { display: false },
          y: { beginAtZero: true }
        }
      }
    });
  }

  updateChart() {
    const timestamp = new Date().toLocaleTimeString();
    this.chart.data.labels.push(timestamp);
    this.chart.data.datasets[0].data.push(this.stock.toFixed(1));
    if (this.chart.data.labels.length > 50) {
      this.chart.data.labels.shift();
      this.chart.data.datasets[0].data.shift();
    }
    this.chart.update();
  }

  exportData() {
    const rows = this.chart.data.labels.map((label, i) => `${label},${this.chart.data.datasets[0].data[i]}`);
    const csvContent = "data:text/csv;charset=utf-8,Time,Stock\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// --- INITIALIZE SIMULATOR ---
document.addEventListener('DOMContentLoaded', () => {
  new StockFlowSimulator();
});
