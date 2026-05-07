#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define SOIL_MOISTURE_PIN 34
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define RELAY_PUMP_PIN 26
#define RELAY_VALVE_PIN 27
#define LDR_PIN 35

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://your-server.com/api/readings";
const char* deviceId = "FARM_ZONE_A1";

DHT dht(DHT_PIN, DHT_TYPE);

float soilMoisture = 0;
float temperature = 0;
float humidity = 0;
float lightLevel = 0;

unsigned long lastReadTime = 0;
unsigned long lastSendTime = 0;
const unsigned long READ_INTERVAL = 5000;
const unsigned long SEND_INTERVAL = 60000;

float MOISTURE_THRESHOLD_LOW = 30.0;
float MOISTURE_THRESHOLD_HIGH = 70.0;
bool autoIrrigationEnabled = true;
bool pumpRunning = false;

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(RELAY_PUMP_PIN, OUTPUT);
  pinMode(RELAY_VALVE_PIN, OUTPUT);
  
  digitalWrite(RELAY_PUMP_PIN, LOW);
  digitalWrite(RELAY_VALVE_PIN, LOW);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected! IP: " + WiFi.localIP().toString());
}

void loop() {
  unsigned long now = millis();
  
  if (now - lastReadTime >= READ_INTERVAL) {
    readSensors();
    lastReadTime = now;
    
    if (autoIrrigationEnabled) {
      controlIrrigation();
    }
  }
  
  if (now - lastSendTime >= SEND_INTERVAL) {
    sendDataToServer();
    lastSendTime = now;
  }
}

void readSensors() {
  int rawMoisture = analogRead(SOIL_MOISTURE_PIN);
  soilMoisture = map(rawMoisture, 4095, 0, 0, 100);
  
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  int rawLight = analogRead(LDR_PIN);
  lightLevel = map(rawLight, 0, 4095, 0, 100);
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read DHT sensor!");
    return;
  }
  
  Serial.printf("Moisture: %.1f%% | Temp: %.1f°C | Humidity: %.1f%% | Light: %.1f%%\n",
    soilMoisture, temperature, humidity, lightLevel);
}

void controlIrrigation() {
  if (soilMoisture < MOISTURE_THRESHOLD_LOW && !pumpRunning) {
    startPump();
  } else if (soilMoisture >= MOISTURE_THRESHOLD_HIGH && pumpRunning) {
    stopPump();
  }
}

void startPump() {
  digitalWrite(RELAY_VALVE_PIN, HIGH);
  delay(500);
  digitalWrite(RELAY_PUMP_PIN, HIGH);
  pumpRunning = true;
  Serial.println("PUMP ON - Soil moisture low");
}

void stopPump() {
  digitalWrite(RELAY_PUMP_PIN, LOW);
  delay(500);
  digitalWrite(RELAY_VALVE_PIN, LOW);
  pumpRunning = false;
  Serial.println("PUMP OFF - Soil moisture sufficient");
}

void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) return;
  
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<512> doc;
  doc["deviceId"] = deviceId;
  doc["soilMoisture"] = soilMoisture;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["lightLevel"] = lightLevel;
  doc["pumpStatus"] = pumpRunning;
  doc["timestamp"] = millis();
  
  String payload;
  serializeJson(doc, payload);
  
  int httpCode = http.POST(payload);
  if (httpCode == 200) {
    String response = http.getString();
    StaticJsonDocument<256> resDoc;
    deserializeJson(resDoc, response);
    
    if (resDoc.containsKey("moistureThresholdLow")) {
      MOISTURE_THRESHOLD_LOW = resDoc["moistureThresholdLow"];
      MOISTURE_THRESHOLD_HIGH = resDoc["moistureThresholdHigh"];
      autoIrrigationEnabled = resDoc["autoIrrigation"];
    }
  }
  http.end();
}
