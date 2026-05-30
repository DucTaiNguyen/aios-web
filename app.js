const API = "https://aios-web-vyta.onrender.com/step";

let auto = false;

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.innerHTML += msg + "<br>";
  logBox.scrollTop = logBox.scrollHeight;
}

async function run() {
  const res = await fetch(API);
  const data = await res.json();

  // CORE PANEL
  document.getElementById("out").innerText =
    JSON.stringify(data, null, 2);

  // METRICS
  document.getElementById("energy").innerText =
    data.state.energy.toFixed(3);

  document.getElementById("awareness").innerText =
    data.state.awareness.toFixed(3);

  document.getElementById("time").innerText =
    data.state.t;

  // LOG
  log("STEP EXECUTED | t=" + data.state.t);
}

function toggleAuto() {
  auto = !auto;
  log("AUTO MODE: " + (auto ? "ON" : "OFF"));

  if (auto) {
    loop();
  }
}

function loop() {
  if (!auto) return;
  run();
  setTimeout(loop, 1000);
}

// init
run();
