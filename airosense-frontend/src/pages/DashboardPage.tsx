import StatCard from "../components/StatCard";
import { chartValues } from "../data/devices";
import type { Device } from "../types/device";
import { getAirQualityClass, getStatusDot } from "../utils/devicePresentation";

type DashboardPageProps = {
  filteredDevices: Device[];
  selectedDevice: Device;
  search: string;
  darkMode: boolean;
  totalDevices: number;
  onlineDevices: number;
  warningDevices: number;
  onSearchChange: (search: string) => void;
  onSelectDevice: (deviceId: string) => void;
  onRenameDevice: () => void;
};

export default function DashboardPage({
  filteredDevices,
  selectedDevice,
  search,
  darkMode,
  totalDevices,
  onlineDevices,
  warningDevices,
  onSearchChange,
  onSelectDevice,
  onRenameDevice,
}: DashboardPageProps) {
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBackground = darkMode
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";

  return (
    <>
      <section className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <p className={`text-sm font-medium ${secondaryText}`}>
            System is running normally
          </p>
        </div>

        <h3
          className={`text-3xl font-bold tracking-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Welcome to AeroSense
        </h3>
        <p className={`mt-2 max-w-2xl ${secondaryText}`}>
          Monitor the air quality of every connected room from one dashboard.
        </p>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Devices"
          value={String(totalDevices)}
          unit="devices"
          icon="◉"
          accent={darkMode ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-50 text-emerald-600"}
          darkMode={darkMode}
        />
        <StatCard
          title="Online"
          value={String(onlineDevices)}
          unit="devices"
          icon="✓"
          accent={darkMode ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-600"}
          darkMode={darkMode}
        />
        <StatCard
          title="Needs Attention"
          value={String(warningDevices)}
          unit="devices"
          icon="!"
          accent={darkMode ? "bg-amber-500/15 text-amber-300" : "bg-amber-50 text-amber-600"}
          darkMode={darkMode}
        />
        <StatCard
          title="Current CO₂"
          value={selectedDevice.co2 === null ? "--" : String(selectedDevice.co2)}
          unit={selectedDevice.co2 === null ? "" : "ppm"}
          icon="CO₂"
          accent={darkMode ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-600"}
          darkMode={darkMode}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className={`rounded-2xl border p-5 shadow-sm ${cardBackground}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Your Devices
              </h4>
              <p className={`mt-1 text-sm ${secondaryText}`}>
                Select a device to see its latest readings.
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search devices..."
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none sm:w-56 ${
                darkMode
                  ? "border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500"
              }`}
            />
          </div>

          <div className="mt-5 space-y-3">
            {filteredDevices.map((device) => {
              const active = selectedDevice.id === device.id;

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => onSelectDevice(device.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    active
                      ? darkMode
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : "border-emerald-300 bg-emerald-50"
                      : darkMode
                      ? "border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(device.online)}`} />
                        <p className={`truncate font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {device.name}
                        </p>
                      </div>
                      <p className={`mt-1 text-xs ${secondaryText}`}>
                        {device.id} • {device.location}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getAirQualityClass(
                        device.airQuality,
                        darkMode
                      )}`}
                    >
                      {device.airQuality}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredDevices.length === 0 && (
              <div className={`rounded-xl border border-dashed p-8 text-center text-sm ${secondaryText}`}>
                No devices found.
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 shadow-sm ${cardBackground}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(selectedDevice.online)}`} />
                <span className={`text-xs font-medium ${selectedDevice.online ? "text-emerald-500" : secondaryText}`}>
                  {selectedDevice.online ? "Online" : "Offline"}
                </span>
              </div>
              <h4 className={`mt-2 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                {selectedDevice.name}
              </h4>
              <p className={`mt-1 text-sm ${secondaryText}`}>{selectedDevice.id}</p>
            </div>

            <button
              type="button"
              onClick={onRenameDevice}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                darkMode
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Rename
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard
              title="CO₂"
              value={selectedDevice.co2 === null ? "--" : String(selectedDevice.co2)}
              unit={selectedDevice.co2 === null ? "" : "ppm"}
              icon="CO₂"
              accent={darkMode ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-600"}
              darkMode={darkMode}
            />
            <StatCard
              title="PM2.5"
              value={selectedDevice.pm25 === null ? "--" : String(selectedDevice.pm25)}
              unit={selectedDevice.pm25 === null ? "" : "µg/m³"}
              icon="PM"
              accent={darkMode ? "bg-amber-500/15 text-amber-300" : "bg-amber-50 text-amber-600"}
              darkMode={darkMode}
            />
            <StatCard
              title="Temperature"
              value={selectedDevice.temperature === null ? "--" : String(selectedDevice.temperature)}
              unit={selectedDevice.temperature === null ? "" : "°C"}
              icon="°"
              accent={darkMode ? "bg-red-500/15 text-red-300" : "bg-red-50 text-red-600"}
              darkMode={darkMode}
            />
            <StatCard
              title="Humidity"
              value={selectedDevice.humidity === null ? "--" : String(selectedDevice.humidity)}
              unit={selectedDevice.humidity === null ? "" : "%"}
              icon="%"
              accent={darkMode ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-600"}
              darkMode={darkMode}
            />
          </div>

          <div className={`mt-4 rounded-xl border p-4 ${darkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium uppercase tracking-wide ${secondaryText}`}>
                  Air Quality
                </p>
                <p className={`mt-1 text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {selectedDevice.airQuality}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getAirQualityClass(
                  selectedDevice.airQuality,
                  darkMode
                )}`}
              >
                {selectedDevice.airQuality}
              </span>
            </div>
          </div>
          <p className={`mt-4 text-xs ${secondaryText}`}>
            Last updated: {selectedDevice.lastUpdated}
          </p>
        </div>
      </section>

      <section className={`mt-6 rounded-2xl border p-5 shadow-sm ${cardBackground}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              CO₂ Trend
            </h4>
            <p className={`text-sm ${secondaryText}`}>
              Recent readings from {selectedDevice.name}
            </p>
          </div>
          <span className={`text-xs font-medium ${secondaryText}`}>
            Last 12 readings
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl">
          <div className="relative h-64">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className={`border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-end gap-2 px-2 pb-1">
              {chartValues.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full max-w-8 rounded-t-lg bg-emerald-500 transition-all hover:bg-emerald-400"
                    style={{ height: `${value * 2.4}px` }}
                  />
                  <span className={`text-[10px] ${secondaryText}`}>{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
