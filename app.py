from flask import Flask, jsonify, request
from flask_cors import CORS
import paho.mqtt.client as mqtt
from pymongo import MongoClient
from datetime import datetime, timedelta
from pytz import timezone
import json

app = Flask(__name__)
CORS(app)

# Setup MongoDB
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["solar_monitoring"]
collection = db["sensor_data"]

# Timezone Jakarta
jakarta = timezone("Asia/Jakarta")

# MQTT config
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "solar/data"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT broker")
        client.subscribe(MQTT_TOPIC)
        print(f"📡 Subscribed to topic: {MQTT_TOPIC}")
    else:
        print("❌ MQTT connection failed:", rc)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        payload["timestamp"] = datetime.utcnow()
        collection.insert_one(payload)
        print("📥 Saved:", payload)
    except Exception as e:
        print("❌ MQTT error:", e)

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.loop_start()

# =============================
# REST API
# =============================

@app.route('/api/latest', methods=['GET'])
def get_latest_data():
    data = collection.find_one(sort=[('timestamp', -1)])
    if data:
        data['_id'] = str(data['_id'])
        data['timestamp'] = data['timestamp'].astimezone(jakarta).isoformat()
        return jsonify(data)
    return jsonify({'message': 'No data found'}), 404

@app.route('/api/history', methods=['GET'])
def get_history_data():
    range_param = request.args.get('range', '24h')
    now = datetime.utcnow()

    time_ranges = {
        '1m': timedelta(minutes=1),
        '15m': timedelta(minutes=15),
        '1h': timedelta(hours=1),
        '6h': timedelta(hours=6),
        '12h': timedelta(hours=12),
        '24h': timedelta(hours=24),
        '7d': timedelta(days=7),
        '30d': timedelta(days=30)
    }

    delta = time_ranges.get(range_param, timedelta(hours=24))
    start_time = now - delta

    cursor = collection.find({'timestamp': {'$gte': start_time}}).sort('timestamp', 1)
    data = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        doc['timestamp'] = doc['timestamp'].astimezone(jakarta).isoformat()
        data.append(doc)

    return jsonify(data)

@app.route('/api/history_range', methods=['GET'])
def get_history_range():
    start_str = request.args.get('start')
    end_str = request.args.get('end')

    if not start_str or not end_str:
        return jsonify({'error': 'Missing start or end query parameters'}), 400

    try:
        if start_str.endswith('Z'):
            start_str = start_str[:-1]
        if end_str.endswith('Z'):
            end_str = end_str[:-1]

        start_time = datetime.fromisoformat(start_str)
        end_time = datetime.fromisoformat(end_str)
    except ValueError:
        return jsonify({'error': 'Invalid datetime format (use ISO 8601)'}), 400

    cursor = collection.find({
        'timestamp': {'$gte': start_time, '$lte': end_time}
    }).sort('timestamp', 1)

    data = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        doc['timestamp'] = doc['timestamp'].astimezone(jakarta).isoformat()
        data.append(doc)

    return jsonify(data)

@app.route('/api/ping')
def ping():
    return jsonify({'status': 'ok'}), 200

# =============================
# Run Server
# =============================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
