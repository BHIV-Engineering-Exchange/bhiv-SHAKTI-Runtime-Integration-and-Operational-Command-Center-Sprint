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
  const { data } = await keshavClient.get<KeshavMetricsResponse>("/metrics/json");
  return data;
}
