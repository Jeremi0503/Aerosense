import type { Device, HumidityControlConfig } from "../types/device";

export type HumidityStatus = "Too Dry" | "Within Target" | "Too Humid" | "Not configured" | "Unavailable";

export function getHumidityStatus(device: Device): HumidityStatus {
  const { humidity, humidityControl } = device;

  if (
    !device.online ||
    humidity === null ||
    !Number.isFinite(humidity) ||
    humidity < 0 ||
    humidity > 100
  ) {
    return "Unavailable";
  }

  if (humidityControl.applianceType === "humidifier") {
    if (humidity < humidityControl.activationHumidity) {
      return "Too Dry";
    }
    if (
      humidityControl.highHumidityLimit !== null &&
      humidity >= humidityControl.highHumidityLimit
    ) {
      return "Too Humid";
    }
    return "Within Target";
  }

  if (humidityControl.applianceType === "dehumidifier") {
    if (humidity > humidityControl.activationHumidity) {
      return "Too Humid";
    }
    if (humidity <= humidityControl.shutdownHumidity) {
      return "Too Dry";
    }
    return "Within Target";
  }

  return "Not configured";
}

export function validateHumidityControlConfig(
  config: HumidityControlConfig
): string | null {
  if (config.applianceType === "none" && config.automaticEnabled) {
    return "Automatic control cannot be enabled without an assigned appliance.";
  }

  const humidityValues = [
    config.activationHumidity,
    config.shutdownHumidity,
    ...(config.highHumidityLimit === null ? [] : [config.highHumidityLimit]),
  ];
  if (
    humidityValues.some(
      (value) => !Number.isFinite(value) || value < 0 || value > 100
    )
  ) {
    return "Humidity thresholds must be between 0 and 100% RH.";
  }

  if (config.applianceType === "humidifier") {
    if (
      config.highHumidityLimit === null ||
      config.activationHumidity >= config.shutdownHumidity ||
      config.shutdownHumidity >= config.highHumidityLimit
    ) {
      return "For a humidifier, activation must be below the stop threshold, which must be below the high-humidity safety limit.";
    }
  }

  if (
    config.applianceType === "dehumidifier" &&
    config.shutdownHumidity >= config.activationHumidity
  ) {
    return "For a dehumidifier, the stop threshold must be below the activation threshold.";
  }

  if (
    !Number.isInteger(config.confirmationPeriodSeconds) ||
    config.confirmationPeriodSeconds < 0 ||
    !Number.isInteger(config.requiredConsecutiveReadings) ||
    config.requiredConsecutiveReadings < 1 ||
    !Number.isInteger(config.minimumOffTimeMinutes) ||
    config.minimumOffTimeMinutes < 0 ||
    !Number.isInteger(config.maximumRuntimeMinutes) ||
    config.maximumRuntimeMinutes < 1
  ) {
    return "Timing settings must be whole numbers; readings must be at least 1 and maximum runtime must be positive.";
  }

  return null;
}

export function hasHighHumidityAlert(device: Device): boolean {
  return (
    device.online &&
    device.humidityControl.applianceType === "humidifier" &&
    device.humidity !== null &&
    Number.isFinite(device.humidity) &&
    device.humidityControl.highHumidityLimit !== null &&
    device.humidity >= device.humidityControl.highHumidityLimit
  );
}
