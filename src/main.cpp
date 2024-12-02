#include <Arduino.h>
#include <WiFi.h>
#include "esp_adc_cal.h"
#include <Wire.h>
#include <PubSubClient.h>

#define SSID "Jason"
#define PASSWORD "12345678"

const char* mqttServer = "mqtt.netpie.io";
const int mqttPort = 1883;
const char* ID = "4d0fc2e5-11b1-47e9-a7ce-be7cab2722a3";
const char* token = "csJ8vKdhHFtB2BaZu3pSAyZSQ3UrkFt6";
const char* secret = "BpgaFhTywJTyfND1EN9RRuPLTjBLy5Et";

const int PUMP_PIN = 32;
const int SOIL_PIN = 33;

WiFiClient espClient;
PubSubClient client(espClient);

char msg[100];
char pump[100];

void setupWiFi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
  Serial.println("WiFi connected.");
}

void connectToMQTT() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect(ID, token, secret)) {
      Serial.println("Connected to MQTT.");
      client.flush();
      client.subscribe("@msg/pump");
      client.subscribe("@msg/sensor/node2");
    } else {
      Serial.print("Failed. Error state: ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void getMsg(String topic, String message) {
  if (topic == "@msg/pump") {
    String data = "{\"data\": {\"pump\": " + message + "}}";
    data.toCharArray(pump, data.length() + 1);
    client.publish("@shadow/data/update", pump);
    if (message == "on") {
      digitalWrite(PUMP_PIN, HIGH);
    }
    else {
      digitalWrite(PUMP_PIN, LOW);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String message;
  for (int i = 0; i < length; i++) {
    message = message + (char)payload[i];
  }
  Serial.println(message);
  getMsg(String(topic), message);
}

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(SOIL_PIN, INPUT);
  setupWiFi();
  client.setServer(mqttServer, mqttPort);
  connectToMQTT();
  client.setCallback(callback);
}
void loop() {
  
  if (!client.connected()) {
    connectToMQTT();
  }
  client.loop();

  int s = analogRead(SOIL_PIN);
  //Serial.println(s);
  
  String data = "{\"data\": {\"soil\": " + String(s) + "}}";
  data.toCharArray(msg, data.length() + 1);

  if (!client.publish("@shadow/data/update", msg)) {
    Serial.println("Cannot publish 1");
  }

  if (!client.publish("@msg/sensor/node2", msg)) {
    Serial.println("Cannot publish 2");
  }

  delay(1000);
}