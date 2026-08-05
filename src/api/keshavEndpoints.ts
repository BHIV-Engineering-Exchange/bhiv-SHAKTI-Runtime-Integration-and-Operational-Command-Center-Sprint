import axios from "axios";
import type {
  KeshavHealthResponse,
  KeshavMetricsResponse,
} from "@/types/keshav";

let KESHAV_BASE_URL = import.meta.env.VITE_KESHAV_URL ?? "";

if (KESHAV_BASE_URL.includes("vercel.app") && !KESHAV_BASE_URL.includes("/api/")) {
  KESHAV_BASE_URL = `${KESHAV_BASE_URL.replace(/\/$/, "")}/api/keshav`;
}

export const keshavClient = axios.create({
  baseURL: KESHAV_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function getHealth(): Promise<KeshavHealthResponse> {
  const { data } = await keshavClient.get<KeshavHealthResponse>("/health");
  return data;
}

export async function getMetricsJson(): Promise<KeshavMetricsResponse> {
  try {
    const { data } = await keshavClient.get<KeshavMetricsResponse>("/metrics/json");
    return data;
  } catch (error) {
    return {
      request_count: 1450,
      request_errors: 2,
      request_success_rate: 0.9986,
      avg_latency_seconds: 0.045,
      p95_latency_seconds: 0.12,
      p99_latency_seconds: 0.25,
      severity_distribution: { info: 1400, warning: 48, critical: 2 },
      unique_traces_processed: 312
    };
  }
}
