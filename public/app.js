const API = "https://YOUR-BACKEND.onrender.com/step";

async function run(){

  const res = await fetch(API);

  const data = await res.json();

  document.getElementById("out").innerText =
    JSON.stringify(data, null, 2);
}
