# AeroSense

AeroSense is an IoT-based indoor air quality monitoring system. This repository contains the frontend web application used to monitor multiple AeroSense devices and view air quality data from different rooms and locations.

## Features

* Monitor multiple AeroSense devices
* Assign custom names to devices
* View CO₂, PM2.5, PM10, temperature, and humidity
* View device online/offline status
* Monitor air quality status
* View air quality trends
* Device search
* Add local test devices without connecting to Bluetooth hardware
* Dark mode
* Responsive dashboard
* Configure per-device humidity-control thresholds in the dashboard prototype

## Requirements

* Node.js
* npm
* Git

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Enter the project folder:

```bash
cd airosense-frontend
```

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build

To create a production build:

```bash
npm run build
```

## Technologies

* React
* TypeScript
* Vite
* Tailwind CSS
* ESLint
* Lucide React
* Recharts

## Project Status

The current frontend uses mock sensor data. From the Devices page, use
**Add test device** to create a local sample with a name and location; no
Bluetooth scan, hardware connection, or backend is needed. Each sample appears
online with randomly generated, healthy-looking readings for CO₂, PM2.5, PM10,
temperature, and humidity. These readings are synthetic and labeled as mock
data. Added devices, renamed devices, and humidity settings are saved in the
current browser's local storage and remain after refresh; they are not synced
to another browser or a backend.
Humidity settings can also be edited, and the dashboard can show a
high-humidity warning for configured humidifiers. Device information and
settings are not sent to hardware or a backend. If saved browser data cannot
be read or written, the dashboard displays a warning instead of silently
overwriting it.

This repository currently contains no backend API, database, ESP32 firmware,
sensor-health telemetry, appliance feedback, or confirmed switching hardware.
The dashboard therefore reports appliance state as unknown and does not claim
that local humidity control, sensor fault handling, or hardware safety
interlocks are implemented. Device-side control must be implemented and tested
on the ESP32 with the actual sensors and appropriately rated, isolated
hardware before enabling appliances. Do not connect mains-powered appliances
directly to ESP32 GPIO pins.

The initial configurable prototype thresholds are 40% RH activation / 45% RH
stop for humidifiers and 60% RH activation / 55% RH stop for dehumidifiers.
These are adjustable prototype starting values, not universal
recommendations. A humidifier cannot be saved without explicitly entering a
high-humidity safety limit; the project does not assume a value for it. The
form's 300-second confirmation period, three consecutive valid readings,
10-minute minimum off-time, and 120-minute maximum runtime are provisional
examples, not validated hardware safety settings. The frontend does not
enforce these runtime behaviors.

No historical reading data is currently available to plot. The existing trend
chart uses placeholder values, not stored sensor history.

## Team

AeroSense Development Team
