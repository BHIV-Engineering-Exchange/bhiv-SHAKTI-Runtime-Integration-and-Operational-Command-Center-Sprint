import axios, { type AxiosError } from "axios";
import { logger } from "@/utils/logger";

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

// Response interceptor to normalize trace headers
rajyaClient.interceptors.response.use(
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
      logger.warn(`Rajya endpoint not found: ${url}`);
    } else if (error.code === "ECONNABORTED") {
      logger.error(`Rajya request timeout: ${url}`);
    } else if (!error.response) {
      logger.error(`Rajya network error — unreachable at ${RAJYA_BASE_URL}`);
    }

    return Promise.reject(error);
  }
);

export interface RajyaHealthResponse {
  status: string;
}

export async function fetchRajyaHealth(): Promise<RajyaHealthResponse> {
  try {
    const { data } = await rajyaClient.get<RajyaHealthResponse>("/health");
    return data && typeof data === "object" && data.status ? data : { status: "healthy" };
  } catch (error) {
    logger.error("Failed to fetch Rajya health status:", error);
    return { status: "degraded" };
  }
}
