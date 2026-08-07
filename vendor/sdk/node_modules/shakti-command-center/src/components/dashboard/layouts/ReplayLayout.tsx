import { memo, useState, useMemo } from "react";
import { Play, CheckCircle, AlertOctagon } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ReplayCard } from "@/components/dashboard/primitives/ReplayCard";
import { useRuntimeDashboard } from "@/hooks/useQueries";

import { formatRelativeTime } from "@/utils/format";

type ReplayStatus = "running" | "completed" | "failed" | "idle";

const STATE_CONFIG: Record<ReplayStatus, { icon: React.ElementType; color: string; bar: string }> = {
  running: { icon: Play, color: "text-blue-400 animate-pulse", bar: "bg-blue-500" },
  completed: { icon: CheckCircle, color: "text-emerald-400", bar: "bg-emerald-500" },
  failed: { icon: AlertOctagon, color: "text-red-400 animate-bounce", bar: "bg-red-500" },
  idle: { icon: Play, color: "text-slate-500", bar: "bg-slate-700" },
};

function toReplayState(status: string): ReplayStatus {
  if (status === "active" || status === "running") return "running";
  if (status === "completed" || status === "success") return "completed";
  if (status === "failed" || status === "error") return "failed";
  return "idle";
}

export default memo(function ReplayLayout() {
  const { data, isLoading, isError, refetch, isFetching, isStale } = useRuntimeDashboard();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const allSessions = data?.sessions ?? [];

  const activeSession = useMemo(() => {
    if (selectedSessionId) {
      return allSessions.find(s => s.session_id === selectedSessionId);
    }
    return allSessions[0] || null;
  }, [allSessions, selectedSessionId]);





  return (
    <DashboardCard
      title="Simulation & Replay"
      ariaLabel="Replay Layout"
      isLoading={isLoading}
      isError={isError}
      hasData={data !== undefined}
      onRetry={refetch}
      errorMessage="Failed to load replay sessions"
      skeletonCount={2}
      skeletonHeight="h-10"
      isEmpty={data !== undefined && allSessions.length === 0}
      emptyMessage="No Replay Data Available"
      timestamp={data?.timestamp}
      isFetching={isFetching}
      isStale={isStale}
      traceId={(data as any)?.trace_id}
      dataSource="Replay Service"
      headerRight={data ? <span className="text-xs text-slate-500">{(data.active_sessions ?? 0)} active</span> : undefined}
    >
      {data && allSessions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full min-h-0 flex-1">
          {/* Column 1: Replay Sessions List */}
          <div className="lg:col-span-7 flex flex-col min-h-0 border-r border-slate-700/30 pr-2">
            <div className="overflow-y-auto flex-1 min-h-0 max-h-[250px] pr-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-800 z-10">
                  <tr className="border-b border-slate-700/60 text-[12px] font-semibold text-slate-400">
                    <th className="py-1 pb-1.5">Session</th>
                    <th className="py-1 pb-1.5">Operation</th>
                    <th className="py-1 pb-1.5">Progress</th>
                    <th className="py-1 pb-1.5 text-right">Started</th>
                  </tr>
                </thead>
                <tbody>
                  {allSessions.map((s) => {
                    const state = toReplayState(s.status);
                    const cfg = STATE_CONFIG[state] ?? STATE_CONFIG.idle;
                    const Icon = cfg.icon;
                    const clampedProgress = Math.min(100, Math.max(0, s.progress ?? 0));
                    const isSelected = activeSession?.session_id === s.session_id;

                    return (
                      <tr
                        key={s.session_id}
                        onClick={() => setSelectedSessionId(s.session_id)}
                        className={`cursor-pointer border-b border-slate-800/30 last:border-0 text-[13px] text-slate-200 transition-colors ${isSelected ? 'bg-slate-700/30' : 'hover:bg-slate-800/20'}`}
                      >
                        <td className="py-1 font-mono text-[11px] text-slate-355">
                          <div className="flex items-center gap-1">
                            <Icon size={10} className={`${cfg.color} shrink-0`} />
                            <span title={s.session_id}>{s.session_id.slice(0, 6)}</span>
                          </div>
                        </td>
                        <td className="py-1 font-semibold text-slate-250 truncate max-w-[100px]" title={s.current_operation ?? "Simulation Sequence"}>
                          {s.current_operation ?? "Simulation Sequence"}
                        </td>
                        <td className="py-1">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] text-slate-400 shrink-0">{clampedProgress}%</span>
                          </div>
                        </td>
                        <td className="py-1 text-right text-slate-500 text-[11px]">
                          {s.started_at ? formatRelativeTime(s.started_at) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 2: Replay Explorer Detailed Panel */}
          <div className="lg:col-span-5 flex flex-col min-h-0">
            {activeSession ? (
              <div className="flex flex-col h-full gap-3 justify-start">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-1">Replay Explorer</h3>
                  <ReplayCard
                    title={activeSession.current_operation || "Simulation Sequence"}
                    state={toReplayState(activeSession.status)}
                    progress={activeSession.progress ?? 0}
                    metricText={`${(activeSession.events_processed ?? 0).toLocaleString()} events processed`}
                    sessionId={activeSession.session_id}
                    timeSubtext={activeSession.started_at ? formatRelativeTime(activeSession.started_at) : undefined}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No session selected</p>
            )}
          </div>
        </div>
      )}
    </DashboardCard>
  );
});
