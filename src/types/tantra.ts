// ─── TANTRA Gated Bridge Runtime TypeScript Contracts ─────────────────────────
// Source: TANTRA Gated Bridge Infrastructure team
// Configured via VITE_TANTRA_BASE_URL in .env

export interface TantraHealthResponse {
  status: string;         // e.g. "healthy" | "operational" | "degraded" | "offline"
  timestamp: string;
  version?: string;
  uptime_seconds?: number;
}

export interface TantraTelemetrySummary {
  avg_response_time_ms: number;
  total_events: number;
  error_rate: number;
  uptime_percentage: number;
}

export interface TantraTelemetryDataPoint {
  timestamp: string;
  value: number;
  metric: string;
}

export interface TantraTelemetryResponse {
  metrics: {
    response_times: TantraTelemetryDataPoint[];
    event_rates: TantraTelemetryDataPoint[];
    error_rates: TantraTelemetryDataPoint[];
    system_load: TantraTelemetryDataPoint[];
  };
  summary: TantraTelemetrySummary;
}
