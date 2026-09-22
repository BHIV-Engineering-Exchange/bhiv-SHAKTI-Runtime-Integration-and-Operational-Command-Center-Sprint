export interface HealthResponse {
  status: string;
  version?: string;
  success?: boolean;
  message?: string;
  dependencies?: Record<string, string>;
  integrations?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  name: string;
  project_id: string;
  description?: string;
  status: string;
}

export interface Task {
  id: string;
  name: string;
  project_id: string;
  milestone_id?: string;
  description?: string;
  dependencies: string[];
  state: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  task_id: string;
  resource_id: string;
  assigned_at: string;
}

// ─── SETU Runtime Observation Models (Strictly Read-Only) ─────────────────────

export interface SetuTimelineEvent {
  event_id?: string;
  stage?: string;
  status: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface SetuTimelineResponse {
  trace_id: string;
  execution_id?: string;
  tenant_id?: string;
  timeline: SetuTimelineEvent[];
}

export interface SetuCandidateState {
  trace_id: string;
  execution_id?: string;
  state: string;
  evaluator?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SetuSignalVisibility {
  trace_id: string;
  signals: Array<{
    signal_id: string;
    signal_type: string;
    timestamp: string;
    payload?: Record<string, unknown>;
  }>;
}

export interface SetuVisibilityDashboard {
  trace_id: string;
  execution_id?: string;
  tenant_id?: string;
  status: string;
  candidate_state?: SetuCandidateState;
  timeline?: SetuTimelineEvent[];
  signals?: SetuSignalVisibility;
  observational_only: boolean;
}

export interface SetuTelemetryEvent {
  event_type: string;
  execution_id?: string;
  trace_id: string;
  tenant_id?: string;
  timestamp: string;
  details?: Record<string, unknown>;
  source_system?: string;
}

export interface SetuTelemetryResponse {
  trace_id: string;
  events: SetuTelemetryEvent[];
  count: number;
  execution_id?: string;
  tenant_id?: string;
}
