const API = "https://aios-web-vyta.onrender.com/step";

const out = document.getElementById("out");

async function fetchAI() {
  try {
    const res = await fetch(API);

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      out.innerText = JSON.stringify(data, null, 2);
    } catch (e) {
      out.innerText = "NOT JSON:\n" + text;
    }

  } catch (err) {
    out.innerText = "FETCH ERROR: " + err;
  }
}

// ⛑ đảm bảo DOM load xong mới chạy
window.onload = () => {
  fetchAI();
  setInterval(fetchAI, 1000);
};
