import axios, { type AxiosError } from "axios";
import { logger } from "@/utils/logger";
import { extractRuntimeCorrelation } from "./client";
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
  timeout: 30000, // Elevated timeout to mitigate cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach user session authorization if present
tantraClient.interceptors.request.use(
  (config) => {
    const sessionToken =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (sessionToken) {
      config.headers["Authorization"] = sessionToken.startsWith("Bearer ")
        ? sessionToken
        : `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to extract runtime correlation without ID conflation
tantraClient.interceptors.response.use(
  (response) => {
    const correlation = extractRuntimeCorrelation(response.headers);
    if (response.data && typeof response.data === "object") {
      (response.data as any).correlation = correlation;
      if (correlation.trace_id) {
        (response.data as any).trace_id = correlation.trace_id;
      }
      if (correlation.execution_id) {
        (response.data as any).execution_id = correlation.execution_id;
      }
      if (correlation.request_id) {
        (response.data as any).request_id = correlation.request_id;
      }
      if (correlation.tenant_id) {
        (response.data as any).tenant_id = correlation.tenant_id;
      }
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
      logger.error(`TANTRA request timeout: ${url}`);
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
  const { data } = await tantraClient.get<TantraHealthResponse>("/health");
  return data;
}

/**
 * GET /telemetry
 * Fail-Closed: Rejects on error so React Query marks query as isError.
 * Never returns synthetic healthy metrics.
 */
export async function fetchTantraTelemetry(): Promise<TantraTelemetryResponse> {
  const { data } = await tantraClient.get<TantraTelemetryResponse>("/telemetry");
  return data;
}

/**
 * GET /telemetry/summary
 * Fail-Closed: Rejects on error so React Query marks query as isError.
 * Never returns synthetic healthy metrics.
 */
export async function fetchTantraTelemetrySummary(): Promise<TantraTelemetrySummary> {
  const { data } = await tantraClient.get<TantraTelemetrySummary>("/telemetry/summary");
  return data;
}
