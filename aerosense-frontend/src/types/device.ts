export type AirQuality = "Good" | "Moderate" | "Poor" | "Unknown";
export type ApplianceType = "humidifier" | "dehumidifier" | "none";

export type HumidityControlConfig = {
  applianceType: ApplianceType;
  automaticEnabled: boolean;
  activationHumidity: number;
  shutdownHumidity: number;
  highHumidityLimit: number | null;
  confirmationPeriodSeconds: number;
  requiredConsecutiveReadings: number;
  minimumOffTimeMinutes: number;
  maximumRuntimeMinutes: number;
};

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
  humidityControl: HumidityControlConfig;
};

export type AppPage = "Dashboard" | "Devices" | "Alerts";
