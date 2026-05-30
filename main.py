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

STATE = {
    "t": 0,
    "energy": 1.0,
    "awareness": 0.1,
    "feedback": 0.0
}

#def evolve(state):
 #   t = state["t"] + 1
#
 #   noise = random.uniform(-0.1, 0.1)

  #  energy = abs(math.sin(t / 5) + noise + state["feedback"])

   # awareness = state["awareness"] + energy * 0.03
 #   awareness = min(1.0, awareness)
#
  #  feedback = energy * 0.2

   # return {
    #    "t": t,
     #   "energy": energy,
      #  "awareness": awareness,
       # "feedback": feedback
   # }
def evolve(state):
    t = state["t"] + 1

    energy = abs(
        __import__("math").sin(t / 5)
        + __import__("random").uniform(-0.1, 0.1)
        + state["feedback"]
    )

    awareness = state["awareness"] + energy * 0.03
    awareness = min(1.0, awareness)

    feedback = energy * 0.2

    return {
        "t": t,
        "energy": energy,
        "awareness": awareness,
        "feedback": feedback
    }
@app.get("/step")
def step():
    global STATE
    STATE = evolve(STATE)

    return {
        "state": STATE,
        "tai_dng": STATE["t"] + STATE["awareness"] * 10,
        "timestamp": time.time()
    }

@app.get("/")
def root():
    return {"status": "AIOS LIVE"}
