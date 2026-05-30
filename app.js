const API = "https://aios-web-vyta.onrender.com/step";
const s = data.state;

// 🔥 FIX ARRAY vs OBJECT mismatch
const energy = Array.isArray(s) ? s[0] : s.energy;
const awareness = Array.isArray(s) ? s[1] : s.awareness;
const t = Array.isArray(s) ? 0 : s.t;
let auto = false;
let chart;
const s = data.state;

const energy = s.energy ?? s[0];
const awareness = s.awareness ?? s[1];
const t = s.t ?? 0;
function initChart() {
  const ctx = document.getElementById("chart").getContext("2d");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Awareness",
        data: [],
        borderColor: "#00ffcc",
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { display: false }
      }
    }
  });
}

function updateChart(v) {
  if (!chart) return;

  chart.data.labels.push("");
  chart.data.datasets[0].data.push(v);

  if (chart.data.datasets[0].data.length > 30) {
    chart.data.datasets[0].data.shift();
    chart.data.labels.shift();
  }

  chart.update();
}

function log(msg) {
  document.getElementById("log").innerHTML += msg + "<br>";
}

async function run() {
  try {
    const res = await fetch(API);

    const data = await res.json();

    console.log("API DATA:", data);

    if (!data || !data.state) {
      console.error("NO STATE");
      return;
    }

    const s = data.state;

    document.getElementById("energy").innerText =
      (s.energy ?? 0).toFixed(3);

    document.getElementById("awareness").innerText =
      (s.awareness ?? 0).toFixed(3);

    document.getElementById("time").innerText =
      s.t ?? 0;

    document.getElementById("out").innerText =
      JSON.stringify(data, null, 2);

    updateChart(s.awareness ?? 0);

    log("STEP OK t=" + (s.t ?? 0));

  } catch (err) {
    console.error("FETCH ERROR:", err);

    document.getElementById("energy").innerText = "ERR";
    document.getElementById("awareness").innerText = "ERR";
    document.getElementById("time").innerText = "ERR";
  }
}

function toggleAuto() {
  auto = !auto;
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
