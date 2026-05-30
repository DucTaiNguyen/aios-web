const API = "https://aios-web-vyta.onrender.com/step";

async function fetchAI() {
  const out = document.getElementById("out");

  try {
    const res = await fetch(API);

    if (!res.ok) {
      out.innerText = "HTTP ERROR: " + res.status;
      return;
    }

    const data = await res.json();

    out.innerText = JSON.stringify(data, null, 2);

  } catch (err) {
    out.innerText = "ERROR: " + err;
  }
}

// ⚡ realtime loop
function startRealtime() {
  fetchAI(); // chạy ngay lần đầu
  setInterval(fetchAI, 1000); // mỗi 1 giây update
}

// auto start khi mở web
startRealtime();
