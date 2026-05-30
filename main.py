from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import sqlite3
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

# =========================
# 🧠 DATABASE SETUP
# =========================
conn = sqlite3.connect("aios.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS state (
    id INTEGER PRIMARY KEY,
    t INTEGER,
    energy REAL,
    awareness REAL,
    feedback REAL
)
""")

conn.commit()

# init nếu chưa có data
cursor.execute("SELECT COUNT(*) FROM state")
if cursor.fetchone()[0] == 0:
    cursor.execute("""
    INSERT INTO state (t, energy, awareness, feedback)
    VALUES (0, 1.0, 0.1, 0.0)
    """)
    conn.commit()

# =========================
# 🧠 LOAD STATE
# =========================
def load_state():
    cursor.execute("SELECT t, energy, awareness, feedback FROM state WHERE id=1")
    row = cursor.fetchone()
    return {
        "t": row[0],
        "energy": row[1],
        "awareness": row[2],
        "feedback": row[3]
    }

# =========================
# 💾 SAVE STATE
# =========================
def save_state(s):
    cursor.execute("""
    UPDATE state
    SET t=?, energy=?, awareness=?, feedback=?
    WHERE id=1
    """, (s["t"], s["energy"], s["awareness"], s["feedback"]))
    conn.commit()

# =========================
# 🧠 EVOLUTION ENGINE
# =========================
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

# =========================
# ⚡ API STEP
# =========================
@app.get("/step")
def step():
    state = load_state()
    new_state = evolve(state)
    save_state(new_state)

    return {
        "state": new_state,
        "timestamp": time.time()
    }
