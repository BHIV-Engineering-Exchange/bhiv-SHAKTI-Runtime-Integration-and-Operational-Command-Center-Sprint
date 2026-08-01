import { memo, useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DecisionCard } from "@/components/dashboard/primitives/DecisionCard";
import { CapabilityCard } from "@/components/dashboard/primitives/CapabilityCard";

import { useOperationsDashboard } from "@/hooks/useQueries";
import { useNiyantranAims } from "@/hooks/useNiyantranQueries";
import { useSanskarRanking } from "@/hooks/useSanskarQueries";
import { useKarmaConfidence, useKarmaReasoning } from "@/hooks/useKarmaQueries";
import { toSeverity } from "@/utils/format";

function getPriority(score: number): { priority: string; severity: "critical" | "high" | "medium" | "low" | "info"; reason: string } {
  if (score >= 0.8) {
    return { priority: "critical", severity: "critical" as const, reason: "Score >= 0.8: critical priority -- immediate action required" };
  }
  if (score >= 0.6) {
    return { priority: "high", severity: "high" as const, reason: "Score >= 0.6: high priority -- action recommended within current cycle" };
  }
  if (score >= 0.4) {
    return { priority: "medium", severity: "medium" as const, reason: "Score >= 0.4: medium priority -- schedule for next cycle" };
  }
  return { priority: "low", severity: "low" as const, reason: "Score < 0.4: low priority -- monitor only" };
}

export default memo(function DecisionIntelligenceLayout() {
  const cpOperations = useOperationsDashboard();
  const niyantranAims = useNiyantranAims();
  const sanskarRanking = useSanskarRanking();

  // Map SANSKAR ranking, or fallback to real operations or NIYANTRAN aims
  const decisions = useMemo(() => {
    if (sanskarRanking.data && Array.isArray(sanskarRanking.data.entities) && sanskarRanking.data.entities.length > 0) {
      return sanskarRanking.data.entities.map((e, index) => {
        const priorityInfo = getPriority(e.score);
        return {
          id: e.entity_id,
          action: `Rank #${index + 1}: Region ${e.entity_id}`,
          actor: "SANSKAR Intelligence",
          reason: `Score: ${e.score} | Confidence: ${e.confidence}. ${priorityInfo.reason}`,
          status: e.score >= 0.6 ? ("executed" as const) : ("pending_approval" as const),
          severity: priorityInfo.severity,
          isAutomated: true,
        };
      });
    }

    const rawOps = cpOperations.data?.operations ?? [];
    if (rawOps.length > 0) {
      const sortedOps = [...rawOps].sort((a, b) => {
        const timeA = a.started_at ? new Date(a.started_at).getTime() : 0;
        const timeB = b.started_at ? new Date(b.started_at).getTime() : 0;
        return timeB - timeA;
      });

      return sortedOps.map(op => ({
        id: op.id,
        action: op.description,
        actor: op.agent,
        reason: `Priority: ${op.priority}. Progress: ${op.progress}%.`,
        status: op.status === "completed" ? ("executed" as const) : ("pending_approval" as const),
        severity: toSeverity(op.priority),
        isAutomated: true,
      }));
    }

    const aimsList = niyantranAims.data ?? [];
    return aimsList.map(a => ({
      id: a._id,
      action: a.aims,
      actor: typeof a.user === "object" ? a.user?.name : "Strategic Objective",
      reason: `Target Date: ${a.date}. Progress: ${a.progressPercentage || 50}%.`,
      status: a.status === "Completed" ? ("executed" as const) : ("pending_approval" as const),
      severity: a.status === "Blocked" ? ("critical" as const) : ("info" as const),
      isAutomated: true,
    }));
  }, [sanskarRanking.data, cpOperations.data?.operations, niyantranAims.data]);

  const [selectedTrajectoryId, setSelectedTrajectoryId] = useState<string | null>(null);

  const activeTrajectoryId = selectedTrajectoryId || decisions[0]?.id;
  const karmaConfidence = useKarmaConfidence(activeTrajectoryId);
  const karmaReasoning = useKarmaReasoning(activeTrajectoryId);

  const isLoading = cpOperations.isLoading && niyantranAims.isLoading && sanskarRanking.isLoading;
  const isError = !isLoading && cpOperations.isError && niyantranAims.isError && sanskarRanking.isError;
  const timestamp = sanskarRanking.data?.contract_version ? new Date().toISOString() : (cpOperations.data?.timestamp || (niyantranAims.data ? new Date().toISOString() : undefined));
  const isFetching = cpOperations.isFetching || niyantranAims.isFetching || sanskarRanking.isFetching || karmaConfidence.isFetching || karmaReasoning.isFetching;
  const isStale = cpOperations.isStale || niyantranAims.isStale || sanskarRanking.isStale || karmaConfidence.isStale || karmaReasoning.isStale;
  const dataSource = sanskarRanking.data?.entities ? "SANSKAR Domain Intelligence" : (cpOperations.data ? "Control Plane" : "NIYANTRAN");

  const loadSheddingActive = useMemo(() => cpOperations.data ? cpOperations.data.system_load > 85 : false, [cpOperations.data?.system_load]);
  const autoScalingActive = useMemo(() => cpOperations.data ? cpOperations.data.active_operations > 5 : false, [cpOperations.data?.active_operations]);

  return (
    <DashboardCard
      title="Decision Intelligence"
      ariaLabel="Decision Intelligence Layout"
      isLoading={isLoading}
      isError={isError}
      hasData={decisions.length > 0 || cpOperations.data !== undefined || niyantranAims.data !== undefined}
      onRetry={() => { cpOperations.refetch(); niyantranAims.refetch(); sanskarRanking.refetch(); karmaConfidence.refetch(); karmaReasoning.refetch(); }}
      errorMessage="Failed to load intelligence data"
      skeletonCount={4}
      skeletonHeight="h-20"
      timestamp={timestamp}
      isFetching={isFetching}
      isStale={isStale}
      traceId={(cpOperations.data as any)?.trace_id}
      dataSource={dataSource}
      isEmpty={decisions.length === 0}
      emptyMessage="No Runtime Data Available"
    >
      {decisions.length > 0 && (
        <div className="flex flex-col gap-2.5 h-full min-h-0">
          <div className="grid grid-cols-2 gap-2">
            <CapabilityCard
              name="Predictive Scaling"
              description="AI-driven resource scaling"
              status="online"
              isEngaged={autoScalingActive}
            />
            <CapabilityCard
              name="Load Shedding"
              description="Emergency request dropping"
              status="online"
              isEngaged={loadSheddingActive}
            />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-slate-300 mb-1.5 border-b border-slate-700/60 pb-0.5">Recent Decisions</h3>
            <div className="space-y-1 overflow-y-auto flex-1 min-h-0 max-h-[250px]">
              {decisions.map(d => {
                const isSelected = activeTrajectoryId === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedTrajectoryId(d.id)}
                    className={`cursor-pointer rounded transition-colors ${isSelected ? 'bg-indigo-950/40 border border-indigo-500/30' : 'hover:bg-slate-800/30 border border-transparent'}`}
                  >
                    <DecisionCard
                      action={d.action}
                      actor={d.actor}
                      reason={d.reason}
                      status={d.status}
                      severity={d.severity}
                      isAutomated={d.isAutomated}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* KARMA Trajectory Analysis Enrichment */}
          {(karmaConfidence.data || karmaReasoning.data) && (
            <div className="mt-3 p-2 bg-slate-900/40 border border-slate-800 rounded text-[11px] space-y-1.5 shrink-0">
              <h5 className="font-semibold text-indigo-400 uppercase tracking-wider text-[9px] flex items-center gap-1.5 border-b border-slate-850 pb-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                KARMA Trajectory Analysis
              </h5>
              {karmaConfidence.data && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Confidence Score:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {typeof karmaConfidence.data.confidence_score === 'number'
                      ? `${(karmaConfidence.data.confidence_score * 100).toFixed(1)}%`
                      : "—"}
                  </span>
                </div>
              )}
              {karmaConfidence.data?.explanation && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500">Explanation:</span>
                  <span className="text-slate-350 leading-relaxed bg-slate-950 p-1.5 rounded border border-slate-900 font-sans">
                    {karmaConfidence.data.explanation}
                  </span>
                </div>
              )}
              {karmaReasoning.data?.reasoning && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500">Explainable Reasoning:</span>
                  <span className="text-slate-300 leading-relaxed bg-slate-950 p-1.5 rounded border border-slate-900 font-sans">
                    {karmaReasoning.data.reasoning}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
});
