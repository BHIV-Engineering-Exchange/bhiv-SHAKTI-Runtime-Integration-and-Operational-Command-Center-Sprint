/**
 * NIYANTRAN Backend Data Transfer Objects (DTOs) and API Response Schemas
 * Directly mapped to NIYANTRAN backend controllers and services.
 */

export interface NiyantranDashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  testerApprovalCount: number;
  totalTasksChange?: number;
  completedTasksChange?: number;
  inProgressTasksChange?: number;
  pendingTasksChange?: number;
}

export interface NiyantranChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface NiyantranTasksOverview {
  statusData: NiyantranChartDataItem[];
  priorityData: NiyantranChartDataItem[];
}

export interface NiyantranDepartmentStat {
  id: string;
  name: string;
  color: string;
  total: number;
  completed: number;
}

export interface NiyantranLeaderboardUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  department?: {
    _id: string;
    name: string;
  } | string;
  avatar?: string;
  completedTasks: number;
  totalTasks: number;
  totalDependencies: number;
  workload: number;
  completionRate: number;
}

export interface NiyantranAttendanceSummaryRecord {
  _id: string;
  employee: {
    id: string;
    name: string;
    email: string;
    department?: Record<string, unknown>;
    biometricCode: string;
  };
  date: string;
  attendance: {
    status: string;
    isPresent: boolean;
    workedHours: number;
    verificationMethod?: string;
  };
  times: {
    clockIn: string | null;
    clockOut: string | null;
  };
  merge: {
    case: string;
    remarks: string;
    isWithinTolerance: boolean;
    timeDifferences?: Record<string, unknown>;
    hasAlert: boolean;
    alertType: string | null;
  };
  salary: {
    dailyRate: number;
    hourlyRate: number;
    earnedToday: number;
    currency: string;
    formattedEarnings: string;
  };
}

export interface NiyantranAttendanceSummary {
  success: boolean;
  dateRange?: {
    start?: string;
    end?: string;
  };
  summary?: {
    totalRecords: number;
    presentCount?: number;
    absentCount?: number;
    totalWorkedHours?: number;
    mismatches?: number;
  };
  records: NiyantranAttendanceSummaryRecord[];
  count: number;
}

export interface NiyantranMergeAnalysis {
  totalRecords: number;
  byMergeCase: Record<string, number>;
  byRemarks: Record<string, number>;
  mismatches: {
    total: number;
    within20min: number;
    beyond20min: number;
  };
  mappingIssues: number;
  timeDifferences?: Record<string, unknown>;
}

export interface NiyantranExecutionSession {
  _id?: string;
  execution_id: string;
  trace_id?: string;
  tenant_id?: string;
  contract_hash?: string;
  status: string;
  received_at?: string;
  updated_at?: string;
  // Backward compatibility accessors
  executionId?: string;
  traceId?: string;
  tenantId?: string;
  contractHash?: string;
  receivedAt?: string;
  updatedAt?: string;
}

export interface NiyantranExecutionEvent {
  _id?: string;
  event_id: string;
  execution_id: string;
  event_type: string;
  event_index?: number;
  event_timestamp: string;
  hash?: string;
  payload?: Record<string, unknown>;
  // Backward compatibility accessors
  eventId?: string;
  executionId?: string;
  eventType?: string;
  eventIndex?: number;
  eventTimestamp?: string;
}

export interface NiyantranTantraExecutionHistory {
  status: string;
  execution_id: string;
  trace_id?: string;
  tenant_id?: string;
  contract_hash?: string;
  session?: NiyantranExecutionSession;
  events?: NiyantranExecutionEvent[];
  lineage?: {
    start_hash: string;
    end_hash: string;
  };
  rejections?: Array<Record<string, unknown>>;
}

/**
 * Safely maps raw backend responses to NiyantranTantraExecutionHistory.
 * Preserves backend values, handles both snake_case and camelCase, and never fabricates missing IDs.
 */
export function mapNiyantranExecutionHistory(data: any): NiyantranTantraExecutionHistory {
  if (!data || typeof data !== "object") {
    return {
      status: "unknown",
      execution_id: "",
      events: [],
      rejections: [],
    };
  }

  const rawSession = data.session;
  const session: NiyantranExecutionSession | undefined = rawSession && typeof rawSession === "object"
    ? {
        _id: rawSession._id,
        execution_id: rawSession.execution_id || rawSession.executionId || data.execution_id || data.executionId || "",
        trace_id: rawSession.trace_id || rawSession.traceId || data.trace_id || data.traceId,
        tenant_id: rawSession.tenant_id || rawSession.tenantId || data.tenant_id || data.tenantId,
        contract_hash: rawSession.contract_hash || rawSession.contractHash || data.contract_hash || data.contractHash,
        status: rawSession.status || data.status || "unknown",
        received_at: rawSession.received_at || rawSession.receivedAt,
        updated_at: rawSession.updated_at || rawSession.updatedAt,
        // Populate legacy aliases
        executionId: rawSession.execution_id || rawSession.executionId || data.execution_id || data.executionId || "",
        traceId: rawSession.trace_id || rawSession.traceId || data.trace_id || data.traceId,
        tenantId: rawSession.tenant_id || rawSession.tenantId || data.tenant_id || data.tenantId,
        contractHash: rawSession.contract_hash || rawSession.contractHash || data.contract_hash || data.contractHash,
        receivedAt: rawSession.received_at || rawSession.receivedAt,
        updatedAt: rawSession.updated_at || rawSession.updatedAt,
      }
    : undefined;

  const rawEvents = Array.isArray(data.events) ? data.events : [];
  const events: NiyantranExecutionEvent[] = rawEvents.map((ev: any, index: number) => {
    const eventId = ev.event_id || ev.eventId || `evt-${index}`;
    const execId = ev.execution_id || ev.executionId || data.execution_id || data.executionId || "";
    const eventType = ev.event_type || ev.eventType || "UNKNOWN";
    const eventIdx = ev.event_index ?? ev.eventIndex ?? index;
    const eventTime = ev.event_timestamp || ev.eventTimestamp || ev.timestamp || "";
    return {
      _id: ev._id,
      event_id: eventId,
      execution_id: execId,
      event_type: eventType,
      event_index: eventIdx,
      event_timestamp: eventTime,
      hash: ev.hash || "",
      payload: ev.payload || {},
      // Legacy aliases
      eventId,
      executionId: execId,
      eventType,
      eventIndex: eventIdx,
      eventTimestamp: eventTime,
    };
  });

  return {
    status: data.status || "unknown",
    execution_id: data.execution_id || data.executionId || "",
    trace_id: data.trace_id || data.traceId,
    tenant_id: data.tenant_id || data.tenantId,
    contract_hash: data.contract_hash || data.contractHash,
    session,
    events,
    lineage: data.lineage && typeof data.lineage === "object"
      ? {
          start_hash: data.lineage.start_hash || data.lineage.startHash || "",
          end_hash: data.lineage.end_hash || data.lineage.endHash || "",
        }
      : undefined,
    rejections: Array.isArray(data.rejections) ? data.rejections : [],
  };
}

export interface NiyantranAim {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | string;
  date: string;
  aims: string;
  status?: string;
  completionStatus?: string;
  completed?: boolean;
  progressPercentage?: number;
  targetMetrics?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface NiyantranAlert {
  _id: string;
  employee?: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | string;
  message: string;
  timestamp: string;
  acknowledged?: boolean;
}

export interface NiyantranSubmission {
  _id: string;
  task: {
    _id: string;
    title: string;
  } | string;
  user: {
    _id: string;
    name: string;
  } | string;
  submissionNotes?: string;
  attachments?: string[];
  status: string;
  aiEvaluation?: Record<string, unknown>;
  createdAt: string;
}

export interface NiyantranTask {
  _id: string;
  title: string;
  description?: string;
  assignee?: {
    _id: string;
    name: string;
    email?: string;
  } | string;
  department?: {
    _id: string;
    name: string;
  } | string;
  priority: 'High' | 'Medium' | 'Low' | string;
  status: 'Completed' | 'In Progress' | 'Pending' | string;
  dependencies?: string[];
  dueDate?: string;
  createdAt?: string;
}

export interface NiyantranLiveLocationUser {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  department?: {
    _id: string;
    name: string;
    color?: string;
  };
  isPresent: boolean;
  workMode?: string;
  clockInTime?: string | null;
  location?: string;
  aims?: string;
}
