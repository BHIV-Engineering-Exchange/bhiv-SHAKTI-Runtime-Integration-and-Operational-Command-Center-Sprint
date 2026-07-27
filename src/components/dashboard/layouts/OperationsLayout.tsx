import { memo, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatusCard } from "@/components/dashboard/primitives/StatusCard";
import { RuntimeCard } from "@/components/dashboard/primitives/RuntimeCard";
import {
  useOperationsDashboard,
  useSystemStatus,
  useMetrics,
  useTelemetryDashboard,
  useCapabilityRegistry,
} from "@/hooks/useQueries";
import {
  useBucketStorageStats,
  useBucketChainState,
  useConstitutionalStatus,
} from "@/hooks/useBucketQueries";
import { usePranaHealth } from "@/hooks/usePranaQueries";
import {
  useInsightFlowHealth,
  useInsightFlowBucketStatus,
  useInsightFlowStageMetrics,
} from "@/hooks/useInsightFlowQueries";
import { formatTime, toSeverity } from "@/utils/format";

export default memo(function OperationsLayout() {
  const ops = useOperationsDashboard();
  const status = useSystemStatus();
  const metrics = useMetrics();
  const telemetry = useTelemetryDashboard();
  const capabilityRegistry = useCapabilityRegistry();

  const bucketStats = useBucketStorageStats();
  const bucketChain = useBucketChainState();
  const constStatus = useConstitutionalStatus();
  const pranaHealth = usePranaHealth();

  const insightFlowHealth = useInsightFlowHealth();
  const insightFlowBucketStatus = useInsightFlowBucketStatus();
  const insightFlowStageMetrics = useInsightFlowStageMetrics();

  const sysComponents = status.data?.components ?? [];
  const findComp = (name: string) => sysComponents.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));

  const bhivBucketComp = findComp("bucket") || findComp("bhiv_bucket");
  const bhivCoreComp = findComp("core") || findComp("bhiv_core") || findComp("replay");
  const pranaComp = findComp("telemetry") || findComp("prana");
  const karmaComp = findComp("gate") || findComp("karma");
  const setuComp = findComp("bridge") || findComp("integration_bridge") || findComp("setu");
  const masterDbComp = findComp("masterdb") || findComp("master_db") || findComp("db");
  const workflowExecComp = findComp("workflow") || findComp("cet") || findComp("executor");
  const execEngineComp = findComp("sarathi") || findComp("engine") || findComp("execution");

  // Map BHIV Ecosystem Capabilities
  const bhivCapabilities = useMemo(() => {
    return [
      {
        id: "Bucket",
        hasRuntimeData: Boolean(bucketStats.data || bucketChain.data || bhivBucketComp),
        status: bucketStats.data?.status || bhivBucketComp?.status || (bucketChain.data ? "healthy" : undefined),
        latency: bhivBucketComp?.response_time_ms ?? ops.data?.latency_ms?.p50 ?? 15,
        events: bucketStats.data?.statistics?.artifact_count ?? bucketChain.data?.chain_state?.artifact_count ?? 0,
        dependencies: ["MASTERDB", "SETU"],
        replayAvailable: true,
        evidenceCount: bucketStats.data?.statistics?.log_file_size_mb ?? ops.data?.pipeline?.total_artifacts ?? 0,
        lastActivity: bucketStats.data ? new Date().toISOString() : ops.data?.timestamp,
      },
      {
        id: "Replay",
        hasRuntimeData: Boolean(bucketChain.data || bhivCoreComp || ops.data?.replay?.total_replays !== undefined),
        status: bhivCoreComp?.status || (bucketChain.data ? "healthy" : undefined),
        latency: bhivCoreComp?.response_time_ms,
        events: bucketChain.data?.chain_state?.artifact_count ?? ops.data?.replay?.total_replays,
        dependencies: ["Bucket"],
        replayAvailable: true,
        evidenceCount: ops.data?.replay?.failed_replays ?? 0,
        lastActivity: ops.data?.timestamp,
      },
      {
        id: "PRANA",
        hasRuntimeData: Boolean(pranaHealth.data || pranaComp || metrics.data?.events_processed !== undefined),
        status: pranaHealth.data?.status || pranaComp?.status || (metrics.data ? "healthy" : undefined),
        latency: pranaComp?.response_time_ms ?? 10,
        events: metrics.data?.events_processed ?? (pranaHealth.data?.forwarding_enabled ? 1 : 0),
        dependencies: ["InsightFlow", "Bucket"],
        replayAvailable: true,
        evidenceCount: metrics.data?.alerts_generated ?? (pranaHealth.data?.forwarding_enabled ? 1 : 0),
        lastActivity: pranaHealth.data?.timestamp || metrics.data?.timestamp,
      },
      {
        id: "KARMA",
        hasRuntimeData: Boolean(karmaComp || constStatus.data),
        status: karmaComp?.status || (constStatus.data ? "healthy" : undefined),
        latency: karmaComp?.response_time_ms,
        events: constStatus.data?.recent_violations_24h ?? 0,
        dependencies: ["Bucket"],
        replayAvailable: false,
        evidenceCount: constStatus.data?.critical_violations_24h ?? 0,
        lastActivity: karmaComp?.last_check,
      },
      {
        id: "InsightFlow",
        hasRuntimeData: Boolean(
          telemetry.data?.insightflow?.total_events !== undefined ||
          insightFlowHealth.data !== undefined
        ),
        status: insightFlowHealth.data?.status === "ONLINE"
          ? "healthy"
          : (insightFlowHealth.data?.status?.toLowerCase() || (telemetry.data ? "healthy" : undefined)),
        latency: (() => {
          if (insightFlowStageMetrics.data && insightFlowStageMetrics.data.length > 0) {
            const sumP50 = insightFlowStageMetrics.data.reduce((acc, curr) => acc + curr.p50_latency_ms, 0);
            return Math.round(sumP50 / insightFlowStageMetrics.data.length);
          }
          return telemetry.data?.summary?.avg_response_time;
        })(),
        events: telemetry.data?.insightflow?.total_events,
        dependencies: ["PRANA"],
        replayAvailable: true,
        evidenceCount: insightFlowBucketStatus.data?.failed_writes ?? null,
        lastActivity: telemetry.data?.timestamp || (insightFlowHealth.data ? new Date().toISOString() : null),
      },
      {
        id: "SETU",
        hasRuntimeData: Boolean(setuComp || metrics.data?.total_requests !== undefined),
        status: setuComp?.status || (metrics.data ? "healthy" : undefined),
        latency: setuComp?.response_time_ms,
        events: metrics.data?.total_requests,
        dependencies: ["MASTERDB"],
        replayAvailable: true,
        evidenceCount: null,
        lastActivity: setuComp?.last_check || metrics.data?.timestamp,
      },
      {
        id: "MASTERDB",
        hasRuntimeData: Boolean(masterDbComp),
        status: masterDbComp?.status,
        latency: masterDbComp?.response_time_ms,
        events: null,
        dependencies: null,
        replayAvailable: null,
        evidenceCount: null,
        lastActivity: masterDbComp?.last_check,
      },
      {
        id: "Workflow Executor",
        hasRuntimeData: Boolean(workflowExecComp),
        status: workflowExecComp?.status,
        latency: workflowExecComp?.response_time_ms,
        events: null,
        dependencies: null,
        replayAvailable: null,
        evidenceCount: null,
        lastActivity: workflowExecComp?.last_check,
      },
      {
        id: "Capability Registry",
        hasRuntimeData: Boolean(capabilityRegistry.data?.total_capabilities !== undefined && capabilityRegistry.data.total_capabilities > 0),
        status: capabilityRegistry.data ? "healthy" : undefined,
        latency: null,
        events: capabilityRegistry.data?.total_capabilities,
        dependencies: null,
        replayAvailable: null,
        evidenceCount: null,
        lastActivity: capabilityRegistry.data?.timestamp,
      },
      {
        id: "Execution Engine",
        hasRuntimeData: Boolean(execEngineComp),
        status: execEngineComp?.status,
        latency: execEngineComp?.response_time_ms,
        events: null,
        dependencies: null,
        replayAvailable: null,
        evidenceCount: null,
        lastActivity: execEngineComp?.last_check,
      },
    ];
  }, [
    bhivBucketComp,
    bhivCoreComp,
    pranaComp,
    karmaComp,
    setuComp,
    masterDbComp,
    workflowExecComp,
    execEngineComp,
    ops.data,
    metrics.data,
    telemetry.data,
    capabilityRegistry.data,
    bucketStats.data,
    bucketChain.data,
    constStatus.data,
    insightFlowHealth.data,
    insightFlowBucketStatus.data,
    insightFlowStageMetrics.data,
  ]);

  const isLoading = ops.isLoading || status.isLoading || metrics.isLoading;
  const isError = !isLoading && (ops.isError || status.isError || metrics.isError);
  const timestamp = ops.data?.timestamp || status.data?.timestamp;

  return (
    <DashboardCard
      title="BHIV Operations & Ecosystem Capabilities"
      ariaLabel="Operations Layout"
      isLoading={isLoading}
      isError={isError}
      hasData={ops.data !== undefined || status.data !== undefined}
      onRetry={() => {
        ops.refetch();
        status.refetch();
        metrics.refetch();
        telemetry.refetch();
        capabilityRegistry.refetch();
      }}
      errorMessage="Failed to load BHIV operations"
      skeletonCount={5}
      skeletonHeight="h-7"
      timestamp={timestamp}
      isFetching={ops.isFetching || status.isFetching}
      isStale={ops.isStale || status.isStale}
      traceId={(ops.data as any)?.trace_id}
      dataSource="Control Plane"
      headerRight={
        <div className="flex items-center gap-2">
          {timestamp && <span className="text-xs text-slate-500">{formatTime(timestamp)}</span>}
          <button onClick={() => { ops.refetch(); status.refetch(); }} className="text-slate-500 hover:text-slate-300 transition-colors">
            <RefreshCw size={12} className={ops.isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 h-full">
        {/* BHIV Capabilities Cards */}
        <div className="flex flex-col gap-1.5 min-h-0">
          <h3 className="text-[11px] uppercase font-mono font-semibold text-slate-400 tracking-wider">
            BHIV Capabilities & Runtime Nodes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto max-h-[190px] custom-scrollbar pr-1">
            {bhivCapabilities.map((cap) => (
              <RuntimeCard
                key={cap.id}
                id={cap.id}
                status={cap.status}
                latency={cap.latency}
                events={cap.events}
                dependencies={cap.dependencies}
                replayAvailable={cap.replayAvailable}
                evidenceCount={cap.evidenceCount}
                lastActivity={cap.lastActivity}
                hasRuntimeData={cap.hasRuntimeData}
              />
            ))}
          </div>
        </div>

        {/* Active Pipeline Operations */}
        {ops.data && (
          <div className="flex-1 flex flex-col min-h-0 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-700/60 mb-1.5 pb-0.5">
              <h3 className="text-xs font-semibold text-slate-300">Active Operations</h3>
              <span className="text-[10px] text-slate-500 font-mono font-semibold">
                {(ops.data.operations ?? []).length} total
              </span>
            </div>
            <div className="space-y-0.5 overflow-y-auto flex-1 min-h-0 max-h-[140px] custom-scrollbar pr-1">
              {(ops.data.operations ?? []).length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-3">No Runtime Data Available</p>
              ) : (
                (ops.data.operations ?? []).map((op) => (
                  <StatusCard
                    key={op.id}
                    label={op.type}
                    severity={toSeverity(op.priority)}
                    progress={op.progress}
                    statusTheme={op.status === "running" ? "running" : op.status === "failed" ? "failed" : "pending"}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
});
