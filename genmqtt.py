import paho.mqtt.client as mqtt
import json
import random
import time

# Konfigurasi broker dan topic
MQTT_BROKER = "143.198.85.152"
MQTT_PORT = 1883
MQTT_TOPIC = "solar/data"

# Nilai awal
current_data = {
    "voltage": 12.4,
    "current": 585,
    "power": 173,
    "suhu": 34,
    "kelembapan": 65,
    "battery_capacity": 95
}

# Fungsi update data dengan perubahan kecil
def smooth_change(value, min_delta, max_delta, min_value=None, max_value=None):
    delta = random.uniform(min_delta, max_delta)
    if random.random() < 0.5:
        delta *= -1
    new_value = value + delta
    if min_value is not None:
        new_value = max(min_value, new_value)
    if max_value is not None:
        new_value = min(max_value, new_value)
    return round(new_value, 2 if isinstance(value, float) else 0)

def generate_next_data():
    global current_data
    current_data["voltage"] = smooth_change(current_data["voltage"], 0.01, 0.05, 11.8, 13.0)
    current_data["current"] = smooth_change(current_data["current"], 1, 5, 500, 600)
    current_data["power"] = smooth_change(current_data["power"], 1, 3, 100, 200)
    current_data["suhu"] = smooth_change(current_data["suhu"], 0.2, 1, 25, 45)
    current_data["kelembapan"] = smooth_change(current_data["kelembapan"], 0.5, 1.5, 40, 90)
    current_data["battery_capacity"] = smooth_change(current_data["battery_capacity"], 0.5, 2, 50, 100)
    return current_data

# Setup client MQTT
client = mqtt.Client()

try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    print(f"Connected to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}")

    while True:
        data = generate_next_data()
        payload = json.dumps(data)
        client.publish(MQTT_TOPIC, payload)
        print(f"Published to {MQTT_TOPIC}: {payload}")
        time.sleep(1)

except KeyboardInterrupt:
    print("Stopped by user.")
except Exception as e:
    print(f"Error: {e}")
finally:
    client.disconnect()
