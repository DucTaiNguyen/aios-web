const API = "https://aios-web-vyta.onrender.com/step";

let auto = false;
let chart;

function initChart() {
  const canvas = document.getElementById("chart");

  if (!canvas) {
    console.error("NO CHART CANVAS FOUND");
    return;
  }

  const ctx = canvas.getContext("2d");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "AIOS Awareness",
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

function updateChart(value) {
  if (!chart) {
    console.log("Chart not ready");
    return;
  }

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
  if (logBox) {
    logBox.innerHTML += msg + "<br>";
  }
}

async function run() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    const s = data.state;

    document.getElementById("out").innerText =
      JSON.stringify(data, null, 2);

    document.getElementById("energy").innerText =
      s.energy.toFixed(3);

    document.getElementById("awareness").innerText =
      s.awareness.toFixed(3);

    document.getElementById("time").innerText =
      s.t;

    updateChart(s.awareness);

    log("STEP t=" + s.t);

  } catch (err) {
    console.error(err);
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
