from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import math
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 STATE SYSTEM
STATE = {
    "t": 0,
    "energy": 1.0,
    "awareness": 0.1,
    "feedback": 0.0
}

# ⚙️ EVOLUTION ENGINE
def evolve(state):
    t = state["t"] + 1

    noise = random.uniform(-0.2, 0.2)

    energy = abs(math.sin(t / 5) + noise + state["feedback"])

    awareness = min(1.0, state["awareness"] + 0.02 * energy)

    feedback = energy * 0.3

    return {
        "t": t,
        "energy": energy,
        "awareness": awareness,
        "feedback": feedback
    }

# 🚀 API STEP
@app.get("/step")
def step():
    global STATE
    STATE = evolve(STATE)
    return {
    "state": {
        "t": t,
        "energy": energy,
        "awareness": awareness,
        "feedback": feedback
    }
}
