const API = "https://YOUR-BACKEND.onrender.com/step";

async function run() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("out").innerText =
      JSON.stringify(data, null, 2);

  } catch (err) {
    document.getElementById("out").innerText =
      "ERROR: " + err;
  }
}
