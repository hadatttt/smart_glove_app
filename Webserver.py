import asyncio
import websockets
import json
import socket
import numpy as np
import joblib
import paho.mqtt.client as mqtt

# ==== Tải mô hình ====
model = joblib.load("D:/pbl5-găng tay thông minh/model/glove_model.pkl")
scaler = joblib.load("D:/pbl5-găng tay thông minh/model/glove_scaler.pkl")
label_encoder = joblib.load("D:/pbl5-găng tay thông minh/model/glove_label_encoder.pkl")

# ==== WebSocket setup ====
connected_clients = set()

async def handle_client(websocket):
    try:
        connected_clients.add(websocket)
        client_info = websocket.remote_address
        print(f"📱 Client mới kết nối từ {client_info}. Tổng số client: {len(connected_clients)}")

        async for message in websocket:
            print(f"👻 Nhận từ client {client_info}: {message}")

    except websockets.exceptions.ConnectionClosed:
        print(f"🔌 Client {client_info} ngắt kết nối")
    except Exception as e:
        print(f"❌ Lỗi với client {client_info}: {str(e)}")
    finally:
        connected_clients.remove(websocket)
        print(f"👋 Client đã ngắt kết nối. Còn lại: {len(connected_clients)}")

async def broadcast_message(message):
    data = {
        "letter": message,
        "sentence": message  # có thể tích lũy câu
    }
    json_data = json.dumps(data)

    disconnected_clients = set()
    for client in connected_clients:
        try:
            await client.send(json_data)
        except websockets.exceptions.ConnectionClosed:
            disconnected_clients.add(client)
        except Exception as e:
            print(f"❌ Lỗi gửi tới client: {e}")
            disconnected_clients.add(client)

    connected_clients.difference_update(disconnected_clients)
    print(f"📢 Đã gửi '{message}' đến {len(connected_clients)} client")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

async def start_websocket_server():
    local_ip = get_local_ip()
    port = 8080
    try:
        server = await websockets.serve(handle_client, "0.0.0.0", port)
        print(f"\n🚀 WebSocket Server đang chạy:")
        print(f"- ws://{local_ip}:{port}")
        print(f"- ws://localhost:{port}")
        print(f"- ws://10.0.2.2:{port}")
        print("⚡ Đang chờ client kết nối...\n")
        await server.wait_closed()
    except Exception as e:
        print(f"❌ Lỗi WebSocket server: {e}")

# ==== MQTT xử lý ====
def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode(errors='ignore').strip()
        print(f"📩 Nhận: {payload}")
        values = list(map(float, payload.split(',')))

        if len(values) == 8:
            flex = list(map(float, values[:5]))
            accel = list(map(lambda x: round(x, 2), values[5:]))

            if all(abs(f - 4095) <= 10 for f in flex):
                print(f"⏭ Bỏ qua: Flex readings đều ≈ 4095 → không hợp lệ.")
                return

            sample = np.array([flex + accel])
            sample_scaled = scaler.transform(sample)
            prediction = model.predict(sample_scaled)
            label = label_encoder.inverse_transform(prediction)[0]

            print(f"🎯 Dự đoán: {label} ← Flex: {flex} | Accel: {accel}")

            # Gửi qua WebSocket
            asyncio.run_coroutine_threadsafe(
                broadcast_message(label),
                loop
            )
        else:
            print(f"⚠️ Dữ liệu sai định dạng ({len(values)} giá trị): {payload}")
    except Exception as e:
        print(f"❌ Lỗi xử lý dữ liệu: {e}")

# ==== Khởi động mọi thứ ====
def start():
    global loop
    loop = asyncio.get_event_loop()

    # WebSocket chạy song song
    loop.create_task(start_websocket_server())

    # MQTT setup
    client = mqtt.Client()
    client.on_message = on_message
    client.connect("broker.hivemq.com", 1883, keepalive=60)
    client.subscribe("smartglove/data")
    print("📡 Đang lắng nghe dữ liệu từ MQTT...")

    # Chạy MQTT loop trong luồng riêng
    def mqtt_loop():
        client.loop_forever()

    import threading
    threading.Thread(target=mqtt_loop, daemon=True).start()

    # Bắt đầu event loop
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        print("\n👋 Dừng server")
    finally:
        loop.close()

if __name__ == "__main__":
    start()
