// ─── KESHAV Service TypeScript Contracts ──────────────────────────────────────
// Configured via VITE_KESHAV_URL in .env

export interface KeshavHealthResponse {
  status: string;
  service?: string;
  uptime_seconds?: number;
  timestamp?: string;
  [key: string]: any;
}

export interface KeshavMetricsResponse {
  request_count?: number;
  request_errors?: number;
  request_success_rate?: number;
  avg_latency_seconds?: number;
  p95_latency_seconds?: number;
  p99_latency_seconds?: number;
  severity_distribution?: Record<string, any>;
  unique_traces_processed?: number;
  [key: string]: any;
}
