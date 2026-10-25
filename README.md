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
* Dark mode
* Responsive dashboard

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

The current frontend uses mock sensor data. The next stage is to connect the frontend to the AeroSense backend API and live ESP32 sensor data.

## Team

AeroSense Development Team
