import { initialDevices } from "../data/devices";
import type { AirQuality, Device, HumidityControlConfig } from "../types/device";
import { validateHumidityControlConfig } from "./humidityControl";

const DEVICE_STORAGE_KEY = "airosense-devices-v1";

export type StoredDeviceState = {
  devices: Device[];
  error: string | null;
  recoveryAction: "replace" | "retry" | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isHumidityControlConfig(
  value: unknown
): value is HumidityControlConfig {
  if (!isRecord(value)) {
    return false;
  }

  const applianceType = value.applianceType;
  const automaticEnabled = value.automaticEnabled;
  const activationHumidity = value.activationHumidity;
  const shutdownHumidity = value.shutdownHumidity;
  const highHumidityLimit = value.highHumidityLimit;
  const confirmationPeriodSeconds = value.confirmationPeriodSeconds;
  const requiredConsecutiveReadings = value.requiredConsecutiveReadings;
  const minimumOffTimeMinutes = value.minimumOffTimeMinutes;
  const maximumRuntimeMinutes = value.maximumRuntimeMinutes;

  if (
    (applianceType !== "humidifier" &&
      applianceType !== "dehumidifier" &&
      applianceType !== "none") ||
    typeof automaticEnabled !== "boolean" ||
    !isFiniteNumber(activationHumidity) ||
    !isFiniteNumber(shutdownHumidity) ||
    (highHumidityLimit !== null && !isFiniteNumber(highHumidityLimit)) ||
    !isFiniteNumber(confirmationPeriodSeconds) ||
    !isFiniteNumber(requiredConsecutiveReadings) ||
    !isFiniteNumber(minimumOffTimeMinutes) ||
    !isFiniteNumber(maximumRuntimeMinutes)
  ) {
    return false;
  }

  const config: HumidityControlConfig = {
    applianceType,
    automaticEnabled,
    activationHumidity,
    shutdownHumidity,
    highHumidityLimit,
    confirmationPeriodSeconds,
    requiredConsecutiveReadings,
    minimumOffTimeMinutes,
    maximumRuntimeMinutes,
  };

  return validateHumidityControlConfig(config) === null;
}

function isDevice(value: unknown): value is Device {
  if (!isRecord(value)) {
    return false;
  }

  const airQuality = value.airQuality as AirQuality;
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    typeof value.location === "string" &&
    typeof value.online === "boolean" &&
    isNullableNumber(value.co2) &&
    isNullableNumber(value.pm25) &&
    isNullableNumber(value.pm10) &&
    isNullableNumber(value.temperature) &&
    isNullableNumber(value.humidity) &&
    (airQuality === "Good" ||
      airQuality === "Moderate" ||
      airQuality === "Poor" ||
      airQuality === "Unknown") &&
    typeof value.lastUpdated === "string" &&
    isHumidityControlConfig(value.humidityControl)
  );
}

export function loadStoredDevices(): StoredDeviceState {
  let serialized: string | null;
  try {
    serialized = localStorage.getItem(DEVICE_STORAGE_KEY);
  } catch {
    return {
      devices: initialDevices,
      error: "Could not access browser storage. Device changes are not being saved.",
      recoveryAction: "retry",
    };
  }

  if (serialized === null) {
    return { devices: initialDevices, error: null, recoveryAction: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return {
      devices: initialDevices,
      error:
        "Saved device data could not be read. It has been preserved; choose Replace saved data to start over.",
      recoveryAction: "replace",
    };
  }

  if (
    !Array.isArray(parsed) ||
    !parsed.every(isDevice) ||
    new Set(parsed.map((device) => device.id)).size !== parsed.length
  ) {
    return {
      devices: initialDevices,
      error:
        "Saved device data is invalid. It has been preserved; choose Replace saved data to start over.",
      recoveryAction: "replace",
    };
  }

  return { devices: parsed, error: null, recoveryAction: null };
}

export function saveStoredDevices(devices: Device[]): string | null {
  try {
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
    return null;
  } catch {
    return "Could not save device changes to browser storage. Check available storage and retry.";
  }
}
