import GPUtil
import psutil
import websocket
import json
import time
import logging
import os
import wmi
from dotenv import load_dotenv

load_dotenv()
# Now access WS_URL
ws_url = os.getenv('WS_URL', 'ws://localhost:3000')
print(f"Attempting to connect to WebSocket server.")

# Function to get GPU information
def get_gpu_info():
    gpus = GPUtil.getGPUs()
    if gpus:
        gpu = gpus[0]
        return {
            "name": gpu.name,
            "load": gpu.load * 100,
            "free_memory": gpu.memoryFree / (1024),
            "total_memory": gpu.memoryTotal / (1024),
            "temperature": gpu.temperature
        }
    else:
        return {}

def get_processor_name():
    w = wmi.WMI()
    for processor in w.Win32_Processor():
        return processor.Name
processor_name = get_processor_name()

# Function to get CPU information
def get_cpu_info():
    cpu_info = {
        "total_usage": psutil.cpu_percent(interval=1),
        "core_usage": psutil.cpu_percent(interval=1, percpu=True),
        "current_frequency": psutil.cpu_freq().current,
        "cpu_percent": psutil.cpu_percent(interval=None),
        "total_cores": psutil.cpu_count(logical=True),
        "processor_model": processor_name
    }
    return cpu_info

# Function to get RAM information
def get_ram_info():
    ram_info = psutil.virtual_memory() # use psutil to get RAM info
    
    w = wmi.WMI() # use wmi to get RAM speed info
    ram_speeds = [memory.Speed for memory in w.Win32_PhysicalMemory()]
    
    return {
        "total": ram_info.total / (1024 ** 3),  
        "used": ram_info.used / (1024 ** 3),    
        "free": ram_info.free / (1024 ** 3),    
        "percent": ram_info.percent,
        "speeds": ram_speeds  
    }

# Function to send data to the server via WebSocket
def send_data(ws, data):
    try:
        ws.send(json.dumps(data))
    except (ConnectionResetError, websocket.WebSocketConnectionClosedException):
        logging.error("Connection lost. Attempting to reconnect...")
        return None
    return ws

def create_connection(ws_url):
    max_retries = 5
    wait_time = 10  # Initial wait time in seconds
    for i in range(max_retries):
        try:
            ws = websocket.create_connection(ws_url)
            logging.info("WebSocket connection established.")
            return ws
        except ConnectionRefusedError:
            logging.error(f"Connection failed, attempt {i + 1}/{max_retries}. Retrying in {wait_time} seconds.")
            time.sleep(wait_time)
            wait_time *= 2  # Double the wait time for the next attempt

    logging.error("Failed to establish connection after several attempts.")
    return None

if __name__ == "__main__":
    # Create webSocket connection
    logging.basicConfig(level=logging.INFO) 
    ws = create_connection(ws_url)

    while ws: 
        try:
            gpu_data = get_gpu_info()
            cpu_data = get_cpu_info()
            ram_data = get_ram_info()

            data_to_send = {"cpu": cpu_data, "gpu": gpu_data, "ram": ram_data}

            # Log the data_to_send using logging.info()
            logging.info(f"Sending data: {data_to_send}")

            ws = send_data(ws, data_to_send)

            if ws is None:
                ws = create_connection(ws_url)

            time.sleep(5)
        except KeyboardInterrupt:
            print("Interrupted by user, closing connection.")
            if ws:
                ws.close()
            break