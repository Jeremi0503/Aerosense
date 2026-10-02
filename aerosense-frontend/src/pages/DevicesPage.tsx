import { Bluetooth, Plus } from "lucide-react";
import type { Device } from "../types/device";
import { getAirQualityClass, getStatusDot } from "../utils/devicePresentation";

type DevicesPageProps = {
  devices: Device[];
  darkMode: boolean;
  isDiscovering: boolean;
  bluetoothMessage: string;
  bluetoothError: boolean;
  onAddDevice: () => void;
  onSelectDevice: (deviceId: string) => void;
};

export default function DevicesPage({
  devices,
  darkMode,
  isDiscovering,
  bluetoothMessage,
  bluetoothError,
  onAddDevice,
  onSelectDevice,
}: DevicesPageProps) {
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBackground = darkMode
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            All Devices
          </h3>
          <p className={`mt-2 ${secondaryText}`}>
            Manage and monitor your AeroSense devices.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddDevice}
          disabled={isDiscovering}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
        >
          {isDiscovering ? (
            <Bluetooth className="h-4 w-4 animate-pulse" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          {isDiscovering ? "Searching..." : "Add device"}
        </button>
      </div>

      {bluetoothMessage && (
        <p
          role="status"
          className={`mb-5 text-sm ${
            bluetoothError
              ? darkMode
                ? "text-amber-300"
                : "text-amber-700"
              : darkMode
              ? "text-emerald-300"
              : "text-emerald-700"
          }`}
        >
          {bluetoothMessage}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => onSelectDevice(device.id)}
            className={`rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${cardBackground}`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex items-center gap-2 text-xs font-medium ${
                  device.online ? "text-emerald-500" : secondaryText
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(device.online)}`} />
                {device.online ? "Online" : "Offline"}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getAirQualityClass(
                  device.airQuality,
                  darkMode
                )}`}
              >
                {device.airQuality}
              </span>
            </div>

            <h4 className={`mt-4 text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              {device.name}
            </h4>
            <p className={`mt-1 text-sm ${secondaryText}`}>{device.id}</p>
            <p className={`mt-1 text-sm ${secondaryText}`}>{device.location}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <p className={`text-xs ${secondaryText}`}>CO₂</p>
                <p className={`mt-1 font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {device.co2 === null ? "--" : `${device.co2} ppm`}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <p className={`text-xs ${secondaryText}`}>PM2.5</p>
                <p className={`mt-1 font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {device.pm25 === null ? "--" : `${device.pm25} µg/m³`}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
