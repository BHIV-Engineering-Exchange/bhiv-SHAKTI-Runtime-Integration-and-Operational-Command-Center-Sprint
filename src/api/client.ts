import axios, { type AxiosError } from "axios";
import { logger } from "@/utils/logger";
import type { RuntimeCorrelation } from "@/types/correlation";

let BASE_URL = import.meta.env.VITE_CONTROL_PLANE_URL ?? "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (BASE_URL.includes("vercel.app") && !BASE_URL.includes("/api/")) {
  BASE_URL = `${BASE_URL.replace(/\/$/, "")}/api/control-plane`;
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Centralized helper to extract runtime correlation identifiers from HTTP headers.
 *
 * Strict Constitutional Rules:
 * - trace_id !== execution_id !== request_id !== decision_id !== policy_id !== tenant_id
 * - Never use execution_id or request_id as a fallback for trace_id.
 * - If using W3C traceparent (version-trace_id-parent_id-flags), extract trace_id from component 1.
 * - Missing identifiers remain null. No synthetic IDs are generated.
 */
export function extractRuntimeCorrelation(headers?: Record<string, any>): RuntimeCorrelation {
  if (!headers || typeof headers !== "object") {
    return {
      tenant_id: null,
      request_id: null,
      trace_id: null,
      execution_id: null,
      decision_id: null,
      policy_id: null,
    };
  }

  // Header lookup (case-insensitive fallback)
  const getHeader = (name: string): string | null => {
    const direct = headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()];
    return typeof direct === "string" && direct.trim().length > 0 ? direct.trim() : null;
  };

  // 1. Trace ID extraction (x-trace-id, or parsed from W3C traceparent, or x-amzn-trace-id)
  let traceId = getHeader("x-trace-id");
  if (!traceId) {
    const traceparent = getHeader("traceparent");
    if (traceparent) {
      // W3C traceparent format: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
      const parts = traceparent.split("-");
      if (parts.length >= 4 && parts[1] && parts[1].length === 32) {
        traceId = parts[1];
      } else {
        traceId = traceparent;
      }
    }
  }
  if (!traceId) {
    traceId = getHeader("x-amzn-trace-id");
  }

  return {
    tenant_id: getHeader("x-tenant-id") || getHeader("X-Tenant-ID"),
    request_id: getHeader("x-request-id"),
    trace_id: traceId,
    execution_id: getHeader("x-execution-id"),
    decision_id: getHeader("x-decision-id"),
    policy_id: getHeader("x-policy-id"),
  };
}

// ─── Response interceptor — normalize errors & correlation ────────────────────

apiClient.interceptors.response.use(
  (response) => {
    const correlation = extractRuntimeCorrelation(response.headers);
    if (response.data && typeof response.data === "object") {
      // Preserve original payload and attach cleanly separated correlation
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

    if (status === 404) {
      logger.warn(`Endpoint not found: ${url}`);
      return Promise.reject(new Error(`Endpoint not found: ${url}`));
    }
    if (status === 503) {
      logger.warn(`Service unavailable: ${url}`);
      return Promise.reject(new Error(`Service unavailable: ${url}`));
    }
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
      logger.error(`Request timeout: ${url}`);
      return Promise.reject(new Error(`Request timeout: ${url}`));
    }
    if (!error.response) {
      logger.error(`Network error: ${BASE_URL}`);
      return Promise.reject(new Error(`Network error — cannot reach control plane at ${BASE_URL}`));
    }

    logger.error("API Client Error", error, { url, status });
    return Promise.reject(error);
  }
);
