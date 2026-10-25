import { Plus } from "lucide-react";
import type { Device } from "../types/device";
import { getAirQualityClass, getStatusDot } from "../utils/devicePresentation";
import { getHumidityStatus, hasHighHumidityAlert } from "../utils/humidityControl";

type DevicesPageProps = {
  devices: Device[];
  darkMode: boolean;
  onAddDevice: () => void;
  onSelectDevice: (deviceId: string) => void;
};

export default function DevicesPage({
  devices,
  darkMode,
  onAddDevice,
  onSelectDevice,
}: DevicesPageProps) {
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBackground = darkMode
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";

  return (
    <section>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h3 className={`text-2xl font-bold sm:text-3xl ${darkMode ? "text-white" : "text-slate-900"}`}>
            All Devices
          </h3>
          <p className={`mt-2 ${secondaryText}`}>
            Manage and monitor your AeroSense devices.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddDevice}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add test device
        </button>
      </div>

      <p className={`mb-4 text-sm sm:mb-5 ${secondaryText}`}>
        Test devices are created locally in this page and do not connect to hardware.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => onSelectDevice(device.id)}
            className={`min-w-0 rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 sm:p-5 ${cardBackground}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex items-center gap-2 text-xs font-medium ${
                  device.online ? "text-emerald-500" : secondaryText
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(device.online)}`} />
                {device.online ? "Online" : "Offline"}
              </span>
              <span
                className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium sm:px-3 sm:text-xs ${getAirQualityClass(
                  device.airQuality,
                  darkMode
                )}`}
              >
                {device.airQuality}
              </span>
            </div>

            <h4 className={`mt-4 break-words text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              {device.name}
            </h4>
            <p className={`mt-1 text-sm ${secondaryText}`}>{device.id}</p>
            <p className={`mt-1 text-sm ${secondaryText}`}>{device.location}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
              <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <p className={`text-xs ${secondaryText}`}>CO₂</p>
                <p className={`mt-1 break-words text-sm font-bold sm:text-base ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {device.co2 === null ? "--" : `${device.co2} ppm`}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <p className={`text-xs ${secondaryText}`}>PM2.5</p>
                <p className={`mt-1 break-words text-sm font-bold sm:text-base ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {device.pm25 === null ? "--" : `${device.pm25} µg/m³`}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <p className={`text-xs ${secondaryText}`}>Humidity</p>
                <p className={`mt-1 break-words text-sm font-bold sm:text-base ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {device.humidity === null ? "--" : `${device.humidity}% RH`}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <p className={`text-xs ${secondaryText}`}>Humidity status</p>
                <p className={`mt-1 font-bold ${
                  hasHighHumidityAlert(device)
                    ? "text-amber-500"
                    : darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}>
                  {getHumidityStatus(device)}
                </p>
              </div>
            </div>
            <p className={`mt-4 break-words text-xs ${secondaryText}`}>
              Appliance: {device.humidityControl.applianceType} · State: Unknown (no device feedback)
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
