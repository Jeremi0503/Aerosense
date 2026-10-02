export type AirQuality = "Good" | "Moderate" | "Poor" | "Unknown";

export type Device = {
  id: string;
  name: string;
  location: string;
  online: boolean;
  co2: number | null;
  pm25: number | null;
  pm10: number | null;
  temperature: number | null;
  humidity: number | null;
  airQuality: AirQuality;
  lastUpdated: string;
};

export type AppPage = "Dashboard" | "Devices" | "Alerts";
