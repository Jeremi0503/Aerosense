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
      className={`min-w-0 rounded-2xl border p-3 shadow-sm sm:p-5 ${
        darkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <p
            className={`truncate text-xs sm:text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <div className="mt-1 flex flex-wrap items-end gap-x-1 sm:mt-2">
            <span
              className={`text-2xl font-bold sm:text-3xl ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {value}
            </span>

            <span
              className={`mb-0.5 text-xs sm:mb-1 sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {unit}
            </span>
          </div>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-11 sm:w-11 sm:text-lg ${accent}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
