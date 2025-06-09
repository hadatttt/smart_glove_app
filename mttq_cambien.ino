#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// WiFi info
const char* ssid = "NSM";
const char* password = "1234567899";

// MQTT broker info
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "smartglove/data";

// Flex sensor pins
const int flexPins[5] = {32, 35, 34, 39, 36};

// Sensor & network clients
Adafruit_MPU6050 mpu;
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("🔌 Connecting WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  int retry_count = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retry_count++;
    if (retry_count > 30) {  // >15s
      Serial.println("\n❌ WiFi failed. Restarting ESP...");
      ESP.restart();         // Reset nếu không vào WiFi
    }
  }

  Serial.println("\n✅ WiFi connected! IP: " + WiFi.localIP().toString());
}

void reconnect_mqtt() {
  while (!client.connected()) {
    Serial.print("📡 Connecting MQTT...");
    if (client.connect("ESP32SmartGlove")) {
      Serial.println("✅ MQTT Connected!");
    } else {
      Serial.print("❌ MQTT Failed. State: ");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);

  // Setup MPU6050
  if (!mpu.begin()) {
    Serial.println("❌ MPU6050 not found!");
    while (1) delay(10);
  }
  Serial.println("✅ MPU6050 Ready!");

  // Optional: setup Flex pins as input
  for (int i = 0; i < 5; i++) {
    pinMode(flexPins[i], INPUT);
  }
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi lost. Restarting...");
    ESP.restart();
  }

  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop();

  String data = "";
  bool allZero = true;

  for (int i = 0; i < 5; i++) {
    int value = analogRead(flexPins[i]);
    if (value != 0) allZero = false;
    data += String(value);
    if (i < 4) data += ",";
  }

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  if (!allZero || fabs(a.acceleration.x) > 0.01 || fabs(a.acceleration.y) > 0.01 || fabs(a.acceleration.z) > 0.01) {
    data += ",";
    data += String(a.acceleration.x, 2) + ",";
    data += String(a.acceleration.y, 2) + ",";
    data += String(a.acceleration.z, 2);

    Serial.println("📤 MQTT Publish: " + data);
    client.publish(mqtt_topic, data.c_str());
  }

  delay(1500);
}
