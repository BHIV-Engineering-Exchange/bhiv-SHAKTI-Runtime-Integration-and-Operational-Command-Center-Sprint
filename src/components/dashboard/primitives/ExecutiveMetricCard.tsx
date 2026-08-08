import { memo } from "react";
import { MetricCardFramework } from "@bhiv/dashboard-sdk";
import type { TrendDirection, OperationalStatus } from "@/types/api";

export interface ExecutiveMetricCardProps {
  /** Metric label (e.g. "Active Incidents") */
  title: string;
  /** Primary metric value */
  value: string | number;
  /** Optional unit (e.g. "%", "GW") */
  unit?: string;
  /** Trend direction (up, down, stable) */
  trend: TrendDirection;
  /** String to show next to trend (e.g. "+2") */
  trendValue?: string;
  /** Optional status for the top-right icon */
  status?: OperationalStatus;
  /** Icon component */
  icon?: React.ElementType;
  /** Visual variant (primary with background, or compact KPI style) */
  variant?: "primary" | "compact";
}

export const ExecutiveMetricCard = memo(function ExecutiveMetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
}: ExecutiveMetricCardProps) {
  // Map SHAKTI TrendDirection to SDK trend type
  const sdkTrend: "up" | "down" | "neutral" = 
    trend === "up" ? "up" : 
    trend === "down" ? "down" : 
    "neutral";

  return (
    <MetricCardFramework
      label={title}
      value={value}
      unit={unit}
      change={trendValue}
      trend={sdkTrend}
    />
  );
});
