import type { AirQuality } from "../types/device";

export function getAirQualityClass(quality: AirQuality, darkMode: boolean) {
  if (quality === "Good") {
    return darkMode
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (quality === "Moderate") {
    return darkMode
      ? "bg-amber-500/15 text-amber-300 border-amber-400/20"
      : "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (quality === "Unknown") {
    return darkMode
      ? "bg-slate-700/50 text-slate-300 border-slate-600"
      : "bg-slate-100 text-slate-600 border-slate-200";
  }

  return darkMode
    ? "bg-red-500/15 text-red-300 border-red-400/20"
    : "bg-red-50 text-red-700 border-red-200";
}

export function getStatusDot(online: boolean) {
  return online ? "bg-emerald-500" : "bg-slate-400";
}
