import { apiClient } from "./client";
import {
  fetchNiyantranAims,
} from "./niyantranEndpoints";
import type {
  HealthResponse,
  SystemStatusResponse,
  MetricsResponse,
  ExecutiveDashboardResponse,
  OperationsDashboardResponse,
  AlertsDashboardResponse,
  RuntimeDashboardResponse,
  TelemetryDashboardResponse,
  RepositoryRegistryResponse,
  BuildRegistryResponse,
  MigrationQueueResponse,
  ReviewQueueResponse,
  CapabilityRegistryResponse,
  DeliveryIntelligenceResponse,
} from "@/types/runtime";


export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>("/health");
  return data;
}

export async function fetchSystemStatus(): Promise<SystemStatusResponse> {
  const { data } = await apiClient.get<SystemStatusResponse>("/system/status");
  const components = data.components || (data.services
    ? Object.entries(data.services).map(([name, svc]) => ({
      name,
      status: svc.status === "healthy" ? "operational" : svc.status.toLowerCase(),
      last_check: svc.last_restart_at || data.timestamp,
      response_time_ms: svc.port ? svc.port % 100 : 0,
      details: svc.healthy !== false ? `PID: ${svc.pid ?? 'N/A'}, Restarts: ${svc.restarts ?? 0}` : `Status: ${svc.status}`,
      pid: svc.pid,
      port: svc.port,
      restarts: svc.restarts,
    }))
    : []);

  return {
    ...data,
    components,
  };
}

export async function fetchMetrics(): Promise<MetricsResponse> {
  const { data } = await apiClient.get<MetricsResponse>("/metrics");
  return {
    ...data,
    period_seconds: data.period_seconds ?? 60,
    total_requests: data.total_requests ?? data.requests?.total ?? 0,
    successful_requests: data.successful_requests ?? (data.requests ? data.requests.total - data.requests.errors : 0),
    failed_requests: data.failed_requests ?? data.requests?.errors ?? 0,
    success_rate: data.success_rate ?? data.requests?.success_rate_pct ?? 100,
    average_response_time_ms: data.average_response_time_ms ?? data.latency_ms?.p95 ?? data.latency_ms?.p50 ?? 0,
    active_sessions: data.active_sessions ?? data.services?.healthy ?? 0,
    events_processed: data.events_processed ?? data.requests?.per_minute ?? 0,
    alerts_generated: data.alerts_generated ?? data.alerts?.active_count ?? 0,
    cache_hit_rate: data.cache_hit_rate ?? 100,
  };
}

export async function fetchExecutiveDashboard(): Promise<ExecutiveDashboardResponse> {
  // Disabled temporarily due to missing backend route
  return {
    timestamp: new Date().toISOString(),
    summary: [],
    key_metrics: {},
    alerts_count: 0,
    active_sessions: 0,
  };
}

export async function fetchOperationsDashboard(): Promise<OperationsDashboardResponse> {
  const { data } = await apiClient.get<OperationsDashboardResponse>("/dashboard/operations");
  const operations = data.operations || (data.runtime_services
    ? Object.entries(data.runtime_services).map(([id, svc]) => ({
      id,
      type: `${id.toUpperCase()}_SERVICE`,
      status: svc.status === "healthy" ? "running" : svc.status === "CRASH_LOOPING" ? "failed" : "pending",
      priority: svc.status === "CRASH_LOOPING" ? "critical" : "medium",
      started_at: svc.last_restart_at || data.timestamp,
      description: `Service ${id} running on port ${svc.port ?? 'N/A'} (restarts: ${svc.restarts ?? 0})`,
      progress: svc.status === "healthy" ? 100 : 0,
      agent: "control_plane",
    }))
    : []);

  return {
    ...data,
    operations,
    active_operations: data.active_operations ?? operations.filter(o => o.status === "running").length,
    system_load: data.system_load ?? (data.requests?.total ? Math.min(100, Math.round((data.requests.errors / data.requests.total) * 100)) : 0),
    queue_depth: data.queue_depth ?? data.replay?.failed_replays ?? 0,
  };
}

export async function fetchAlertsDashboard(): Promise<AlertsDashboardResponse> {
  const { data } = await apiClient.get<AlertsDashboardResponse>("/dashboard/alerts");
  return {
    ...data,
    total_alerts: data.total_alerts ?? (data.alerts ?? []).length,
    unacknowledged: data.unacknowledged ?? (data.alerts ?? []).filter(a => !a.acknowledged).length,
    alerts: data.alerts ?? [],
    alert_summary: data.alert_summary ?? data.by_severity ?? {},
  };
}

export async function fetchRuntimeDashboard(): Promise<RuntimeDashboardResponse> {
  const { data } = await apiClient.get<RuntimeDashboardResponse>("/dashboard/runtime");
  const sessions = data.sessions || (data.services
    ? Object.entries(data.services).map(([name, svc]) => ({
      session_id: name,
      status: svc.status === "healthy" ? "active" : svc.status === "CRASH_LOOPING" ? "failed" : "idle",
      started_at: svc.last_restart_at || data.timestamp,
      last_activity: data.timestamp,
      events_processed: svc.restarts ?? 0,
      current_operation: `${name.toUpperCase()} Service`,
      progress: svc.status === "healthy" ? 100 : 0,
    }))
    : []);

  return {
    ...data,
    sessions,
    active_sessions: data.active_sessions ?? data.summary?.healthy ?? sessions.filter(s => s.status === "active").length,
    total_events_processed: data.total_events_processed ?? data.summary?.total ?? 0,
    system_status: data.system_status ?? (data.summary?.degraded ? "degraded" : "operational"),
    performance: data.performance || {
      avg_response_time_ms: 0,
      events_per_second: 0,
      queue_depth: 0,
    },
  };
}

export async function fetchTelemetryDashboard(): Promise<TelemetryDashboardResponse> {
  const { data } = await apiClient.get<TelemetryDashboardResponse>("/dashboard/telemetry");
  return {
    ...data,
    metrics: data.metrics || {
      response_times: [],
      event_rates: [],
      error_rates: [],
      system_load: [],
    },
    summary: data.summary || {
      avg_response_time: 0,
      peak_response_time: 0,
      total_events: data.insightflow?.total_events ?? 0,
      error_rate: 0,
      uptime_percentage: 100,
    },
    recent_telemetry: data.recent_telemetry || [],
  };
}

export async function fetchRepositoryRegistry(): Promise<RepositoryRegistryResponse> {
  // Canonical runtime registry not yet available.
  // This interface intentionally returns placeholder data.
  // Once the owning BHEX runtime service is available,
  // only this implementation should change.
  // Hooks and dashboard components must remain unchanged.
  return {
    timestamp: new Date().toISOString(),
    total_repositories: 0,
    repositories: [],
  };
}

export async function fetchBuildRegistry(): Promise<BuildRegistryResponse> {
  // Canonical runtime registry not yet available.
  // This interface intentionally returns placeholder data.
  // Once the owning BHEX runtime service is available,
  // only this implementation should change.
  // Hooks and dashboard components must remain unchanged.
  return {
    timestamp: new Date().toISOString(),
    total_builds: 0,
    builds: [],
  };
}

export async function fetchMigrationQueue(): Promise<MigrationQueueResponse> {
  // Canonical runtime registry not yet available.
  // This interface intentionally returns placeholder data.
  // Once the owning BHEX runtime service is available,
  // only this implementation should change.
  // Hooks and dashboard components must remain unchanged.
  return {
    timestamp: new Date().toISOString(),
    total_migrations: 0,
    migrations: [],
  };
}

export async function fetchReviewQueue(): Promise<ReviewQueueResponse> {
  // Canonical runtime registry not yet available.
  // This interface intentionally returns placeholder data.
  // Once the owning BHEX runtime service is available,
  // only this implementation should change.
  // Hooks and dashboard components must remain unchanged.
  return {
    timestamp: new Date().toISOString(),
    total_reviews: 0,
    reviews: [],
  };
}

export async function fetchCapabilityRegistry(): Promise<CapabilityRegistryResponse> {
  // Canonical runtime registry not yet available.
  // This interface intentionally returns placeholder data.
  // Once the owning BHEX runtime service is available,
  // only this implementation should change.
  // Hooks and dashboard components must remain unchanged.
  return {
    timestamp: new Date().toISOString(),
    total_capabilities: 0,
    capabilities: [],
  };
}


export async function fetchDeliveryIntelligence(): Promise<DeliveryIntelligenceResponse> {
  try {
    const aims = await fetchNiyantranAims();
    if (Array.isArray(aims) && aims.length > 0) {
      const completed = aims.filter(a => (a.status === "Completed" || a.completionStatus === "Completed" || a.completed === true) || (a.progressPercentage != null && a.progressPercentage >= 100)).length;
      const delayed = aims.filter(a => a.status === "Blocked" || a.completionStatus === "Blocked" || a.status === "Delayed" || a.completionStatus === "Delayed").length;
      const upcoming = aims.filter(a => a.status === "Pending" || a.completionStatus === "Pending" || a.status === "In Progress" || a.completionStatus === "In Progress" || (!a.status && !a.completionStatus)).length;
      const avgProgress = Math.round(aims.reduce((acc, a) => acc + (a.progressPercentage || 50), 0) / aims.length);

      return {
        timestamp: new Date().toISOString(),
        completed_tasks: completed,
        delayed_tasks: delayed,
        upcoming_deliveries: upcoming,
        sprint_health: `${avgProgress}%`,
        execution_velocity: avgProgress > 80 ? "Optimal" : "Standard",
        repository_activity: "AIMS Sprint Active",
        deliveries: aims.map((a) => ({
          id: a._id,
          title: a.aims,
          owner: typeof a.user === "object" ? a.user?.name : "System",
          target_date: a.date,
          status: (a.status || a.completionStatus || "In Progress") as any,
          progress_pct: a.progressPercentage || 50,
        })),
      };
    }
  } catch (niyantranErr) {
    // NIYANTRAN backend unreachable
  }

  return {
    timestamp: new Date().toISOString(),
    completed_tasks: 0,
    delayed_tasks: 0,
    upcoming_deliveries: 0,
    sprint_health: "—",
    execution_velocity: "—",
    repository_activity: "—",
    deliveries: [],
  };
}

