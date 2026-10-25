import { useState } from "react";
import type {
  ApplianceType,
  Device,
  HumidityControlConfig,
} from "../types/device";
import { validateHumidityControlConfig } from "../utils/humidityControl";

type HumidityControlModalProps = {
  device: Device;
  darkMode: boolean;
  onClose: () => void;
  onSave: (config: HumidityControlConfig) => void;
};

function configurationForAppliance(
  config: HumidityControlConfig,
  applianceType: ApplianceType
): HumidityControlConfig {
  if (applianceType === "humidifier") {
    return {
      ...config,
      applianceType,
      activationHumidity: 40,
      shutdownHumidity: 45,
      highHumidityLimit: null,
    };
  }
  if (applianceType === "dehumidifier") {
    return {
      ...config,
      applianceType,
      activationHumidity: 60,
      shutdownHumidity: 55,
      highHumidityLimit: null,
    };
  }
  return {
    ...config,
    applianceType,
    automaticEnabled: false,
    highHumidityLimit: null,
  };
}

export default function HumidityControlModal({
  device,
  darkMode,
  onClose,
  onSave,
}: HumidityControlModalProps) {
  const [config, setConfig] = useState(device.humidityControl);
  const [error, setError] = useState("");
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";
  const inputClass = `mt-1 min-h-11 w-full rounded-lg border px-3 py-2 text-base sm:text-sm ${
    darkMode
      ? "border-slate-700 bg-slate-950 text-white"
      : "border-slate-200 bg-white text-slate-900"
  }`;

  function updateNumber(
    field: keyof HumidityControlConfig,
    value: string
  ) {
    const parsed = value === "" ? Number.NaN : Number(value);
    setConfig((current) => ({ ...current, [field]: parsed }));
  }

  function save() {
    const validationError = validateHumidityControlConfig(config);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(config);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="humidity-control-title"
        className={`my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-2xl border p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6 ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="humidity-control-title"
              className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Humidity control settings
            </h3>
            <p className={`mt-1 text-sm ${secondaryText}`}>
              {device.name} · {device.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close humidity settings"
            className={`flex h-11 w-11 shrink-0 items-center justify-center text-xl ${secondaryText}`}
          >
            ×
          </button>
        </div>

        <p className={`mt-4 rounded-xl p-3 text-sm ${
          darkMode ? "bg-amber-500/10 text-amber-200" : "bg-amber-50 text-amber-800"
        }`}>
          These settings are saved in this browser only. There is no backend or
          firmware connection, so saving will not control an appliance.
          Confirm the installed appliance and switching hardware before
          enabling device-side control.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
            Assigned appliance
            <select
              value={config.applianceType}
              onChange={(event) =>
                setConfig((current) =>
                  configurationForAppliance(
                    current,
                    event.target.value as ApplianceType
                  )
                )
              }
              className={inputClass}
            >
              <option value="none">None / not confirmed</option>
              <option value="humidifier">Humidifier</option>
              <option value="dehumidifier">Dehumidifier</option>
            </select>
          </label>

          <label className={`flex min-h-11 items-center gap-3 rounded-lg border p-3 text-sm sm:self-end ${
            darkMode
              ? "border-slate-700 text-slate-200"
              : "border-slate-200 text-slate-700"
          }`}>
            <input
              type="checkbox"
              checked={config.automaticEnabled}
              disabled={config.applianceType === "none"}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  automaticEnabled: event.target.checked,
                }))
              }
            />
            Automatic control enabled
          </label>

          {config.applianceType !== "none" && (
            <>
              <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                {config.applianceType === "humidifier"
                  ? "Start below (% RH)"
                  : "Start above (% RH)"}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={Number.isFinite(config.activationHumidity) ? config.activationHumidity : ""}
                  onChange={(event) => updateNumber("activationHumidity", event.target.value)}
                  className={inputClass}
                />
              </label>

              <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                Stop at (% RH)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={Number.isFinite(config.shutdownHumidity) ? config.shutdownHumidity : ""}
                  onChange={(event) => updateNumber("shutdownHumidity", event.target.value)}
                  className={inputClass}
                />
              </label>

              {config.applianceType === "humidifier" && (
                <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  High-humidity safety limit (% RH)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={config.highHumidityLimit ?? ""}
                    onChange={(event) => updateNumber("highHumidityLimit", event.target.value)}
                    className={inputClass}
                  />
                </label>
              )}
            </>
          )}

          <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
            Confirmation period (seconds)
            <input
              type="number"
              min="0"
              step="1"
              value={config.confirmationPeriodSeconds}
              onChange={(event) => updateNumber("confirmationPeriodSeconds", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
            Consecutive valid readings
            <input
              type="number"
              min="1"
              step="1"
              value={config.requiredConsecutiveReadings}
              onChange={(event) => updateNumber("requiredConsecutiveReadings", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
            Minimum off-time (minutes)
            <input
              type="number"
              min="0"
              step="1"
              value={config.minimumOffTimeMinutes}
              onChange={(event) => updateNumber("minimumOffTimeMinutes", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
            Maximum runtime (minutes)
            <input
              type="number"
              min="1"
              step="1"
              value={config.maximumRuntimeMinutes}
              onChange={(event) => updateNumber("maximumRuntimeMinutes", event.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-medium ${
              darkMode
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="min-h-11 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
