import { useState } from "react";

type AddMockDeviceModalProps = {
  darkMode: boolean;
  onClose: () => void;
  onAdd: (name: string, location: string) => void;
};

export default function AddMockDeviceModal({
  darkMode,
  onClose,
  onAdd,
}: AddMockDeviceModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const inputClass = `mt-1 min-h-11 w-full rounded-lg border px-3 py-2 text-base sm:text-sm ${
    darkMode
      ? "border-slate-700 bg-slate-950 text-white"
      : "border-slate-200 bg-white text-slate-900"
  }`;

  function submit() {
    if (!name.trim() || !location.trim()) {
      setError("Enter a device name and location.");
      return;
    }
    onAdd(name.trim(), location.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-device-title"
        className={`max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-6 ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <h3
          id="add-device-title"
          className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          Add a test device
        </h3>
        <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          This creates a sample device in the frontend only. It will not connect
          to hardware or a backend. It is saved in this browser.
        </p>

        <label
          htmlFor="mock-device-name"
          className={`mt-5 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
        >
          Device name
        </label>
        <input
          id="mock-device-name"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder="Example: Conference Room"
          className={inputClass}
        />

        <label
          htmlFor="mock-device-location"
          className={`mt-4 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
        >
          Room or location
        </label>
        <input
          id="mock-device-location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder="Example: Main Building"
          className={inputClass}
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-500">
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
            onClick={submit}
            className="min-h-11 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Add test device
          </button>
        </div>
      </div>
    </div>
  );
}
