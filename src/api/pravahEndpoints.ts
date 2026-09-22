import axios from "axios";
import { extractRuntimeCorrelation } from "./client";
import type {
  PravahTraceRegistryResponse,
  PravahEvidenceBundleResponse,
} from "@/types/pravah";

let PRAVAH_BASE_URL = import.meta.env.VITE_PRAVAH_URL || "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (PRAVAH_BASE_URL.includes("vercel.app") && !PRAVAH_BASE_URL.includes("/api/")) {
  PRAVAH_BASE_URL = `${PRAVAH_BASE_URL.replace(/\/$/, "")}/api/pravah`;
}

export const pravahClient = axios.create({
  baseURL: PRAVAH_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "X-Source-System": "SHAKTI",
  },
});

// Response interceptor to extract runtime correlation without ID conflation
pravahClient.interceptors.response.use(
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
    }
    return response;
  },
  (error) => Promise.reject(error)
);

/**
 * GET /registry/trace/{trace_id}
 * Retrieves trace registry and evidence bundle index from Pravah.
 * NOTE: Server-side reverse proxy/BFF must inject PRAVAH_API_KEY.
 * Browser code never exposes PRAVAH_API_KEY.
 */
export async function getPravahTraceRegistry(
  traceId: string
): Promise<PravahTraceRegistryResponse> {
  const { data } = await pravahClient.get<PravahTraceRegistryResponse>(
    `/registry/trace/${encodeURIComponent(traceId)}`
  );
  return data;
}

/**
 * GET /evidence/{evidence_ref}
 * Retrieves an individual evidence bundle from Pravah.
 */
export async function getPravahEvidence(
  evidenceRef: string
): Promise<PravahEvidenceBundleResponse> {
  const { data } = await pravahClient.get<PravahEvidenceBundleResponse>(
    `/evidence/${encodeURIComponent(evidenceRef)}`
  );
  return data;
}
