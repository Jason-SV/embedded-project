#include <Arduino.h>
#include <WiFi.h>
#include "esp_adc_cal.h"
#include <Wire.h>
#include "token.h"
#include <WiFi.h>
#include <PubSubClient.h>

const int PUMP_PIN = 32;
const int SOIL_PIN = 25;

WiFiClient espClient;
PubSubClient client(espClient);

char msg[100];

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
      client.subscribe("@msg/sensor/node2");
    } else {
      Serial.print("Failed. Error state: ");
      Serial.print(client.state());
      delay(2000);
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
  int s = analogRead(SOIL_PIN);
  Serial.println(s);
  if (s > 2000) {
    digitalWrite(PUMP_PIN, HIGH);
  }
  else if (s <= 1500) {
    digitalWrite(PUMP_PIN, LOW);
  }
  else {
    digitalWrite(PUMP_PIN, LOW);
  }
  
  if (!client.connected()) {
    Serial.println("This is line 161");
    connectToMQTT();
  }
  client.loop();
  String data = "{\"data\": {\"soil\": " + String(s) + "}}";
  data.toCharArray(msg, data.length() + 1);

  Serial.println("Publish 1");
  if (!client.publish("@shadow/data/update", msg)) {
    Serial.println("Cannot publish 1");
  }

  Serial.println("Publish 2");
  if (!client.publish("@msg/sensor/node2", msg)) {
    Serial.println("Cannot publish 2");
  }

  delay(1000);
}