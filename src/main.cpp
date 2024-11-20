#include <Arduino.h>
#include <BlynkSimpleEsp32.h>
#include <WiFi.h>
#include "esp_adc_cal.h"
#include "DHT.h"

#define LED_PIN 5

#define SOIL_PIN 35

#define AIR_PIN 34

#define DHT_PIN 22
#define DHT_TYPE DHT22

BlynkTimer timer;

DHT dht(DHT_PIN, DHT_TYPE);

uint32_t readADC_Cal(int ADC_Raw)
{
  esp_adc_cal_characteristics_t adc_chars;  
  esp_adc_cal_characterize(ADC_UNIT_1, ADC_ATTEN_DB_11, ADC_WIDTH_BIT_12, 1100, &adc_chars);
  return(esp_adc_cal_raw_to_voltage(ADC_Raw, &adc_chars));
}

void loopLED() {
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED ON");
  delay(500);

  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(500);
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
  return soil;
}

int readAir() {
  int air = analogRead(AIR_PIN);
  return air;
} 

void readMotion() {

}

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  dht.begin();

  Serial.begin(115200);
}

void loop() {
  loopLED();
}


