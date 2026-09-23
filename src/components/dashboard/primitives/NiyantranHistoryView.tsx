import { memo, useState } from "react";
import { useNiyantranExecutionHistory } from "@/hooks/useNiyantranQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, ShieldAlert, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import { formatTime } from "@/utils/format";

interface NiyantranHistoryViewProps {
  executionId?: string;
  tenantId?: string;
}

export const NiyantranHistoryView = memo(function NiyantranHistoryView({
  executionId,
  tenantId,
}: NiyantranHistoryViewProps) {
  const [subTab, setSubTab] = useState<"session" | "events" | "rejections">("session");

  // STRICT RULE: Only query Niyantran execution history when BOTH a real executionId
  // and an authoritative tenantId are available. Never fabricate or default tenant IDs.
  const hasAuthoritativeTenant = Boolean(tenantId && tenantId.trim().length > 0);
  const canQuery = Boolean(executionId && hasAuthoritativeTenant);

  const { data, isLoading, isError } = useNiyantranExecutionHistory(
    canQuery ? executionId : undefined,
    canQuery ? tenantId : undefined
  );

  if (!executionId) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono">
        No execution ID available for this trace. Awaiting execution trigger or handoff.
      </div>
    );
  }

  if (!hasAuthoritativeTenant) {
    return (
      <div className="p-4 bg-slate-900/40 rounded border border-amber-500/30 text-center space-y-2 my-2">
        <div className="flex items-center justify-center gap-1.5 text-amber-400 font-mono font-semibold text-xs">
          <Lock size={14} />
          <span>Tenant Context Required</span>
        </div>
        <p className="text-[11px] text-slate-300 max-w-md mx-auto">
          Niyantran execution history endpoint requires an authoritative <code className="font-mono text-cyan-300">x-tenant-id</code> header to prevent cross-tenant violations (403).
        </p>
        <p className="text-[10px] text-slate-500 font-mono">
          Outbound tenant propagation is currently blocked pending authoritative SETU tenant provider resolution.
        </p>
        <div className="text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800">
          Target Execution ID: <span className="text-emerald-400">{executionId}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-6 bg-slate-800 rounded" />
        <Skeleton className="h-16 bg-slate-800 rounded" />
        <Skeleton className="h-20 bg-slate-800 rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-red-800/60 rounded bg-red-950/20 text-center gap-1.5 my-2">
        <AlertTriangle size={16} className="text-red-400" />
        <span className="text-xs font-semibold text-red-300 font-mono">
          Niyantran execution history unavailable
        </span>
        <span className="text-[10px] text-slate-400">
          Failed to retrieve execution history from Niyantran gateway.
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono">
        No execution history recorded for execution ID: {executionId}
      </div>
    );
  }

  const events = data.events ?? [];
  const rejections = data.rejections ?? [];
  const session = data.session;

  return (
    <div className="flex flex-col h-full min-h-0 text-[11px] space-y-2">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Server size={10} />
            NIYANTRAN HISTORY
          </span>
          <span className="font-mono text-slate-400 text-[10px] truncate max-w-[160px]" title={executionId}>
            {executionId}
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
    </div>
  );
});
