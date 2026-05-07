# Smart Agriculture IoT Monitoring System

> IoT-based precision agriculture with ESP32 soil sensors, automated irrigation relay control, real-time dashboard, and 7-day analytics.

## 🚀 Overview

A complete IoT agriculture system using ESP32 microcontrollers with capacitive soil moisture sensors, DHT22 temperature/humidity sensors, and LDR light sensors. The firmware automatically controls water pumps based on configurable moisture thresholds, sends readings to a Node.js backend, and provides a real-time monitoring dashboard with historical analytics.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌱 Soil Moisture | Capacitive sensor (0-100%) |
| 🌡️ Temperature/Humidity | DHT22 sensor |
| ☀️ Light Level | LDR sensor |
| 💧 Auto-Irrigation | Relay-driven pump control |
| 📊 7-Day Analytics | MongoDB aggregation pipeline |
| ⚙️ Remote Config | Server-pushed threshold updates |
| 🔋 Solar Compatible | Low-power design |
| 📡 WiFi Communication | HTTP REST to backend |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Firmware | Arduino C++ (ESP32) |
| Sensors | DHT22, Capacitive Soil, LDR |
| Actuators | 5V Relay → 12V Pump |
| Backend | Node.js, Express, MongoDB |
| Dashboard | React, Chart.js |

## 🔧 Hardware Requirements

- ESP32 DevKit v1
- DHT22 temperature/humidity sensor
- Capacitive soil moisture sensor v1.2
- 5V 2-channel relay module
- 12V DC water pump
- LDR light sensor + 10kΩ resistor
- 12V power supply (or solar panel)

## ⚡ Quick Start

```bash
# Flash firmware (Arduino IDE)
# 1. Open firmware/soil_monitor.ino
# 2. Set WiFi credentials and server URL
# 3. Upload to ESP32

# Start backend
cd backend && npm install && npm run dev
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/readings` | Receive sensor data |
| GET | `/api/readings/:deviceId` | Get readings (last 24h) |
| GET | `/api/readings/:deviceId/latest` | Latest reading |
| GET | `/api/readings/:deviceId/analytics` | 7-day aggregates |

## 📄 License

MIT
