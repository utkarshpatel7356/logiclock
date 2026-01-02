from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager  # <--- NEW IMPORT
from dotenv import load_dotenv
from pydantic import BaseModel
import asyncio
import os
import time

import docker_manager

load_dotenv()

# --- IN-MEMORY STATE FOR HEARTBEATS ---
active_labs = {}

# --- BACKGROUND TASKS ---
async def zombie_reaper():
    """Checks every 10 seconds for inactive labs"""
    print("💀 REAPER: Online and watching...")
    while True:
        await asyncio.sleep(10)
        now = time.time()
        # Create a list of IDs to remove to avoid modifying dict while iterating
        to_kill = [cid for cid, last_seen in active_labs.items() if now - last_seen > 15]
        
        for cid in to_kill:
            print(f"💀 REAPER: Lab {cid} timed out. Killing...")
            docker_manager.stop_lab(cid)
            del active_labs[cid]

# --- LIFESPAN HANDLER (Replaces @app.on_event) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # [STARTUP LOGIC]
    print("---------- SYSTEM STARTUP ----------")
    # 1. Nuke old containers on startup
    docker_manager.cleanup_orphans()
    # 2. Start the reaper background loop
    task = asyncio.create_task(zombie_reaper())
    
    yield  # <--- The application runs here
    
    # [SHUTDOWN LOGIC]
    print("---------- SYSTEM SHUTDOWN ----------")
    task.cancel() # Stop the reaper

# Initialize App with Lifespan
app = FastAPI(title="LogicLock Core", lifespan=lifespan)

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---

class LabRequest(BaseModel):
    image: str = "nginx:alpine"

class HeartbeatRequest(BaseModel):
    container_id: str

@app.get("/")
async def health():
    return {"status": "online", "active_labs": len(active_labs)}

@app.post("/lab/start")
async def start_lab(req: LabRequest):
    try:
        result = docker_manager.start_lab(req.image)
        # Register in heartbeat system
        active_labs[result["container_id"]] = time.time()
        print(f"⭐ NEW LAB: {result['container_id']}")
        return result
    except Exception as e:
        raise HTTPException(500, detail=str(e))

@app.post("/lab/heartbeat")
async def heartbeat(req: HeartbeatRequest):
    """Frontend calls this every 5s to keep lab alive"""
    if req.container_id in active_labs:
        active_labs[req.container_id] = time.time()
        return {"status": "alive"}
    return {"status": "unknown_lab"}

@app.post("/lab/stop")
async def stop_lab(req: HeartbeatRequest):
    docker_manager.stop_lab(req.container_id)
    if req.container_id in active_labs:
        del active_labs[req.container_id]
    return {"status": "stopped"}

if __name__ == "__main__":
    import uvicorn
    # Use the port from env, default to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)