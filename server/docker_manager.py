import docker
import os
import random
import time
from docker.errors import DockerException, NotFound

# Initialize Docker Client
try:
    client = docker.from_env()
except DockerException as e:
    print(f"CRITICAL: Could not connect to Docker. Is it running? Error: {e}")
    client = None

NETWORK_NAME = "logiclock_net"  # Renamed to avoid conflict with the broken network

def _ensure_network():
    """Creates a standard bridge network."""
    if not client: return
    try:
        client.networks.get(NETWORK_NAME)
    except NotFound:
        print(f"Creating network: {NETWORK_NAME}")
        # REMOVED internal=True to allow port forwarding to localhost
        client.networks.create(NETWORK_NAME, driver="bridge", check_duplicate=True)

def start_lab(image_name: str, internal_port: int = 80):
    if not client:
        raise RuntimeError("Docker daemon is not connected.")

    _ensure_network()

    try:
        # 1. Pull image
        try:
            client.images.get(image_name)
        except NotFound:
            print(f"Pulling image {image_name}...")
            client.images.pull(image_name)

        # 2. Run container
        container = client.containers.run(
            image_name,
            detach=True,
            network=NETWORK_NAME,
            ports={f'{internal_port}/tcp': None}, # Ask Docker for a random port
            mem_limit="512m",
            name=f"lab_{random.randint(1000, 9999)}"
        )
        
        # 3. Wait and Reload to get the port
        # Sometimes Docker takes a few milliseconds to assign the port
        time.sleep(1) 
        container.reload()
        
        net_settings = container.attrs['NetworkSettings']['Ports']
        port_key = f'{internal_port}/tcp'
        
        if not net_settings or port_key not in net_settings or not net_settings[port_key]:
            # Cleanup if it failed
            container.stop()
            container.remove()
            raise RuntimeError(f"Docker failed to map port {internal_port}. Raw settings: {net_settings}")

        host_port = net_settings[port_key][0]['HostPort']

        return {
            "status": "started",
            "container_id": container.id[:12],
            "url": f"http://localhost:{host_port}",
            "port": host_port
        }

    except Exception as e:
        print(f"Error starting lab: {e}")
        raise e

def stop_lab(container_id: str):
    if not client:
        raise RuntimeError("Docker daemon is not connected.")
        
    try:
        container = client.containers.get(container_id)
        container.stop(timeout=1)
        container.remove()
        return {"status": "stopped", "id": container_id}
    except NotFound:
        return {"status": "error", "message": "Container not found"}