from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
import os

# Import the manager
import docker_manager

load_dotenv()

app = FastAPI(title="LogicLock Control Plane")

# ... existing CORS setup ...
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class LabRequest(BaseModel):
    image: str = "nginx:alpine" # Default lightweight image for testing

class StopRequest(BaseModel):
    container_id: str

# --- Routes ---

@app.get("/")
async def health_check():
    return {"status": "online", "system": "LogicLock Core"}

@app.post("/lab/start")
async def start_lab_endpoint(req: LabRequest):
    try:
        result = docker_manager.start_lab(req.image)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/lab/stop")
async def stop_lab_endpoint(req: StopRequest):
    result = docker_manager.stop_lab(req.container_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result.get("message"))
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)