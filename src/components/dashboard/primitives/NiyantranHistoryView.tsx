import { memo, useState } from "react";
import { useNiyantranExecutionHistory } from "@/hooks/useNiyantranQueries";
import { useSovereignTraces } from "@/hooks/useRajyaQueries";
import type { SovereignExecutionTrace } from "@/types/sovereign";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, AlertTriangle, Lock, ShieldCheck, Hash, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatTime } from "@/utils/format";

interface NiyantranHistoryViewProps {
  executionId?: string;
  tenantId?: string;
  sovereignTrace?: SovereignExecutionTrace | null;
}

export const NiyantranHistoryView = memo(function NiyantranHistoryView({
  executionId,
  tenantId,
  sovereignTrace,
}: NiyantranHistoryViewProps) {
  const [subTab, setSubTab] = useState<"session" | "events" | "rejections">("session");

  // Query live Sovereign Core execution traces
  const sovereignTraces = useSovereignTraces();
  const activeSovereignTrace =
    sovereignTrace !== undefined
      ? sovereignTrace
      : sovereignTraces.data?.find((t) => t.execution_id === executionId) ||
        (sovereignTraces.data && sovereignTraces.data.length > 0 ? sovereignTraces.data[0] : null);

  const effectiveId = executionId || activeSovereignTrace?.execution_id;

  // STRICT RULE: Only query legacy Niyantran execution history when BOTH a real executionId
  // and an authoritative tenantId are available. Never fabricate or default tenant IDs.
  const hasAuthoritativeTenant = Boolean(tenantId && tenantId.trim().length > 0);
  const canQuery = Boolean(effectiveId && hasAuthoritativeTenant);

  const { data, isLoading, isError } = useNiyantranExecutionHistory(
    canQuery ? effectiveId : undefined,
    canQuery ? tenantId : undefined
  );

  const session = data?.session;
  const events = data?.events ?? [];
  const rejections = data?.rejections ?? [];

  if (!effectiveId && !activeSovereignTrace) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono">
        No execution ID available. Polling Sovereign Core trace stream (3s)...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 text-[11px] space-y-2">
      {/* 1. Sovereign Core Live Execution Trace (Canonical contract from Rajaryan Verma) */}
      {activeSovereignTrace && (
        <div className="p-2.5 bg-slate-900/60 rounded border border-indigo-500/30 space-y-2 font-mono">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                <ShieldCheck size={11} />
                SOVEREIGN CORE / RAJYA
              </span>
              <span className="text-[10px] text-slate-300 truncate max-w-[160px]" title={activeSovereignTrace.execution_id}>
                {activeSovereignTrace.execution_id}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px]">
              <span className={`px-1.5 py-0.5 rounded border uppercase font-bold ${
                activeSovereignTrace.execution_status === "COMPLETED"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : activeSovereignTrace.execution_status === "FAILED" || activeSovereignTrace.execution_status === "CRASHED"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {activeSovereignTrace.execution_status}
              </span>
              <span className={`px-1.5 py-0.5 rounded border uppercase font-bold ${
                activeSovereignTrace.rajya_verdict === "EXECUTION_APPROVED"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : activeSovereignTrace.rajya_verdict === "DENY"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {activeSovereignTrace.rajya_verdict}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
            <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800/80">
              <span className="text-slate-500 block text-[9px]">Core Status</span>
              <span className="text-cyan-300 font-semibold">{activeSovereignTrace.core_status}</span>
            </div>
            <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800/80">
              <span className="text-slate-500 block text-[9px]">Sarathi Status</span>
              <span className="text-indigo-300 font-semibold">{activeSovereignTrace.sarathi_status}</span>
            </div>
            <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800/80">
              <span className="text-slate-500 block text-[9px]">DGIC State</span>
              <span className="text-purple-300 font-semibold">{activeSovereignTrace.dgic_state}</span>
            </div>
            <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800/80">
              <span className="text-slate-500 block text-[9px]">Risk / Conf</span>
              <span className="text-amber-300 font-semibold">
                {activeSovereignTrace.risk_score != null ? activeSovereignTrace.risk_score.toFixed(2) : "N/A"} / {activeSovereignTrace.confidence.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-[10px] space-y-1 pt-1 border-t border-slate-800/60 text-slate-400">
            <div className="flex justify-between items-center">
              <span>Bucket Persisted:</span>
              <span className={activeSovereignTrace.bucket_persistence ? "text-emerald-400 font-bold" : "text-slate-500"}>
                {activeSovereignTrace.bucket_persistence ? "TRUE" : "FALSE"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Failure Reason:</span>
              <span className={activeSovereignTrace.failure_reason ? "text-red-400" : "text-slate-500"}>
                {activeSovereignTrace.failure_reason || "None"}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="shrink-0 flex items-center gap-1">
                <Hash size={10} /> Trace Hash:
              </span>
              <span className="text-[9px] text-slate-300 truncate max-w-[240px]" title={activeSovereignTrace.trace_hash}>
                {activeSovereignTrace.trace_hash}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Legacy Tantra History / Tenant Guard */}
      {!hasAuthoritativeTenant ? (
        <div className="p-3 bg-slate-900/40 rounded border border-amber-500/30 text-center space-y-1.5 my-1">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-mono font-semibold text-xs">
            <Lock size={13} />
            <span>Legacy Session Context: Tenant Required</span>
          </div>
          <p className="text-[10px] text-slate-400 max-w-md mx-auto">
            Granular event-level execution logs require an authoritative <code className="font-mono text-cyan-300">x-tenant-id</code>. Sovereign Core enforcement trace above remains available.
          </p>
        </div>
      ) : isLoading ? (
        <div className="space-y-2 p-2">
          <Skeleton className="h-6 bg-slate-800 rounded" />
          <Skeleton className="h-16 bg-slate-800 rounded" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-3 border border-dashed border-red-800/60 rounded bg-red-950/20 text-center gap-1 my-1">
          <AlertTriangle size={15} className="text-red-400" />
          <span className="text-xs font-semibold text-red-300 font-mono">
            Legacy execution history unavailable
          </span>
        </div>
      ) : !data ? (
        <div className="p-3 text-center text-xs text-slate-500 font-mono">
          No execution history recorded for ID: {effectiveId}
        </div>
      ) : (
        <>
          {/* Legacy Header Info */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Server size={10} />
                NIYANTRAN HISTORY
              </span>
              <span className="font-mono text-slate-400 text-[10px] truncate max-w-[160px]" title={effectiveId}>
                {effectiveId}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px]">
              {data.status && (
                <span
                  className={`px-1.5 py-0.5 rounded border uppercase font-bold ${
                    data.status === "COMPLETED" || data.status === "SUCCESS"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : data.status === "FAILED"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}
                >
                  {data.status}
                </span>
              )}
              {data.tenant_id && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Tenant: {data.tenant_id}
                </span>
              )}
            </div>
          </div>

      {/* Sub navigation */}
      <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded border border-slate-800 text-[10px]">
        {[
          { id: "session" as const, label: "Session & Lineage", count: session ? 1 : 0 },
          { id: "events" as const, label: "Execution Events", count: events.length },
          { id: "rejections" as const, label: "Rejections", count: rejections.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-0.5 px-1.5 rounded transition-colors flex items-center justify-center gap-1 ${
              subTab === tab.id
                ? "bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 font-semibold"
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
        {subTab === "session" && (
          <div className="space-y-1.5">
            {session ? (
              <div className="p-2 bg-slate-900/40 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Execution ID:</span>
                  <span className="text-cyan-300 font-mono font-bold">{session.execution_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-mono font-bold uppercase">{session.status}</span>
                </div>
                {session.received_at && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Received At:</span>
                    <span className="text-slate-400 font-mono">{formatTime(session.received_at)}</span>
                  </div>
                )}
                {session.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Updated At:</span>
                    <span className="text-slate-400 font-mono">{formatTime(session.updated_at)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No session data recorded.</p>
            )}

            {data.contract_hash && (
              <div className="p-2 bg-slate-900/30 rounded border border-slate-800 space-y-0.5">
                <span className="text-[9px] text-slate-500 uppercase font-semibold block">Contract Hash</span>
                <span className="text-[9px] font-mono text-emerald-400 break-all select-all block bg-slate-950 p-1 rounded">
                  {data.contract_hash}
                </span>
              </div>
            )}
          </div>
        )}

        {subTab === "events" && (
          <div className="space-y-1">
            {events.length > 0 ? (
              events.map((evt, idx) => (
                <div
                  key={evt.event_id || idx}
                  className="p-1.5 bg-slate-900/40 rounded border border-slate-800 text-[10px] space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-emerald-400" />
                      {evt.event_type}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      Index: {evt.event_index ?? idx}
                    </span>
                  </div>
                  {evt.event_timestamp && (
                    <div className="text-slate-500 text-[9px] font-mono">
                      {formatTime(evt.event_timestamp)}
                    </div>
                  )}
                  {evt.payload && Object.keys(evt.payload).length > 0 && (
                    <div className="text-[9px] font-mono text-slate-400 bg-slate-950/60 p-1 rounded mt-0.5 break-all">
                      {JSON.stringify(evt.payload)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No execution events recorded.</p>
            )}
          </div>
        )}

        {subTab === "rejections" && (
          <div className="space-y-1">
            {rejections.length > 0 ? (
              rejections.map((rej, idx) => {
                const rejId = typeof rej.rejection_id === "string" ? rej.rejection_id : String(idx);
                const reason = typeof rej.reason === "string" ? rej.reason : "Rejection";
                const code = typeof rej.code === "string" ? rej.code : undefined;
                const timestamp = typeof rej.timestamp === "string" ? rej.timestamp : undefined;
                const details = rej.details && typeof rej.details === "object" ? rej.details : undefined;

                return (
                  <div
                    key={rejId}
                    className="p-1.5 bg-red-950/20 rounded border border-red-800/40 text-[10px] space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-red-300 font-semibold">
                      <span className="flex items-center gap-1">
                        <ShieldAlert size={10} className="text-red-400" />
                        {reason}
                      </span>
                      {code && <span className="font-mono text-[9px]">{code}</span>}
                    </div>
                    {timestamp && (
                      <div className="text-slate-500 text-[9px] font-mono">
                        {formatTime(timestamp)}
                      </div>
                    )}
                    {details && Object.keys(details).length > 0 && (
                      <div className="text-[9px] font-mono text-slate-400 bg-slate-950/60 p-1 rounded mt-0.5 break-all">
                        {JSON.stringify(details)}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No governance rejections recorded.</p>
            )}
          </div>
        )}
      </div>
    </>
  )}
</div>
  );
});
