import docker
import random
import time
from docker.errors import DockerException, NotFound

try:
    client = docker.from_env()
except DockerException:
    client = None

# Track active matches
# Structure: { "match_id": { "network": str, "target_id": str, "red_score": 0, "blue_score": 0 } }
active_matches = {}

def create_match(match_type="koth_redis"):
    """
    1. Creates a unique Docker Network.
    2. Spins up the Target (Redis) on that network.
    3. Returns the Match ID.
    """
    if not client: raise RuntimeError("Docker offline")

    match_id = f"match_{random.randint(1000, 9999)}"
    network_name = f"net_{match_id}"

    # 1. Create Isolated Network
    network = client.networks.create(network_name, driver="bridge")

    # 2. Start Target (Redis)
    # We expose NO ports to the host. It is only accessible inside the docker network.
    target = client.containers.run(
        "redis:alpine",
        name=f"target_{match_id}",
        network=network_name,
        detach=True,
        mem_limit="128m"
    )

    active_matches[match_id] = {
        "network": network_name,
        "target_id": target.id,
        "target_name": f"target_{match_id}",
        "red_score": 0,
        "blue_score": 0,
        "current_king": "NEUTRAL"
    }

    return {"match_id": match_id, "status": "created"}

def join_match(match_id, role):
    """
    Spins up a player container (Kali) attached to the specific Match Network.
    """
    if match_id not in active_matches:
        raise ValueError("Match not found")

    network_name = active_matches[match_id]["network"]
    container_name = f"{role}_{match_id}_{random.randint(100,999)}"

    # Spin up player container
    container = client.containers.run(
        "nginx:alpine", # Using nginx as 'kali' placeholder (has curl/sh)
        name=container_name,
        network=network_name,
        detach=True,
        mem_limit="256m"
    )

    # Hack: Install redis-tools inside the container so players can fight
    # In a real app, use a custom Kali image with tools pre-installed
    container.exec_run("apk add --no-cache redis")

    return {
        "container_id": container.id[:12],
        "role": role,
        "target_host": f"target_{match_id}" # The hostname they need to attack
    }

def check_score(match_id):
    """
    Connects to the Redis target and checks who is King.
    """
    match = active_matches.get(match_id)
    if not match: return None

    try:
        target = client.containers.get(match["target_id"])
        # Run redis-cli inside the target to read the key
        exit_code, output = target.exec_run("redis-cli GET king")
        
        val = output.decode().strip()
        
        if "RED" in val:
            match["red_score"] += 1
            match["current_king"] = "RED"
        elif "BLUE" in val:
            match["blue_score"] += 1
            match["current_king"] = "BLUE"
        
        return match
    except Exception:
        return match

def stop_match(match_id):
    """Destroys network and all containers"""
    if match_id in active_matches:
        network_name = active_matches[match_id]["network"]
        
        # Kill Target
        try:
            client.containers.get(active_matches[match_id]["target_name"]).stop()
            client.containers.get(active_matches[match_id]["target_name"]).remove()
        except: pass

        # Remove Network (Docker removes attached containers automatically usually, but good to be safe)
        try:
            net = client.networks.get(network_name)
            net.remove()
        except: pass
        
        del active_matches[match_id]