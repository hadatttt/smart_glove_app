import numpy as np
import joblib
import paho.mqtt.client as mqtt
import asyncio
import websockets
import json
import threading
import time
from paho.mqtt.client import CallbackAPIVersion

# === Load mô hình ===
model = joblib.load("C:/reactnative/gia lap gui du lieu/glove_model.pkl")
scaler = joblib.load("C:/reactnative/gia lap gui du lieu/glove_scaler.pkl")
label_encoder = joblib.load("C:/reactnative/gia lap gui du lieu/glove_label_encoder.pkl")

# === MQTT cấu hình ===
broker = "test.mosquitto.org"
port = 1883
topic = "smartglove/data"

# === WebSocket client connections ===
connected_websockets = set()

# === Hàm gửi dự đoán đến tất cả WebSocket clients ===
async def broadcast_prediction(letter):
    if connected_websockets:
        data = json.dumps({"letter": letter})
        await asyncio.wait([ws.send(data) for ws in connected_websockets])
        print(f"📤 Đã gửi WebSocket: {data}")
    else:
        print("⚠️ Không có client WebSocket nào để gửi.")

# === WebSocket handler ===
async def websocket_handler(websocket):
    print("✅ WebSocket client đã kết nối.")
    connected_websockets.add(websocket)
    try:
        async for message in websocket:
            print(f"💬 Nhận từ client (chưa xử lý): {message}")
    except websockets.exceptions.ConnectionClosed:
        print("🔌 WebSocket client đã ngắt kết nối.")
    finally:
        connected_websockets.remove(websocket)

# === Hàm chạy WebSocket server (gọi trong thread phụ) ===
def run_websocket_server():
    try:
        async def start():
            print("🌐 WebSocket server chạy tại ws://192.168.5.180:8001")
            server = await websockets.serve(websocket_handler, "192.168.5.180", 8001)
            print("✅ WebSocket server đã khởi động thành công.")
            await asyncio.Future()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(start())
    except Exception as e:
        print(f"❌ Lỗi trong WebSocket server: {e}")
        exit(1)

# === MQTT xử lý khi nhận dữ liệu ===
def on_connect(client, userdata, flags, reason_code, properties=None):
    print(f"✅ Kết nối thành công đến broker với mã trạng thái: {reason_code}")
    client.subscribe(topic)
    print(f"📡 Đã subscribe MQTT topic: {topic}")

def on_connect_fail(client, userdata, reason_code, properties=None):
    print(f"❌ Lỗi kết nối: {reason_code}")

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode(errors='ignore').strip()
        print(f"📩 Nhận: {payload}")

        values = list(map(float, payload.split(',')))
        if len(values) == 8:
            flex = values[:5]
            accel = [round(x, 2) for x in values[5:]]

            if all(abs(f - 4095) <= 10 for f in flex):
                print("⏭ Bỏ qua dữ liệu không hợp lệ (4095).")
                return

            sample = np.array([flex + accel])
            sample_scaled = scaler.transform(sample)
            prediction = model.predict(sample_scaled)
            label = label_encoder.inverse_transform(prediction)[0]

            print(f"🎯 Dự đoán: {label}")

            loop = asyncio.get_event_loop()
            if loop.is_running():
                asyncio.run_coroutine_threadsafe(broadcast_prediction(label), loop)
            else:
                asyncio.run(broadcast_prediction(label))
        else:
            print(f"⚠️ Dữ liệu không hợp lệ ({len(values)} giá trị): {payload}")
    except Exception as e:
        print(f"❌ Lỗi xử lý dữ liệu: {e}")

# === Debugging MQTT logs ===
def on_log(client, userdata, level, buf):
    print(f"MQTT Log: {buf}")

# === Main ===
if __name__ == "__main__":
    websocket_thread = threading.Thread(target=run_websocket_server, daemon=True)
    websocket_thread.start()

    client = mqtt.Client(
        callback_api_version=CallbackAPIVersion.VERSION2,
        client_id="smartglove_client",
        protocol=mqtt.MQTTv5
    )
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_connect_fail = on_connect_fail
    client.on_log = on_log

    print(f"🔌 Đang kết nối tới MQTT broker: {broker}:{port}")
    max_retries = 3
    retry_count = 0

    while retry_count < max_retries:
        try:
            client.connect(broker, port, keepalive=60)
            client.loop_start()
            print(f"✅ Kết nối thành công tới MQTT broker: {broker}:{port}")
            break
        except Exception as e:
            retry_count += 1
            print(f"❌ Không thể kết nối tới MQTT broker (lần {retry_count}/{max_retries}): {e}")
            if retry_count == max_retries:
                print("❌ Đã vượt quá số lần thử lại. Thoát chương trình.")
                exit(1)
            time.sleep(5)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("🛑 Ngắt chương trình.")
        client.loop_stop()
        client.disconnect()