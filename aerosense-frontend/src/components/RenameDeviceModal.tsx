import type { Device } from "../types/device";

type RenameDeviceModalProps = {
  device: Device;
  darkMode: boolean;
  newName: string;
  onNameChange: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function RenameDeviceModal({
  device,
  darkMode,
  newName,
  onNameChange,
  onClose,
  onSave,
}: RenameDeviceModalProps) {
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Rename device
            </h3>

            <p className={`mt-1 text-sm ${secondaryText}`}>
              Device ID: {device.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close rename dialog"
            className={`text-xl ${secondaryText}`}
          >
            ×
          </button>
        </div>

        <label
          htmlFor="device-name"
          className={`mt-6 block text-sm font-medium ${
            darkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Device name
        </label>

        <input
          id="device-name"
          autoFocus
          value={newName}
          onChange={(event) => onNameChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSave();
            }
          }}
          className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ${
            darkMode
              ? "border-slate-700 bg-slate-950 text-white focus:border-emerald-500"
              : "border-slate-200 bg-slate-50 text-slate-900 focus:border-emerald-500"
          }`}
          placeholder="Example: 3rd Floor Room 305"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
              darkMode
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Save name
          </button>
        </div>
      </div>
    </div>
  );
}
