import { memo, useState } from "react";
import {
  useSetuDashboard,
  useSetuTimeline,
  useSetuCandidateState,
  useSetuSignals,
  useSetuTelemetry,
} from "@/hooks/useSetuQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Activity, Clock, Zap, AlertCircle } from "lucide-react";
import { formatTime } from "@/utils/format";

interface SetuObservationViewProps {
  traceId?: string;
  tenantId?: string;
}

export const SetuObservationView = memo(function SetuObservationView({
  traceId,
  tenantId,
}: SetuObservationViewProps) {
  const [subTab, setSubTab] = useState<"summary" | "timeline" | "telemetry" | "signals">("summary");

  const dashboardQuery = useSetuDashboard(traceId, tenantId);
  const timelineQuery = useSetuTimeline(traceId, tenantId);
  const candidateQuery = useSetuCandidateState(traceId, tenantId);
  const signalsQuery = useSetuSignals(traceId, tenantId);
  const telemetryQuery = useSetuTelemetry(traceId, tenantId);

  const isLoading =
    dashboardQuery.isLoading ||
    timelineQuery.isLoading ||
    candidateQuery.isLoading ||
    signalsQuery.isLoading ||
    telemetryQuery.isLoading;

  const isError =
    dashboardQuery.isError &&
    timelineQuery.isError &&
    candidateQuery.isError &&
    signalsQuery.isError &&
    telemetryQuery.isError;

  if (!traceId) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono">
        Select or enter a Trace ID to inspect SETU observation data.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-6 bg-slate-800 rounded" />
        <Skeleton className="h-16 bg-slate-800 rounded" />
        <Skeleton className="h-24 bg-slate-800 rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-red-800/60 rounded bg-red-950/20 text-center gap-1.5 my-2">
        <AlertCircle size={16} className="text-red-400" />
        <span className="text-xs font-semibold text-red-300 font-mono">
          SETU observation unavailable
        </span>
        <span className="text-[10px] text-slate-400">
          Failed to retrieve runtime observation from SETU gateway.
        </span>
      </div>
    );
  }

  const dashboard = dashboardQuery.data;
  const timeline = timelineQuery.data?.timeline ?? dashboard?.timeline ?? [];
  const candidate = candidateQuery.data ?? dashboard?.candidate_state;
  const signals = signalsQuery.data?.signals ?? dashboard?.signals?.signals ?? [];
  const telemetryEvents = telemetryQuery.data?.events ?? [];

  const hasAnyData =
    Boolean(dashboard) ||
    timeline.length > 0 ||
    Boolean(candidate) ||
    signals.length > 0 ||
    telemetryEvents.length > 0;

  if (!hasAnyData) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono">
        No SETU observation data returned for trace: {traceId}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 text-[11px] space-y-2">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Eye size={10} />
            SETU OBSERVATION
          </span>
          <span className="font-mono text-slate-400 text-[10px] truncate max-w-[180px]" title={traceId}>
            {traceId}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {(tenantId || dashboard?.tenant_id || timelineQuery.data?.tenant_id) && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Tenant: {tenantId || dashboard?.tenant_id || timelineQuery.data?.tenant_id}
            </span>
          )}

          {(dashboard?.execution_id || timelineQuery.data?.execution_id) && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              Exec: {(dashboard?.execution_id || timelineQuery.data?.execution_id)?.slice(0, 10)}...
            </span>
          )}
        </div>
      </div>

      {/* Sub navigation */}
      <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded border border-slate-800 text-[10px]">
        {[
          { id: "summary" as const, label: "Candidate & Status", count: candidate ? 1 : 0 },
          { id: "timeline" as const, label: "Timeline", count: timeline.length },
          { id: "telemetry" as const, label: "Telemetry Events", count: telemetryEvents.length },
          { id: "signals" as const, label: "Signals", count: signals.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-0.5 px-1.5 rounded transition-colors flex items-center justify-center gap-1 ${
              subTab === tab.id
                ? "bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="text-[8px] font-mono px-1 rounded-full bg-slate-800 text-slate-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto max-h-[260px] pr-1 space-y-1.5">
        {subTab === "summary" && (
          <div className="space-y-1.5">
            {candidate ? (
              <div className="p-2 bg-slate-900/40 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate State:</span>
                  <span className="text-cyan-300 font-mono font-bold uppercase">{candidate.state}</span>
                </div>
                {candidate.evaluator && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Evaluator:</span>
                    <span className="text-slate-300 font-mono">{candidate.evaluator}</span>
                  </div>
                )}
                {candidate.execution_id && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Execution ID:</span>
                    <span className="text-emerald-400 font-mono select-all">{candidate.execution_id}</span>
                  </div>
                )}
                {candidate.created_at && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created:</span>
                    <span className="text-slate-400 font-mono">{formatTime(candidate.created_at)}</span>
                  </div>
                )}
                {candidate.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Updated:</span>
                    <span className="text-slate-400 font-mono">{formatTime(candidate.updated_at)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No candidate state recorded.</p>
            )}

            {dashboard && (
              <div className="p-2 bg-slate-900/30 rounded border border-slate-800 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Observation Mode:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {dashboard.observational_only ? "STRICT_READ_ONLY" : "ACTIVE"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dashboard Status:</span>
                  <span className="text-slate-300 font-mono">{dashboard.status}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {subTab === "timeline" && (
          <div className="space-y-1">
            {timeline.length > 0 ? (
              timeline.map((evt, idx) => (
                <div
                  key={evt.event_id || idx}
                  className="p-1.5 bg-slate-900/40 rounded border border-slate-800 text-[10px] space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Clock size={10} className="text-cyan-400" />
                      {evt.stage || "Stage Unknown"}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">
                      {evt.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[9px]">
                    <span className="font-mono">{formatTime(evt.timestamp)}</span>
                    {evt.event_id && <span className="font-mono">{evt.event_id.slice(0, 8)}...</span>}
                  </div>
                  {evt.details && Object.keys(evt.details).length > 0 && (
                    <div className="text-[9px] font-mono text-slate-400 bg-slate-950/60 p-1 rounded mt-0.5 break-all">
                      {JSON.stringify(evt.details)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No timeline events recorded.</p>
            )}
          </div>
        )}

        {subTab === "telemetry" && (
          <div className="space-y-1">
            {telemetryEvents.length > 0 ? (
              telemetryEvents.map((te, idx) => (
                <div
                  key={idx}
                  className="p-1.5 bg-slate-900/40 rounded border border-slate-800 text-[10px] space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Zap size={10} className="text-amber-400" />
                      {te.event_type}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {te.source_system || "setu"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[9px]">
                    <span className="font-mono">{formatTime(te.timestamp)}</span>
                    {te.execution_id && (
                      <span className="font-mono text-emerald-400">
                        Exec: {te.execution_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                  {te.details && Object.keys(te.details).length > 0 && (
                    <div className="text-[9px] font-mono text-slate-400 bg-slate-950/60 p-1 rounded mt-0.5 break-all">
                      {JSON.stringify(te.details)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No telemetry events recorded.</p>
            )}
          </div>
        )}

        {subTab === "signals" && (
          <div className="space-y-1">
            {signals.length > 0 ? (
              signals.map((sig, idx) => (
                <div
                  key={sig.signal_id || idx}
                  className="p-1.5 bg-slate-900/40 rounded border border-slate-800 text-[10px] space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Activity size={10} className="text-indigo-400" />
                      {sig.signal_type}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {(sig.signal_id || "").slice(0, 10)}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[9px] font-mono">
                    {formatTime(sig.timestamp)}
                  </div>
                  {sig.payload && Object.keys(sig.payload).length > 0 && (
                    <div className="text-[9px] font-mono text-slate-400 bg-slate-950/60 p-1 rounded mt-0.5 break-all">
                      {JSON.stringify(sig.payload)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No signals recorded.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
