export type NormalizedComponentStatus = "operational" | "degraded" | "offline";

/**
 * Pure frontend utility for SHAKTI Runtime Health status normalization.
 * Normalizes asynchronous query states and backend status payloads into
 * the canonical three-state model ("operational" | "degraded" | "offline").
 *
 * @param rawStatus - Raw status string from backend payload (or null/undefined)
 * @param isLoading - Whether the health query is currently loading
 * @param isError - Whether the health query encountered a transport/network error
 * @returns NormalizedComponentStatus
 */
export function normalizeComponentStatus(
  rawStatus: string | undefined | null,
  isLoading: boolean,
  isError: boolean
): NormalizedComponentStatus {
  if (isLoading) {
    return "degraded";
  }

  if (isError) {
    return "offline";
  }

  const s = (rawStatus ?? "").trim().toLowerCase();

  // Recognized operational values
  if (s === "healthy" || s === "operational" || s === "ok" || s === "online") {
    return "operational";
  }

  // Recognized degraded values
  if (s === "degraded" || s === "warning") {
    return "degraded";
  }

  // Recognized failure values
  if (
    s === "offline" ||
    s === "unhealthy" ||
    s === "failed" ||
    s === "error" ||
    s === "crash_looping" ||
    s === "down"
  ) {
    return "offline";
  }

  // Unknown or missing status safely maps to degraded
  return "degraded";
}
