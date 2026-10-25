import type { Device } from "../types/device";
import { hasHighHumidityAlert } from "../utils/humidityControl";

type AlertsPageProps = {
  devices: Device[];
  darkMode: boolean;
  onViewDevice: (deviceId: string) => void;
};

export default function AlertsPage({
  devices,
  darkMode,
  onViewDevice,
}: AlertsPageProps) {
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBackground = darkMode
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";
  const alertDevices = devices.filter(
    (device) =>
      device.airQuality === "Moderate" ||
      device.airQuality === "Poor" ||
      hasHighHumidityAlert(device)
  );

  return (
    <section>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold sm:text-3xl ${darkMode ? "text-white" : "text-slate-900"}`}>
          Alerts
        </h3>
        <p className={`mt-2 ${secondaryText}`}>
          Devices that may need attention.
        </p>
      </div>

      <div className="space-y-4">
        {alertDevices.map((device) => (
          <div
            key={device.id}
            className={`rounded-2xl border p-4 sm:p-5 ${cardBackground}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                    ⚠
                  </div>
                  <div>
                    <h4 className={`break-words font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {device.name}
                    </h4>
                    <p className={`text-sm ${secondaryText}`}>{device.id}</p>
                  </div>
                </div>

                {device.airQuality === "Moderate" || device.airQuality === "Poor" ? (
                  <p className={`mt-4 break-words text-sm ${secondaryText}`}>
                    This device currently reports{" "}
                    <strong className={darkMode ? "text-amber-300" : "text-amber-700"}>
                      {device.airQuality.toLowerCase()}
                    </strong>{" "}
                    air quality.
                  </p>
                ) : null}
                {hasHighHumidityAlert(device) && (
                  <p className={`mt-3 break-words text-sm ${darkMode ? "text-amber-300" : "text-amber-700"}`}>
                    Relative humidity ({device.humidity}% RH) reached the
                    configured high-humidity safety limit (
                    {device.humidityControl.highHumidityLimit}% RH). Device-side
                    shutdown is not connected in this prototype.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onViewDevice(device.id)}
                className="min-h-11 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 sm:w-auto"
              >
                View Device
              </button>
            </div>
          </div>
        ))}

        {alertDevices.length === 0 && (
          <div className={`rounded-2xl border p-8 text-center ${cardBackground}`}>
            <div className="text-4xl">✓</div>
            <h4 className={`mt-3 text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              No active alerts
            </h4>
            <p className={`mt-1 text-sm ${secondaryText}`}>
              No air-quality or configured high-humidity alerts are active.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
