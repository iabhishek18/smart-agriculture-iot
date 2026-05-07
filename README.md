# Smart Agriculture IoT Monitoring System

IoT-based precision agriculture with ESP32 soil sensors, automated irrigation, and real-time dashboard.

## Features
- 🌱 Real-time soil moisture monitoring (ESP32 + capacitive sensor)
- 💧 Automated irrigation control (relay-driven pump)
- 🌡️ Temperature & humidity tracking (DHT22)
- ☀️ Light level monitoring (LDR)
- 📊 7-day analytics dashboard with aggregation
- ⚡ Configurable thresholds from server
- 🔋 Solar-powered sensor nodes
- 📱 Mobile-responsive dashboard

## Tech Stack
- **Firmware**: Arduino/ESP32, DHT22, Capacitive Soil Sensor
- **Backend**: Node.js, Express, MongoDB, node-cron
- **Dashboard**: React, Chart.js, TailwindCSS
- **Communication**: HTTP REST (WiFi)

## Hardware Requirements
- ESP32 DevKit
- DHT22 temperature/humidity sensor
- Capacitive soil moisture sensor v1.2
- 5V relay module (2-channel)
- 12V water pump
- LDR light sensor

## Getting Started
```bash
# Flash firmware
# Open firmware/soil_monitor.ino in Arduino IDE
# Set WiFi credentials and server URL
# Upload to ESP32

# Start backend
cd backend && npm install && npm run dev
```

## License
MIT
