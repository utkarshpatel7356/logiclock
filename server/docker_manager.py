import docker
import random
import time
from docker.errors import DockerException, NotFound

try:
    client = docker.from_env()
except DockerException as e:
    print(f"CRITICAL: Could not connect to Docker. {e}")
    client = None

NETWORK_NAME = "logiclock_net"

def _ensure_network():
    if not client: return
    try:
        client.networks.get(NETWORK_NAME)
    except NotFound:
        client.networks.create(NETWORK_NAME, driver="bridge", check_duplicate=True)

def cleanup_orphans():
    """
    Kills ANY container created by LogicLock (Labs AND Matches).
    """
    if not client: return
    print("🧹 SCANNING FOR ORPHANED CONTAINERS...")
    
    count = 0
    try:
        containers = client.containers.list(all=True)
        for container in containers:
            name = container.name
            # CHECK FOR ALL TYPES: Labs, Red/Blue Players, and Targets
            if (name.startswith("lab_") or 
                name.startswith("red_match_") or 
                name.startswith("blue_match_") or 
                name.startswith("target_match_")):
                
                print(f"   ⚰️ Killing orphan: {name}")
                try:
                    container.stop(timeout=1)
                    container.remove(force=True)
                    count += 1
                except: pass
                
        # ALSO CLEANUP NETWORKS
        networks = client.networks.list()
        for net in networks:
            if net.name.startswith("net_match_"):
                print(f"   🕸️ Removing network: {net.name}")
                try: net.remove()
                except: pass

    except Exception as e:
        print(f"   ⚠️ Cleanup Error: {e}")

    print(f"✅ CLEANUP COMPLETE. Removed {count} zombies.")

def start_lab(image_name: str, internal_port: int = 80):
    if not client: raise RuntimeError("Docker not connected")
    _ensure_network()

    # Generate a unique ID
    run_id = random.randint(10000, 99999)
    container_name = f"lab_{run_id}"

    try:
        # Check if image exists
        try:
            client.images.get(image_name)
        except NotFound:
            print(f"Pulling {image_name}...")
            client.images.pull(image_name)

        container = client.containers.run(
            image_name,
            detach=True,
            network=NETWORK_NAME,
            ports={f'{internal_port}/tcp': None},
            mem_limit="512m",
            name=container_name
        )
        
        time.sleep(1) 
        container.reload()
        
        net_settings = container.attrs['NetworkSettings']['Ports']
        port_key = f'{internal_port}/tcp'
        host_port = net_settings[port_key][0]['HostPort']

        return {
            "status": "started",
            "container_id": container.id[:12],
            "name": container_name,
            "url": f"http://localhost:{host_port}"
        }

    except Exception as e:
        print(f"Error starting lab: {e}")
        raise e

def stop_lab(container_id: str):
    if not client: return
    try:
        # Try to find by ID first, then name
        try:
            container = client.containers.get(container_id)
        except NotFound:
            # Maybe the frontend sent the short ID, but we need to find it
            return {"status": "already_stopped"}

        container.stop(timeout=1)
        container.remove()
        return {"status": "stopped", "id": container_id}
    except Exception as e:
        return {"status": "error", "message": str(e)}