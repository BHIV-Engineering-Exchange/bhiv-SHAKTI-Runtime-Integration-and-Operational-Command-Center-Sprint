import axios, { type AxiosError } from "axios";
import { logger } from "@/utils/logger";
import { extractRuntimeCorrelation } from "./client";
import type {
  SovereignExecutionTrace,
  SovereignBucketEntry,
  RajyaHealthResponse,
} from "@/types/sovereign";

export type { RajyaHealthResponse, SovereignExecutionTrace, SovereignBucketEntry };

let RAJYA_BASE_URL =
  import.meta.env.VITE_RAJYA_BASE_URL || "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (RAJYA_BASE_URL.includes("vercel.app") && !RAJYA_BASE_URL.includes("/api/")) {
  RAJYA_BASE_URL = `${RAJYA_BASE_URL.replace(/\/$/, "")}/api/rajya`;
}

export const rajyaClient = axios.create({
  baseURL: RAJYA_BASE_URL,
  timeout: 30000, // 30 seconds for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to extract runtime correlation without ID conflation
rajyaClient.interceptors.response.use(
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

    if (status === 404) {
      logger.warn(`Rajya endpoint not found: ${url}`);
    } else if (error.code === "ECONNABORTED") {
      logger.error(`Rajya request timeout: ${url}`);
    } else if (!error.response) {
      logger.error(`Rajya network error — unreachable at ${RAJYA_BASE_URL}`);
    }

    return Promise.reject(error);
  }
);

export async function fetchRajyaHealth(): Promise<RajyaHealthResponse> {
  const { data } = await rajyaClient.get<RajyaHealthResponse>("/health");
  return data;
}

export async function fetchSovereignTraces(): Promise<SovereignExecutionTrace[]> {
  const { data } = await rajyaClient.get<SovereignExecutionTrace[]>("/api/v1/niyantran/traces");
  return Array.isArray(data) ? data : [];
}

export async function fetchSovereignBucketEntries(): Promise<SovereignBucketEntry[]> {
  const { data } = await rajyaClient.get<SovereignBucketEntry[]>("/api/v1/bucket/entries");
  return Array.isArray(data) ? data : [];
}
