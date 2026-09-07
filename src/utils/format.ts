import type { Severity, OperationalStatus, TrendDirection, IncidentStatus, ReplayState } from "@/types/api";

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function severityColor(severity: Severity): string {
  return {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-blue-400",
    info: "text-slate-400",
  }[severity];
}

export function severityBg(severity: Severity): string {
  return {
    critical: "bg-red-500/15 border-red-500/30",
    high: "bg-orange-500/15 border-orange-500/30",
    medium: "bg-yellow-500/15 border-yellow-500/30",
    low: "bg-blue-500/15 border-blue-500/30",
    info: "bg-slate-500/15 border-slate-500/30",
  }[severity];
}

export function statusColor(status: OperationalStatus): string {
  return {
    online: "text-emerald-400",
    offline: "text-red-400",
    warning: "text-yellow-400",
    degraded: "text-orange-400",
  }[status];
}

export function statusDot(status: OperationalStatus): string {
  return {
    online: "bg-emerald-400",
    offline: "bg-red-400",
    warning: "bg-yellow-400",
    degraded: "bg-orange-400",
  }[status];
}

export function trendIcon(trend: TrendDirection): string {
  return { up: "↑", down: "↓", stable: "→" }[trend];
}

export function trendColor(trend: TrendDirection, inverse = false): string {
  if (trend === "stable") return "text-slate-400";
  const isPositive = trend === "up";
  return (isPositive !== inverse) ? "text-emerald-400" : "text-red-400";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Runtime → UI type mappers ────────────────────────────────────────────────
// Consolidated from duplicate local functions in dashboard components.
// Maps untyped runtime API strings to strongly-typed UI enums.

export function toSeverity(s: string): Severity {
  if (s === "critical" || s === "high" || s === "medium" || s === "low" || s === "info") return s;
  return "info";
}

export function toStatus(s: string): OperationalStatus {
  const lower = (s || "").trim().toLowerCase();
  if (lower === "normal" || lower === "operational" || lower === "healthy" || lower === "online" || lower === "ok") {
    return "online";
  }
  if (lower === "warning") {
    return "warning";
  }
  if (lower === "degraded") {
    return "degraded";
  }
  if (
    lower === "critical" ||
    lower === "offline" ||
    lower === "unhealthy" ||
    lower === "down" ||
    lower === "failed" ||
    lower === "error" ||
    lower === "crash_looping"
  ) {
    return "offline";
  }
  return "offline";
}

export function toTrend(t: string): TrendDirection {
  if (t === "up" || t === "down" || t === "stable") return t;
  return "stable";
}

export function toIncidentStatus(s: string): IncidentStatus {
  if (s === "running")   return "investigating";
  if (s === "completed") return "resolved";
  if (s === "failed")    return "closed";
  if (s === "pending")   return "open";
  if (s === "paused")    return "open";
  return "open";
}

export function toReplayState(s: string): ReplayState {
  if (s === "active")    return "running";
  if (s === "completed") return "completed";
  if (s === "failed")    return "failed";
  if (s === "idle")      return "idle";
  return "idle";
}
