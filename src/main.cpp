#include <Arduino.h>
#include <WiFi.h>
#include "esp_adc_cal.h"
#include "DHT.h"
#include "DHT_U.h"
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include "BlynkToken.h"
#include <WiFi.h>
#include <PubSubClient.h>

#define SOIL_PIN 35

#define AIR_PIN 34

#define LIGHT_PIN 32

#define MOTION_PIN 33

#define PUMP_PIN 18

#define DHT_PIN 5

#define LED_PIN 4

#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);

LiquidCrystal_I2C lcd(0x27, 16, 2);

WiFiClient espClient;
PubSubClient client(espClient);

char msg[100];

uint32_t readADC_Cal(int ADC_Raw)
{
  esp_adc_cal_characteristics_t adc_chars;  
  esp_adc_cal_characterize(ADC_UNIT_1, ADC_ATTEN_DB_12, ADC_WIDTH_BIT_12, 1100, &adc_chars);
  return(esp_adc_cal_raw_to_voltage(ADC_Raw, &adc_chars));
}

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
  client.flush();
  client.unsubscribe("@msg/home");
  client.subscribe("@msg/home");
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect(ID, token, secret)) {
      Serial.println("Connected to MQTT.");
    } else {
      Serial.print("Failed. Error state: ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

float readTemp() {
  float t = dht.readTemperature();
  return t;
}

float readHumid() {
  float h = dht.readHumidity();
  return h;
}

int readSoil() {
  int soil = analogRead(SOIL_PIN);
  if (soil > 2000) {
    digitalWrite(PUMP_PIN, HIGH);
  }
  else if (soil <= 1500){
    digitalWrite(PUMP_PIN, LOW);
  }
  else {
    digitalWrite(PUMP_PIN, LOW);
  }
  return soil;
}

int readAir() {
  int air = analogRead(AIR_PIN);
  return air;
} 

int readLight() {
  int light = analogRead(LIGHT_PIN);
  return light;
}

int readMotion() {
  int motion = analogRead(MOTION_PIN);
  return motion;
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

  Wire.begin(21,22);

  dht.begin();

  Serial.begin(115200);

  setupWiFi();
  client.setServer(mqttServer, mqttPort);
  connectToMQTT();

  client.setCallback(callback);

  pinMode(PUMP_PIN, OUTPUT);

  pinMode(SOIL_PIN, INPUT);
  pinMode(LIGHT_PIN, INPUT);
  pinMode(AIR_PIN, INPUT);
  pinMode(MOTION_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  lcd.begin(16,2,1);
  lcd.clear();
  lcd.backlight();
  lcd.setCursor(0, 0); 
  Serial.println("Setup finished");
}

void loop() {

  Serial.println("Start loop");

  if (!client.connected()) {
    Serial.println("This is line 161");
    connectToMQTT();
  }
  client.loop();

  float t = readTemp();
  float h = readHumid();
  int l = readLight();
  int a = readAir();
  int s = readSoil();
  int m = readMotion();

  String raw = "T: " + String(t) + ", H: " +  String(h) + ", L: " +  String(l) + ", A: " + String(a) + ", S: " + String(s) + ", M: " + String(m);

  String data = "{\"data\": {\"light\": " + String(l) + ", \"humid\": " + String(h) 
  + ", \"temp\": " + String(t) + ", \"soil\": " + String(s) + ", \"air\": " + String(a)
  + ", \"motion\": " + String(m) + "}}";
  data.toCharArray(msg, data.length() + 1);

  Serial.println("Publish 1");
  if (!client.publish("@shadow/data/update", msg)) {
    Serial.println("Cannot publish 1");
  }

  Serial.println("Publish 2");
  if (!client.publish("@msg/home", msg)) {
    Serial.println("Cannot publish 2");
  }

  Serial.println(raw);

  Serial.println("End loop");
  delay(1000);
}


