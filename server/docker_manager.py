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
    """Finds and kills ANY container that starts with 'lab_'."""
    if not client: return
    print("🧹 SCANNING FOR ORPHANED LABS...")
    
    # List all containers (running or stopped) that start with "lab_"
    orphans = client.containers.list(all=True, filters={"name": "lab_"})
    
    count = 0
    for container in orphans:
        try:
            print(f"   - Killing zombie: {container.name}")
            container.stop(timeout=1)
            container.remove()
            count += 1
        except Exception as e:
            print(f"   ! Failed to kill {container.name}: {e}")
    
    print(f"✅ CLEANUP COMPLETE. Removed {count} zombies.\n")

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