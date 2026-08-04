import axios, { type AxiosError } from "axios";
import { logger } from "@/utils/logger";

let SANSKAR_BASE_URL =
  import.meta.env.VITE_SANSKAR_BASE_URL || "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (SANSKAR_BASE_URL.includes("vercel.app") && !SANSKAR_BASE_URL.includes("/api/")) {
  SANSKAR_BASE_URL = `${SANSKAR_BASE_URL.replace(/\/$/, "")}/api/sanskar`;
}

export const sanskarClient = axios.create({
  baseURL: SANSKAR_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to normalize trace headers
sanskarClient.interceptors.response.use(
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

    if (status === 404) {
      logger.warn(`Sanskar endpoint not found: ${url}`);
    } else if (error.code === "ECONNABORTED") {
      logger.error(`Sanskar request timeout: ${url}`);
    } else if (!error.response) {
      logger.error(`Sanskar network error — unreachable at ${SANSKAR_BASE_URL}`);
    }

    return Promise.reject(error);
  }
);

export interface SanskarHealthResponse {
  status: string;
  service: string;
  contract_version?: string;
}

export interface SanskarEntity {
  entity_id: string;
  score: number;
  confidence: number;
  decision_state?: string;
  [key: string]: any;
}

export interface SanskarRankingResponse {
  ranking: string[];
  entities: SanskarEntity[];
  contract_version?: string;
}

export interface SanskarTraceResponse {
  trace_id: string;
  pipeline_status: string;
  input: any;
  sanskar_output?: {
    ranking?: string[];
    entities?: SanskarEntity[];
    [key: string]: any;
  };
  core_decision?: {
    selected_entity: string;
    selected_score: number;
    selected_confidence: number;
    priority: string;
    priority_reason: string;
    reasoning?: string;
    [key: string]: any;
  };
  enforcement?: {
    directives?: any[];
    action?: string;
    target?: string;
    [key: string]: any;
  };
  truth?: {
    verdict: string;
    pipeline_hash: string;
    chain_integrity: string;
    trace_continuity: string;
    stages_completed: string[];
    [key: string]: any;
  };
  contract_version?: string;
}

export async function getHealth(): Promise<SanskarHealthResponse> {
  try {
    const { data } = await sanskarClient.get<SanskarHealthResponse>("/health");
    return data;
  } catch (error) {
    logger.error("Failed to fetch SANSKAR health status:", error);
    return { status: "degraded", service: "sanskar", contract_version: "v1" };
  }
}

export async function getRanking(): Promise<SanskarRankingResponse> {
  try {
    const { data } = await sanskarClient.get<SanskarRankingResponse>("/ranking");
    return data;
  } catch (error) {
    logger.error("Failed to fetch SANSKAR ranking:", error);
    return { ranking: [], entities: [] };
  }
}

export async function getTrace(traceId: string): Promise<SanskarTraceResponse> {
  const { data } = await sanskarClient.get<SanskarTraceResponse>(`/trace/${traceId}`);
  return data;
}
