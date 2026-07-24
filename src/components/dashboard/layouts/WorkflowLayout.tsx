import { memo } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useOperationsDashboard } from "@/hooks/useQueries";
import { toSeverity, severityColor } from "@/utils/format";

interface WorkflowStep {
  name: string;
  status: "completed" | "active" | "pending" | "failed";
}

export default memo(function WorkflowLayout() {
  const { data, isLoading, isError, refetch, isFetching, isStale } = useOperationsDashboard();

  const active = data?.active_operations ?? 0;

  const buildSteps = (progress: number, status: string): WorkflowStep[] => {
    return [
      { name: "Init", status: "completed" },
      { name: "Process", status: progress < 50 ? "active" : "completed" },
      { name: "Verify", status: (progress >= 50 && progress < 100) ? "active" : progress === 100 ? "completed" : "pending" },
      { name: "Finalize", status: status === "completed" ? "completed" : status === "failed" ? "failed" : "pending" },
    ];
  };

  const allOperations = data?.operations ?? [];

  return (
    <DashboardCard
      title="Active Workflows"
      ariaLabel="Workflow Layout"
      isLoading={isLoading}
      isError={isError}
      hasData={data !== undefined}
      onRetry={refetch}
      errorMessage="Failed to load workflows"
      skeletonCount={3}
      skeletonHeight="h-10"
      timestamp={data?.timestamp}
      isFetching={isFetching}
      isStale={isStale}
      traceId={(data as any)?.trace_id}
      dataSource="Control Plane"
      isEmpty={data !== undefined && allOperations.length === 0}
      emptyMessage="No Runtime Data Available"
      headerRight={data ? <span className="text-xs text-slate-500">{active} active</span> : undefined}
    >
      {data && allOperations.length > 0 && (
        <div className="overflow-y-auto flex-1 min-h-0 max-h-[280px] pr-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-800 z-10">
              <tr className="border-b border-slate-700/60 text-[12px] font-semibold text-slate-400">
                <th className="py-1 pb-1.5">ID</th>
                <th className="py-1 pb-1.5 font-mono">Workflow</th>
                <th className="py-1 pb-1.5">Active Step</th>
                <th className="py-1 pb-1.5">Owner</th>
                <th className="py-1 pb-1.5">Progress</th>
                <th className="py-1 pb-1.5 text-right">Priority</th>
              </tr>
            </thead>
            <tbody>
              {allOperations.map((op) => {
                const steps = buildSteps(op.progress, op.status);
                return (
                  <tr key={op.id} className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/20 text-[13px] text-slate-200">
                    <td className="py-1 font-mono text-[11px] text-slate-450">
                      #{op.id.slice(0, 6)}
                    </td>
                    <td className="py-1 font-semibold text-slate-200 truncate max-w-[100px]" title={op.type}>
                      {op.type}
                    </td>
                    <td className="py-1 text-slate-400 truncate max-w-[120px]" title={op.description}>
                      {op.description}
                    </td>
                    <td className="py-1 text-slate-450 font-mono text-[11px] truncate max-w-[80px]" title={op.agent}>
                      {op.agent}
                    </td>
                    <td className="py-1">
                      <div className="flex items-center gap-1">
                        {steps.map((step, idx) => {
                          const isDone = step.status === "completed";
                          const isActive = step.status === "active";
                          const isFailed = step.status === "failed";

                          let colorClass = "bg-slate-700";
                          if (isDone) colorClass = "bg-emerald-500";
                          else if (isFailed) colorClass = "bg-red-500 animate-pulse";
                          else if (isActive) colorClass = "bg-blue-400 animate-pulse";

                          return (
                            <span
                              key={idx}
                              className={`w-2 h-2 rounded-full inline-block shrink-0 ${colorClass}`}
                              title={`${step.name}: ${step.status}`}
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className={`py-1 text-right font-bold capitalize font-mono text-[11px] ${severityColor(toSeverity(op.priority))}`}>
                      {op.priority}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
});
