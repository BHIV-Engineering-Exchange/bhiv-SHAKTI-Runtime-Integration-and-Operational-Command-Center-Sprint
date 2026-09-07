import axios from "axios";

let KARMA_BASE_URL =
  import.meta.env.VITE_KARMA_URL || "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (KARMA_BASE_URL.includes("vercel.app") && !KARMA_BASE_URL.includes("/api/")) {
  KARMA_BASE_URL = `${KARMA_BASE_URL.replace(/\/$/, "")}/api/karma`;
}

export const karmaClient = axios.create({
  baseURL: KARMA_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export interface KarmaHealthResponse {
  status: string;
  service: string;
  [key: string]: any;
}

export interface KarmaLatestHashResponse {
  latest_hash: string;
  hash_type: string;
  timestamp?: string;
  [key: string]: any;
}

export interface KarmaNode {
  id: string;
  label: string;
  layer?: string;
  runtimeStatus?: string;
  replayStatus?: string;
  repository?: string;
  owner?: string;
  documentation?: string;
  evidence?: string | number;
  version?: string;
}

export interface KarmaEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface KarmaLineageResponse {
  nodes?: KarmaNode[];
  edges?: KarmaEdge[];
  [key: string]: any;
}

export interface KarmaAncestryResponse {
  event_id: string;
  ancestry: string[];
  [key: string]: any;
}

export interface KarmaConfidenceParams {
  behavior_score?: number;
  aggregated_feedback?: number;
  schema_version?: string;
  purushartha_alignment?: Record<string, number>;
}

export interface KarmaConfidenceContributingFactor {
  factor: string;
  value: number;
  weight: number;
}

export interface KarmaConfidenceResponse {
  schema_version?: string;
  trajectory_id?: string;
  confidence_score: number;
  explanation?: string;
  contributing_factors?: KarmaConfidenceContributingFactor[];
  deterministic_hash?: string;
  [key: string]: any;
}

export interface KarmaReasoningParams {
  behavior_score?: number;
  aggregated_feedback?: number;
  schema_version?: string;
  purushartha_alignment?: Record<string, number>;
  recommended_signals?: string[];
}

export interface KarmaReasoningEvidence {
  field: string;
  value: any;
  interpretation: string;
}

export interface KarmaReasoningResponse {
  schema_version?: string;
  trajectory_id?: string;
  reasoning_type?: string;
  conclusion?: string;
  evidence?: KarmaReasoningEvidence[];
  deterministic_hash?: string;
  reasoning?: string;
  [key: string]: any;
}

export interface KarmaLiveMetricsResponse {
  live_score?: number;
  total_events?: number;
  error_rate?: number;
  [key: string]: any;
}

export interface KarmaTrendsResponse {
  trends?: Array<{
    timestamp: string;
    punya_count?: number;
    paap_count?: number;
    value?: number;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface KarmaDharmaSevaFlowResponse {
  flow?: Array<{
    source: string;
    target: string;
    value: number;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface KarmaPaapPunyaRatioResponse {
  punya_count?: number;
  paap_count?: number;
  ratio?: {
    punya: number;
    paap: number;
    neutral: number;
  };
  [key: string]: any;
}

export async function fetchKarmaHealth(): Promise<KarmaHealthResponse> {
  const { data } = await karmaClient.get<KarmaHealthResponse>("/health");
  return data;
}

export async function fetchKarmaLatestHash(): Promise<KarmaLatestHashResponse> {
  const { data } = await karmaClient.get<KarmaLatestHashResponse>("/karma/latest-hash");
  return data;
}

export async function fetchKarmaLineage(): Promise<KarmaLineageResponse> {
  const { data } = await karmaClient.get<KarmaLineageResponse>("/intelligence/lineage");
  return {
    ...data,
    nodes: Array.isArray(data?.nodes) ? data.nodes : [],
    edges: Array.isArray(data?.edges) ? data.edges : [],
  };
}

export async function fetchKarmaAncestry(eventId: string): Promise<KarmaAncestryResponse> {
  const { data } = await karmaClient.get<KarmaAncestryResponse>(`/intelligence/lineage/${eventId}/ancestry`);
  return {
    ...data,
    ancestry: Array.isArray(data?.ancestry) ? data.ancestry : [],
  };
}

export const DEFAULT_PURUSHARTHA_ALIGNMENT = {
  dharma: 0.85,
  artha: 0.75,
  kama: 0.65,
  moksha: 0.95,
};

export const DEFAULT_RECOMMENDED_SIGNALS = ["STABILITY", "ETHICAL_ALIGNMENT"];

export async function fetchKarmaConfidence(
  trajectoryId: string,
  params?: KarmaConfidenceParams
): Promise<KarmaConfidenceResponse> {
  const behaviorScore = params?.behavior_score ?? 0.85;
  const aggregatedFeedback = params?.aggregated_feedback ?? 0.9;
  const schemaVersion = params?.schema_version ?? "1.0.0";
  const purusharthaAlignment = params?.purushartha_alignment ?? DEFAULT_PURUSHARTHA_ALIGNMENT;

  const { data } = await karmaClient.request<KarmaConfidenceResponse>({
    method: "GET",
    url: `/intelligence/confidence/${trajectoryId}`,
    params: {
      behavior_score: behaviorScore,
      aggregated_feedback: aggregatedFeedback,
      schema_version: schemaVersion,
    },
    data: purusharthaAlignment,
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function fetchKarmaReasoning(
  trajectoryId: string,
  params?: KarmaReasoningParams
): Promise<KarmaReasoningResponse> {
  const behaviorScore = params?.behavior_score ?? 0.85;
  const aggregatedFeedback = params?.aggregated_feedback ?? 0.9;
  const schemaVersion = params?.schema_version ?? "1.0.0";
  const purusharthaAlignment = params?.purushartha_alignment ?? DEFAULT_PURUSHARTHA_ALIGNMENT;
  const recommendedSignals = params?.recommended_signals ?? DEFAULT_RECOMMENDED_SIGNALS;

  const { data } = await karmaClient.request<KarmaReasoningResponse>({
    method: "GET",
    url: `/intelligence/reasoning/${trajectoryId}`,
    params: {
      behavior_score: behaviorScore,
      aggregated_feedback: aggregatedFeedback,
      schema_version: schemaVersion,
    },
    data: {
      purushartha_alignment: purusharthaAlignment,
      recommended_signals: recommendedSignals,
    },
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function fetchKarmaLiveMetrics(): Promise<KarmaLiveMetricsResponse> {
  const { data } = await karmaClient.get<KarmaLiveMetricsResponse>("/api/v1/analytics/metrics/live");
  return data;
}

export async function fetchKarmaTrends(): Promise<KarmaTrendsResponse> {
  const { data } = await karmaClient.get<KarmaTrendsResponse>("/api/v1/analytics/karma_trends");
  return {
    ...data,
    trends: Array.isArray(data?.trends) ? data.trends : [],
  };
}

export async function fetchKarmaDharmaSevaFlow(): Promise<KarmaDharmaSevaFlowResponse> {
  const { data } = await karmaClient.get<KarmaDharmaSevaFlowResponse>("/api/v1/analytics/charts/dharma_seva_flow");
  return {
    ...data,
    flow: Array.isArray(data?.flow) ? data.flow : [],
  };
}

export async function fetchKarmaPaapPunyaRatio(): Promise<KarmaPaapPunyaRatioResponse> {
  const { data } = await karmaClient.get<KarmaPaapPunyaRatioResponse>("/api/v1/analytics/charts/paap_punya_ratio");
  return data;
}
