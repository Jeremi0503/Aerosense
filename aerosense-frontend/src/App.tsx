import { useEffect, useMemo, useState } from "react";
import AlertsPage from "./pages/AlertsPage";
import DashboardPage from "./pages/DashboardPage";
import DevicesPage from "./pages/DevicesPage";
import AddMockDeviceModal from "./components/AddMockDeviceModal";
import HumidityControlModal from "./components/HumidityControlModal";
import RenameDeviceModal from "./components/RenameDeviceModal";
import { initialDevices } from "./data/devices";
import type { AppPage, Device, HumidityControlConfig } from "./types/device";
import { loadStoredDevices, saveStoredDevices } from "./utils/deviceStorage";
import { hasHighHumidityAlert } from "./utils/humidityControl";

const pages: AppPage[] = ["Dashboard", "Devices", "Alerts"];

export default function App() {
  const [storedDeviceState] = useState(loadStoredDevices);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("airosense-dark-mode");
    return saved === "true";
  });
  const [devices, setDevices] = useState<Device[]>(storedDeviceState.devices);
  const [deviceStorageError, setDeviceStorageError] = useState(
    storedDeviceState.error
  );
  const [storageRecoveryAction, setStorageRecoveryAction] = useState(
    storedDeviceState.recoveryAction
  );
  const [devicePersistenceEnabled, setDevicePersistenceEnabled] = useState(
    storedDeviceState.recoveryAction === null
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDevices[0].id);
  const [search, setSearch] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [humiditySettingsOpen, setHumiditySettingsOpen] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [newName, setNewName] = useState("");
  const [activePage, setActivePage] = useState<AppPage>("Dashboard");

  const selectedDevice =
    devices.find((device) => device.id === selectedDeviceId) ?? devices[0];

  useEffect(() => {
    localStorage.setItem("airosense-dark-mode", String(darkMode));
    document.body.classList.toggle("bg-slate-950", darkMode);
    document.body.classList.toggle("bg-slate-50", !darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    if (!devicePersistenceEnabled) {
      return;
    }

    const error = saveStoredDevices(devices);
    if (error) {
      setDevicePersistenceEnabled(false);
      setDeviceStorageError(error);
      setStorageRecoveryAction("retry");
      return;
    }

    setDeviceStorageError(null);
    setStorageRecoveryAction(null);
  }, [devices, devicePersistenceEnabled]);

  const filteredDevices = useMemo(() => {
    const searchText = search.toLowerCase();
    return devices.filter(
      (device) =>
        device.name.toLowerCase().includes(searchText) ||
        device.id.toLowerCase().includes(searchText) ||
        device.location.toLowerCase().includes(searchText)
    );
  }, [devices, search]);

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((device) => device.online).length;
  const warningDevices = devices.filter(
    (device) =>
      device.airQuality === "Moderate" ||
      device.airQuality === "Poor" ||
      hasHighHumidityAlert(device)
  ).length;

  function openRename() {
    setNewName(selectedDevice.name);
    setRenameOpen(true);
  }

  function saveRename() {
    if (!newName.trim()) {
      return;
    }

    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.id === selectedDevice.id
          ? { ...device, name: newName.trim() }
          : device
      )
    );
    setRenameOpen(false);
  }

  function saveHumiditySettings(config: HumidityControlConfig) {
    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.id === selectedDevice.id
          ? { ...device, humidityControl: config }
          : device
      )
    );
    setSettingsMessage(
      "Humidity settings updated in this browser only. No device or appliance was changed."
    );
    setHumiditySettingsOpen(false);
  }

  function addMockDevice(name: string, location: string) {
    const randomValue = (minimum: number, maximum: number, decimals = 0) =>
      Number((minimum + Math.random() * (maximum - minimum)).toFixed(decimals));
    const nextId = devices.reduce((highestId, device) => {
      const match = /^AS-(\d+)$/.exec(device.id);
      return match ? Math.max(highestId, Number(match[1])) : highestId;
    }, 0) + 1;
    const newDevice: Device = {
      id: `AS-${String(nextId).padStart(4, "0")}`,
      name,
      location,
      online: true,
      co2: randomValue(420, 650),
      pm25: randomValue(2, 10, 1),
      pm10: randomValue(5, 18, 1),
      temperature: randomValue(21, 24, 1),
      humidity: randomValue(45, 55, 1),
      airQuality: "Good",
      lastUpdated: "Mock readings · Just now",
      humidityControl: {
        applianceType: "none",
        automaticEnabled: false,
        activationHumidity: 40,
        shutdownHumidity: 45,
        highHumidityLimit: null,
        confirmationPeriodSeconds: 300,
        requiredConsecutiveReadings: 3,
        minimumOffTimeMinutes: 10,
        maximumRuntimeMinutes: 120,
      },
    };

    setDevices((currentDevices) => [...currentDevices, newDevice]);
    setSelectedDeviceId(newDevice.id);
    setAddDeviceOpen(false);
    setActivePage("Dashboard");
  }

  const pageBackground = darkMode
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-900";
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen ${pageBackground}`}>
      <div className="flex min-h-screen">
        <aside
          className={`hidden w-64 flex-col border-r p-5 md:flex ${
            darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-xl font-bold text-white">
              A
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                AeroSense
              </h1>
              <p className={`text-xs ${secondaryText}`}>
                Air Quality Monitoring
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {pages.map((page) => {
              const active = activePage === page;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setActivePage(page)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500 text-white"
                      : darkMode
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>
                    {page === "Dashboard" ? "▦" : page === "Devices" ? "◉" : "⚠"}
                  </span>
                  {page}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div
              className={`rounded-2xl border p-4 ${
                darkMode
                  ? "border-slate-800 bg-slate-950"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className={`text-xs font-semibold uppercase ${secondaryText}`}>
                Connected devices
              </p>
              <p className={`mt-2 text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                {onlineDevices}/{totalDevices}
              </p>
              <p className={`mt-1 text-xs ${secondaryText}`}>
                Devices currently online
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header
            className={`sticky top-0 z-20 border-b backdrop-blur ${
              darkMode
                ? "border-slate-800 bg-slate-950/90"
                : "border-slate-200 bg-slate-50/90"
            }`}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 md:px-8">
              <div>
                <p className={`hidden text-xs sm:block ${secondaryText}`}>Monitoring</p>
                <h2 className={`text-lg font-bold sm:text-xl ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {activePage}
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setDarkMode((value) => !value)}
                  className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
                    darkMode
                      ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  title="Toggle dark mode"
                >
                  <span>{darkMode ? "☀️" : "🌙"}</span>
                  <span className="hidden sm:block">
                    {darkMode ? "Light" : "Dark"}
                  </span>
                </button>
                <div
                  aria-label="AeroSense profile"
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                    darkMode
                      ? "bg-slate-800 text-slate-200"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  A
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-4 pb-28 sm:p-5 sm:pb-28 md:p-8 md:pb-8">
            {deviceStorageError && (
              <div
                role="alert"
                className={`mb-5 flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
                  darkMode
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                <p className="text-sm">{deviceStorageError}</p>
                <button
                  type="button"
                  onClick={() => setDevicePersistenceEnabled(true)}
                  className="shrink-0 rounded-lg border border-current px-3 py-2 text-sm font-semibold"
                >
                  {storageRecoveryAction === "replace"
                    ? "Replace saved data"
                    : "Retry saving"}
                </button>
              </div>
            )}
            {activePage === "Dashboard" && (
              <DashboardPage
                filteredDevices={filteredDevices}
                selectedDevice={selectedDevice}
                search={search}
                darkMode={darkMode}
                totalDevices={totalDevices}
                onlineDevices={onlineDevices}
                warningDevices={warningDevices}
                onSearchChange={setSearch}
                onSelectDevice={setSelectedDeviceId}
                onRenameDevice={openRename}
                onConfigureHumidity={() => {
                  setSettingsMessage("");
                  setHumiditySettingsOpen(true);
                }}
                settingsMessage={settingsMessage}
              />
            )}
            {activePage === "Devices" && (
              <DevicesPage
                devices={devices}
                darkMode={darkMode}
                onAddDevice={() => setAddDeviceOpen(true)}
                onSelectDevice={(deviceId) => {
                  setSelectedDeviceId(deviceId);
                  setActivePage("Dashboard");
                }}
              />
            )}
            {activePage === "Alerts" && (
              <AlertsPage
                devices={devices}
                darkMode={darkMode}
                onViewDevice={(deviceId) => {
                  setSelectedDeviceId(deviceId);
                  setActivePage("Dashboard");
                }}
              />
            )}
          </div>
        </main>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <nav aria-label="Main navigation" className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          {pages.map((page) => {
            const active = activePage === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                aria-current={active ? "page" : undefined}
                className={`min-h-11 rounded-xl px-2 py-2.5 text-xs font-semibold sm:text-sm ${
                  active
                    ? "bg-emerald-500 text-white"
                    : darkMode
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}
              >
                {page}
              </button>
            );
          })}
        </nav>
      </div>

      {renameOpen && (
        <RenameDeviceModal
          device={selectedDevice}
          darkMode={darkMode}
          newName={newName}
          onNameChange={setNewName}
          onClose={() => setRenameOpen(false)}
          onSave={saveRename}
        />
      )}
      {addDeviceOpen && (
        <AddMockDeviceModal
          darkMode={darkMode}
          onClose={() => setAddDeviceOpen(false)}
          onAdd={addMockDevice}
        />
      )}
      {humiditySettingsOpen && (
        <HumidityControlModal
          device={selectedDevice}
          darkMode={darkMode}
          onClose={() => setHumiditySettingsOpen(false)}
          onSave={saveHumiditySettings}
        />
      )}
    </div>
  );
}
