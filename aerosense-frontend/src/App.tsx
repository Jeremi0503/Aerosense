import { useEffect, useMemo, useState } from "react";
import AlertsPage from "./pages/AlertsPage";
import DashboardPage from "./pages/DashboardPage";
import DevicesPage from "./pages/DevicesPage";
import RenameDeviceModal from "./components/RenameDeviceModal";
import { initialDevices } from "./data/devices";
import useBluetoothDevices from "./hooks/useBluetoothDevices";
import type { AppPage, Device } from "./types/device";

const pages: AppPage[] = ["Dashboard", "Devices", "Alerts"];

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("airosense-dark-mode");
    return saved === "true";
  });
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDevices[0].id);
  const [search, setSearch] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [activePage, setActivePage] = useState<AppPage>("Dashboard");

  const { isDiscovering, message, hasError, discoverDevice } =
    useBluetoothDevices({
      onDeviceConnected: (newDevice) => {
        setDevices((currentDevices) => {
          const alreadyAdded = currentDevices.some(
            (device) => device.id === newDevice.id
          );
          return alreadyAdded
            ? currentDevices.map((device) =>
                device.id === newDevice.id ? { ...device, ...newDevice } : device
              )
            : [...currentDevices, newDevice];
        });
        setSelectedDeviceId(newDevice.id);
      },
      onDeviceDisconnected: (deviceId) => {
        setDevices((currentDevices) =>
          currentDevices.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  online: false,
                  lastUpdated: "Bluetooth disconnected",
                }
              : device
          )
        );
      },
    });

  const selectedDevice =
    devices.find((device) => device.id === selectedDeviceId) ?? devices[0];

  useEffect(() => {
    localStorage.setItem("airosense-dark-mode", String(darkMode));
    document.body.classList.toggle("bg-slate-950", darkMode);
    document.body.classList.toggle("bg-slate-50", !darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

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
    (device) => device.airQuality === "Moderate" || device.airQuality === "Poor"
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

        <main className="flex-1">
          <header
            className={`sticky top-0 z-20 border-b backdrop-blur ${
              darkMode
                ? "border-slate-800 bg-slate-950/90"
                : "border-slate-200 bg-slate-50/90"
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <div>
                <p className={`text-xs ${secondaryText}`}>Monitoring</p>
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {activePage}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDarkMode((value) => !value)}
                  className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
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

          <div className="mx-auto max-w-7xl p-5 pb-24 md:p-8">
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
              />
            )}
            {activePage === "Devices" && (
              <DevicesPage
                devices={devices}
                darkMode={darkMode}
                isDiscovering={isDiscovering}
                bluetoothMessage={message}
                bluetoothError={hasError}
                onAddDevice={discoverDevice}
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
        className={`fixed bottom-0 left-0 right-0 z-30 border-t p-2 md:hidden ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="grid grid-cols-3 gap-2">
          {pages.map((page) => {
            const active = activePage === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={`rounded-xl px-3 py-2.5 text-xs font-semibold ${
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
        </div>
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
    </div>
  );
}
