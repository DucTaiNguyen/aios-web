const API = "https://aios-web-vyta.onrender.com/step";

let auto = false;
let chart;

// =====================
// 🧠 INIT CHART
// =====================
function initChart() {
  const canvas = document.getElementById("chart");

  if (!canvas) {
    console.error("❌ chart canvas not found");
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

// =====================
// 📊 UPDATE GRAPH
// =====================
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

// =====================
// 📡 LOG SYSTEM
// =====================
function log(msg) {
  const box = document.getElementById("log");
  if (!box) return;

  box.innerHTML += msg + "<br>";
  box.scrollTop = box.scrollHeight;
}

// =====================
// ⚙️ MAIN RUN STEP
// =====================
async function run() {
  try {
    const res = await fetch(API);

    const data = await res.json();

    console.log("AIOS DATA:", data);

    if (!data || !data.state) {
      console.error("❌ NO STATE DATA");
      return;
    }

    const s = data.state;

    // =====================
    // 🧠 SAFE PARSING (FIX ARRAY/OBJECT BUG)
    // =====================
    const energy = Array.isArray(s) ? s[0] : (s.energy ?? 0);
    const awareness = Array.isArray(s) ? s[1] : (s.awareness ?? 0);
    const t = Array.isArray(s) ? 0 : (s.t ?? 0);

    // =====================
    // 📊 UI UPDATE
    // =====================
    document.getElementById("energy").innerText =
      energy.toFixed(3);

    document.getElementById("awareness").innerText =
      awareness.toFixed(3);

    document.getElementById("time").innerText = t;

    document.getElementById("out").innerText =
      JSON.stringify(data, null, 2);

    // =====================
    // 📈 GRAPH
    // =====================
    updateChart(awareness);

    // =====================
    // 📡 LOG
    // =====================
    log(`STEP OK t=${t}`);

  } catch (err) {
    console.error("❌ FETCH ERROR:", err);

    document.getElementById("energy").innerText = "ERR";
    document.getElementById("awareness").innerText = "ERR";
    document.getElementById("time").innerText = "ERR";
  }
}

// =====================
// 🔁 AUTO MODE
// =====================
function toggleAuto() {
  auto = !auto;
  log(auto ? "AUTO MODE ON" : "AUTO MODE OFF");

  if (auto) loop();
}

function loop() {
  if (!auto) return;

  run();

  setTimeout(loop, 1000);
}

// =====================
// 🚀 INIT
// =====================
window.onload = () => {
  initChart();
  run();
};
