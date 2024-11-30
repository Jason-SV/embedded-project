#include <Arduino.h>

const int PUMP_PIN = 32;
const int SOIL_PIN = 25;

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(SOIL_PIN, INPUT);
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
  delay(500);
}