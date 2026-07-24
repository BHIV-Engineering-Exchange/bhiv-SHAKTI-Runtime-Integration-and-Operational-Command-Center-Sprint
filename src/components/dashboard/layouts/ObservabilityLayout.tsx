import { memo, useMemo } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { TelemetryCard } from "@/components/dashboard/primitives/TelemetryCard";

import { useTelemetryDashboard } from "@/hooks/useQueries";
import { useMetricsScaleStatus, useMetricsQueryPerformance } from "@/hooks/useBucketQueries";
import { formatTime } from "@/utils/format";

export default memo(function ObservabilityLayout() {
  const telemetry = useTelemetryDashboard();
  const scaleStatus = useMetricsScaleStatus();
  const queryPerf = useMetricsQueryPerformance();

  const data = telemetry.data;

  // Map telemetry data points or scale status to chart series
  const chartData = useMemo(() => {
    if (data?.metrics?.response_times && data.metrics.response_times.length > 0) {
      return data.metrics.response_times.map((rt, i) => ({
        time: rt ? formatTime(rt.timestamp) : "",
        response: rt && rt.value != null ? +rt.value.toFixed(1) : 0,
        rate: data.metrics?.event_rates?.[i]?.value != null ? +(data.metrics.event_rates[i].value).toFixed(1) : 0,
      }));
    }
    if (scaleStatus.data || queryPerf.data) {
      const now = formatTime(new Date().toISOString());
      return [
        { time: now, response: queryPerf.data?.p50_ms ?? 0, rate: scaleStatus.data?.concurrent_writes?.current ?? 0 },
        { time: now, response: queryPerf.data?.p99_ms ?? 0, rate: scaleStatus.data?.write_throughput?.current_writes_per_sec ?? 0 },
      ];
    }
    return [];
  }, [data, scaleStatus.data, queryPerf.data]);

  const series = useMemo(() => [
    { name: "Response (ms)", dataKey: "response", color: "#6366f1" },
    { name: "Event Rate / Concurrent", dataKey: "rate", color: "#10b981" },
  ], []);

  const summaryMetrics = useMemo(() => {
    const list = [];
    if (queryPerf.data) {
      list.push({ label: "p50 / p99 Latency", value: `${queryPerf.data.p50_ms}ms / ${queryPerf.data.p99_ms}ms` });
      list.push({ label: "p999 Latency", value: queryPerf.data.p999_ms, unit: "ms" });
      list.push({ label: "Queries / Sec", value: queryPerf.data.queries_per_sec });
    } else if (data?.summary) {
      list.push({ label: "Avg Response", value: (data.summary.avg_response_time ?? 0).toFixed(0), unit: "ms" });
      list.push({ label: "Total Events", value: (data.summary.total_events ?? 0).toLocaleString() });
      list.push({ label: "Error Rate", value: ((data.summary.error_rate ?? 0) * 100).toFixed(2), unit: "%" });
    }
    if (scaleStatus.data) {
      list.push({ label: "Concurrent Writes", value: `${scaleStatus.data.concurrent_writes.current}/${scaleStatus.data.concurrent_writes.limit}` });
      list.push({ label: "Storage Used", value: `${scaleStatus.data.storage.usage_percent.toFixed(1)}%` });
    }
    return list;
  }, [data, queryPerf.data, scaleStatus.data]);

  const isLoading = telemetry.isLoading && scaleStatus.isLoading && queryPerf.isLoading;
  const isError = !isLoading && (telemetry.isError && scaleStatus.isError && queryPerf.isError);
  const hasData = data !== undefined || scaleStatus.data !== undefined || queryPerf.data !== undefined;

  const timestamp = scaleStatus.data?.timestamp || data?.timestamp || new Date().toISOString();

  return (
    <DashboardCard
      title="Observability & Telemetry"
      ariaLabel="Observability Layout"
      isLoading={isLoading}
      isError={isError}
      hasData={hasData}
      onRetry={() => { telemetry.refetch(); scaleStatus.refetch(); queryPerf.refetch(); }}
      errorMessage="Failed to load telemetry"
      skeletonCount={1}
      skeletonHeight="h-48"
      isEmpty={!isLoading && !hasData}
      emptyMessage="No Runtime Data Available"
      timestamp={timestamp}
      isFetching={telemetry.isFetching || scaleStatus.isFetching || queryPerf.isFetching}
      isStale={telemetry.isStale || scaleStatus.isStale || queryPerf.isStale}
      traceId={(data as any)?.trace_id}
      dataSource="Bucket Metrics & Control Plane"
      headerRight={
        scaleStatus.data ? (
          <span className="text-xs text-slate-500">
            Storage:{" "}
            <span className="text-emerald-400 font-medium">
              {scaleStatus.data.storage.used_gb} GB / {scaleStatus.data.storage.total_gb} GB
            </span>
          </span>
        ) : data ? (
          <span className="text-xs text-slate-500">
            Uptime:{" "}
            <span className="text-emerald-400 font-medium">
              {(data.summary?.uptime_percentage ?? 100).toFixed(1)}%
            </span>
          </span>
        ) : undefined
      }
    >
      {hasData && (
        <div className="flex flex-col flex-1 min-h-0">
          <TelemetryCard
            data={chartData}
            xAxisKey="time"
            series={series}
            summaryMetrics={summaryMetrics}
            traceId={(data as any)?.trace_id}
          />
        </div>
      )}
    </DashboardCard>
  );
});
