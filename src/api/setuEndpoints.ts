import axios from "axios";
import { extractRuntimeCorrelation } from "./client";
import type {
  HealthResponse,
  Project,
  Milestone,
  Task,
  Assignment,
  SetuVisibilityDashboard,
  SetuTimelineResponse,
  SetuCandidateState,
  SetuSignalVisibility,
  SetuTelemetryResponse,
  SetuAuthMeResponse,
} from "@/types/setu";

let SETU_BASE_URL = import.meta.env.VITE_SETU_URL || "";

// Normalize base URL if it's a Vercel domain missing the /api prefix
if (SETU_BASE_URL.includes("vercel.app") && !SETU_BASE_URL.includes("/api/")) {
  SETU_BASE_URL = `${SETU_BASE_URL.replace(/\/$/, "")}/api/setu`;
}

export const setuClient = axios.create({
  baseURL: SETU_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor to attach user session token if present
setuClient.interceptors.request.use(
  (config) => {
    const sessionToken =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("WorkflowToken")
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
setuClient.interceptors.response.use(
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
  (error) => Promise.reject(error)
);

// ─── SETU PMC / Project Management Functions (Preserved) ─────────────────────

export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data } = await setuClient.get<HealthResponse>("/api/setu/health");
    return data;
  } catch {
    try {
      const { data } = await setuClient.get<HealthResponse>("/api/health");
      return data;
    } catch {
      const { data } = await setuClient.get<HealthResponse>("/health");
      return data;
    }
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    let data;
    try {
      const res = await setuClient.get<any>("/api/setu/projects");
      data = res.data;
    } catch {
      const res = await setuClient.get<any>("/projects");
      data = res.data;
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.projects)) return data.projects;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function getProject(projectId: string): Promise<Project> {
  try {
    const { data } = await setuClient.get<Project>(`/api/setu/projects/${encodeURIComponent(projectId)}`);
    return data;
  } catch {
    const { data } = await setuClient.get<Project>(`/projects/${encodeURIComponent(projectId)}`);
    return data;
  }
}

export async function getProjectMilestones(projectId: string): Promise<Milestone[]> {
  try {
    let data;
    try {
      const res = await setuClient.get<any>(`/api/setu/projects/${encodeURIComponent(projectId)}/milestones`);
      data = res.data;
    } catch {
      const res = await setuClient.get<any>(`/projects/${encodeURIComponent(projectId)}/milestones`);
      data = res.data;
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.milestones)) return data.milestones;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function getTask(taskId: string): Promise<Task> {
  try {
    const { data } = await setuClient.get<Task>(`/api/setu/tasks/${encodeURIComponent(taskId)}`);
    return data;
  } catch {
    const { data } = await setuClient.get<Task>(`/tasks/${encodeURIComponent(taskId)}`);
    return data;
  }
}

export async function getTaskAssignments(taskId: string): Promise<Assignment[]> {
  try {
    let data;
    try {
      const res = await setuClient.get<any>(`/api/setu/tasks/${encodeURIComponent(taskId)}/assignments`);
      data = res.data;
    } catch {
      const res = await setuClient.get<any>(`/tasks/${encodeURIComponent(taskId)}/assignments`);
      data = res.data;
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.assignments)) return data.assignments;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

// ─── SETU Authentication & Tenant Context (Authoritative Contract) ─────────────

/**
 * GET /api/auth/me
 * Retrieves current authenticated user context including authoritative tenant_id.
 * Authorization: Bearer <JWT_ACCESS_TOKEN> is automatically attached via request interceptor.
 */
export async function getSetuAuthMe(): Promise<SetuAuthMeResponse> {
  const { data } = await setuClient.get<SetuAuthMeResponse>("/api/auth/me");
  return data;
}

// ─── SETU Runtime Observation Endpoints (Strictly Read-Only) ──────────────────

/**
 * GET /setu/ui/dashboard/{trace_id}
 * Retrieves complete visibility dashboard for a trace (read-only, observational only).
 */
export async function getSetuDashboard(traceId: string, tenantId?: string): Promise<SetuVisibilityDashboard> {
  const headers: Record<string, string> = {};
  if (tenantId && tenantId.trim().length > 0) {
    const trimmed = tenantId.trim();
    headers["x-tenant-id"] = trimmed;
    headers["x-setu-tenant-id"] = trimmed;
  }
  const { data } = await setuClient.get<SetuVisibilityDashboard>(
    `/setu/ui/dashboard/${encodeURIComponent(traceId)}`,
    { headers }
  );
  return data;
}

/**
 * GET /setu/niyantran/timeline/{trace_id}
 * Retrieves execution timeline from SETU Niyantran adapter.
 */
export async function getSetuTimeline(traceId: string, tenantId?: string): Promise<SetuTimelineResponse> {
  const headers: Record<string, string> = {};
  if (tenantId && tenantId.trim().length > 0) {
    const trimmed = tenantId.trim();
    headers["x-tenant-id"] = trimmed;
    headers["x-setu-tenant-id"] = trimmed;
  }
  const { data } = await setuClient.get<SetuTimelineResponse>(
    `/setu/niyantran/timeline/${encodeURIComponent(traceId)}`,
    { headers }
  );
  return data;
}

/**
 * GET /setu/ui/candidate/{trace_id}
 * Retrieves candidate state for UI observation.
 */
export async function getSetuCandidateState(traceId: string, tenantId?: string): Promise<SetuCandidateState> {
  const headers: Record<string, string> = {};
  if (tenantId && tenantId.trim().length > 0) {
    const trimmed = tenantId.trim();
    headers["x-tenant-id"] = trimmed;
    headers["x-setu-tenant-id"] = trimmed;
  }
  const { data } = await setuClient.get<SetuCandidateState>(
    `/setu/ui/candidate/${encodeURIComponent(traceId)}`,
    { headers }
  );
  return data;
}

/**
 * GET /setu/ui/signals/{trace_id}
 * Retrieves signal visibility for UI observation.
 */
export async function getSetuSignals(traceId: string, tenantId?: string): Promise<SetuSignalVisibility> {
  const headers: Record<string, string> = {};
  if (tenantId && tenantId.trim().length > 0) {
    const trimmed = tenantId.trim();
    headers["x-tenant-id"] = trimmed;
    headers["x-setu-tenant-id"] = trimmed;
  }
  const { data } = await setuClient.get<SetuSignalVisibility>(
    `/setu/ui/signals/${encodeURIComponent(traceId)}`,
    { headers }
  );
  return data;
}

/**
 * GET /setu/telemetry/{trace_id}
 * Retrieves telemetry events for a trace (strictly read-only).
 */
export async function getSetuTelemetry(traceId: string, tenantId?: string): Promise<SetuTelemetryResponse> {
  const headers: Record<string, string> = {};
  if (tenantId && tenantId.trim().length > 0) {
    const trimmed = tenantId.trim();
    headers["x-tenant-id"] = trimmed;
    headers["x-setu-tenant-id"] = trimmed;
  }
  const { data } = await setuClient.get<SetuTelemetryResponse>(
    `/setu/telemetry/${encodeURIComponent(traceId)}`,
    { headers }
  );
  return data;
}
