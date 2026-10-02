type StatCardProps = {
  title: string;
  value: string;
  unit: string;
  icon: string;
  accent: string;
  darkMode: boolean;
};

export default function StatCard({
  title,
  value,
  unit,
  icon,
  accent,
  darkMode,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        darkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <div className="mt-2 flex items-end gap-1">
            <span
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {value}
            </span>

            <span
              className={`mb-1 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {unit}
            </span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${accent}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
