from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import math
import random

app = FastAPI()

# 🌐 CORS (cho GitHub Pages + browser gọi API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 AIOS STATE (OBJECT - QUAN TRỌNG)
STATE = {
    "t": 0,
    "energy": 1.0,
    "awareness": 0.1,
    "feedback": 0.0
}

# ⚙️ EVOLUTION ENGINE
def evolve(state):
    t = state["t"] + 1

    # noise system (tạo dao động giống “AI sống”)
    noise = random.uniform(-0.15, 0.15)

    # energy dynamics (phi tuyến)
    energy = abs(math.sin(t / 5) + noise + state["feedback"])

    # awareness tăng dần theo energy
    awareness = state["awareness"] + (0.02 * energy)
    awareness = min(1.0, awareness)

    # feedback loop (self-adjusting system)
    feedback = energy * 0.25

    return {
        "t": t,
        "energy": energy,
        "awareness": awareness,
        "feedback": feedback
    }

# 🚀 MAIN API
@app.get("/step")
def step():
    global STATE

    STATE = evolve(STATE)

    return {
        "state": STATE,
        "tai_dng": STATE["t"] * 1.1 + STATE["awareness"] * 10
