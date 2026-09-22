import axios, { type AxiosError } from "axios";
import { logger } from "@/utils/logger";
import { extractRuntimeCorrelation } from "./client";
import type {
  InsightFlowHealthResponse,
  InsightFlowStageMetric,
  InsightFlowBucketStatus,
} from "@/types/insightflow";

let INSIGHTFLOW_BASE_URL =
  import.meta.env.VITE_INSIGHTFLOW_URL || "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (INSIGHTFLOW_BASE_URL.includes("vercel.app") && !INSIGHTFLOW_BASE_URL.includes("/api/")) {
  INSIGHTFLOW_BASE_URL = `${INSIGHTFLOW_BASE_URL.replace(/\/$/, "")}/api/insightflow`;
}

export const insightflowClient = axios.create({
  baseURL: INSIGHTFLOW_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Response interceptor to extract runtime correlation without ID conflation
insightflowClient.interceptors.response.use(
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
      logger.warn(`InsightFlow endpoint not found: ${url}`);
    } else if (error.code === "ECONNABORTED") {
      logger.error(`InsightFlow request timeout: ${url}`);
    } else if (!error.response) {
      logger.error(`InsightFlow network error — unreachable at ${INSIGHTFLOW_BASE_URL}`);
    }

    return Promise.reject(error);
  }
);

export async function fetchInsightFlowHealth(): Promise<InsightFlowHealthResponse> {
  const { data } = await insightflowClient.get<InsightFlowHealthResponse>("/health");
  return data;
}

export async function fetchInsightFlowStageMetrics(): Promise<InsightFlowStageMetric[]> {
  try {
    const { data } = await insightflowClient.get<InsightFlowStageMetric[]>("/stage-metrics");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    logger.error("Failed to fetch InsightFlow stage metrics:", error);
    return [];
  }
}

export async function fetchInsightFlowBucketStatus(): Promise<InsightFlowBucketStatus> {
  try {
    const { data } = await insightflowClient.get<InsightFlowBucketStatus>("/bucket/status");
    return {
      sync_percent: data?.sync_percent ?? 0,
      stages_synced: Array.isArray(data?.stages_synced) ? data.stages_synced : [],
      last_sync_utc: data?.last_sync_utc ?? "",
      pending_writes: data?.pending_writes ?? 0,
      failed_writes: data?.failed_writes ?? 0,
    };
  } catch (error) {
    logger.error("Failed to fetch InsightFlow bucket status:", error);
    return {
      sync_percent: 0,
      stages_synced: [],
      last_sync_utc: "",
      pending_writes: 0,
      failed_writes: 0,
    };
  }
}
