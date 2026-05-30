from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# 🔓 cho phép web GitHub Pages gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/step")
def step():
    state = [random.random(), random.random(), random.random()]

    return {
        "state": state,
        "tai_dng": sum(state) * 10,
        "awareness": state[0]
    }
