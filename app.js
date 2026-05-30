const API = "https://aios-web-vyta.onrender.com/step";

let auto = false;
let history = [];

const ctx = document.createElement("canvas");
let chart;

function initChart() {
  const c = document.getElementById("chart").getContext("2d");

  chart = new Chart(c, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "AIOS Awareness",
        data: [],
        borderColor: "#00ffcc",
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: false }
      }
    }
  });
}

function updateChart(value) {
  if (!chart) return;

  chart.data.labels.push("");
  chart.data.datasets[0].data.push(value);

  if (chart.data.datasets[0].data.length > 30) {
    chart.data.datasets[0].data.shift();
    chart.data.labels.shift();
  }

  chart.update();
}

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.innerHTML += msg + "<br>";
  logBox.scrollTop = logBox.scrollHeight;
}

async function run() {
  const res = await fetch(API);
  const data = await res.json();

  const state = data.state;

  // CORE PANEL
  document.getElementById("out").innerText =
    JSON.stringify(data, null, 2);

  // METRICS
  document.getElementById("energy").innerText =
    state.energy.toFixed(3);

  document.getElementById("awareness").innerText =
    state.awareness.toFixed(3);

  document.getElementById("time").innerText =
    state.t;

  // GRAPH
  updateChart(state.awareness);

  // LOG
  log(`STEP t=${state.t} | E=${state.energy.toFixed(2)} | A=${state.awareness.toFixed(2)}`);
}

function toggleAuto() {
  auto = !auto;
  log("AUTO MODE: " + (auto ? "ON" : "OFF"));
  if (auto) loop();
}

function loop() {
  if (!auto) return;
  run();
  setTimeout(loop, 1000);
}

window.onload = () => {
  initChart();
  run();
};
