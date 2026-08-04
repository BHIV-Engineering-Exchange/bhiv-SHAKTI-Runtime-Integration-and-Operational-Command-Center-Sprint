import axios, { type AxiosError } from "axios";
import { logger } from "@/utils/logger";
import type {
  TantraHealthResponse,
  TantraTelemetrySummary,
  TantraTelemetryResponse,
} from "@/types/tantra";

let TANTRA_BASE_URL =
  import.meta.env.VITE_TANTRA_BASE_URL || "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (TANTRA_BASE_URL.includes("vercel.app") && !TANTRA_BASE_URL.includes("/api/")) {
  TANTRA_BASE_URL = `${TANTRA_BASE_URL.replace(/\/$/, "")}/api/tantra`;
}

export const tantraClient = axios.create({
  baseURL: TANTRA_BASE_URL,
  timeout: 30000, // Elevated timeout to mitigate Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach bridge signature if present in environment or local storage
tantraClient.interceptors.request.use(
  (config) => {
    const signature =
      import.meta.env.VITE_TANTRA_BRIDGE_SIGNATURE ||
      (typeof localStorage !== "undefined"
        ? localStorage.getItem("x-bridge-signature")
        : null);

    if (signature) {
      // Attach both as standard Authorization header and custom signature header to cover all specs
      config.headers["Authorization"] = signature.startsWith("Bearer ")
        ? signature
        : `Bearer ${signature}`;
      config.headers["x-bridge-signature"] = signature;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to normalize trace headers
tantraClient.interceptors.response.use(
  (response) => {
    const traceId =
      response.headers?.["x-trace-id"] ||
      response.headers?.["x-execution-id"] ||
      response.headers?.["traceparent"];

    if (traceId && response.data && typeof response.data === "object") {
      (response.data as any).trace_id = traceId;
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "unknown";

    if (status === 401) {
      logger.warn(`Unauthorized TANTRA request to ${url}`);
    } else if (status === 404) {
      logger.warn(`TANTRA endpoint not found: ${url}`);
    } else if (error.code === "ECONNABORTED") {
      logger.error(`TANTRA request timeout (cold start): ${url}`);
    } else if (!error.response) {
      logger.error(`TANTRA network error — unreachable at ${TANTRA_BASE_URL}`);
    }

    return Promise.reject(error);
  }
);

/**
 * GET /health
 */
export async function fetchTantraHealth(): Promise<TantraHealthResponse> {
  try {
    const { data } = await tantraClient.get<TantraHealthResponse>("/health");
    return data;
  } catch (error) {
    logger.error("Failed to fetch TANTRA health status:", error);
    return {
      status: "offline",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * GET /telemetry
 */
export async function fetchTantraTelemetry(): Promise<TantraTelemetryResponse> {
  try {
    const { data } = await tantraClient.get<TantraTelemetryResponse>("/telemetry");
    return data;
  } catch (error) {
    logger.error("Failed to fetch TANTRA telemetry data:", error);
    return {
      metrics: {
        response_times: [],
        event_rates: [],
        error_rates: [],
        system_load: [],
      },
      summary: {
        avg_response_time_ms: 0,
        total_events: 0,
        error_rate: 0,
        uptime_percentage: 100,
      },
    };
  }
}

/**
 * GET /telemetry/summary
 */
export async function fetchTantraTelemetrySummary(): Promise<TantraTelemetrySummary> {
  try {
    const { data } = await tantraClient.get<TantraTelemetrySummary>("/telemetry/summary");
    return data;
  } catch (error) {
    logger.error("Failed to fetch TANTRA telemetry summary:", error);
    return {
      avg_response_time_ms: 0,
      total_events: 0,
      error_rate: 0,
      uptime_percentage: 100,
    };
  }
}
