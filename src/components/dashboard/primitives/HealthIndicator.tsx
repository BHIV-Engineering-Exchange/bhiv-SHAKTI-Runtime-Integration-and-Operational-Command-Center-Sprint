import { memo } from "react";
import { StatusIndicatorRow } from "@bhiv/ui";
import type { StatusTone } from "@bhiv/ui";
import type { OperationalStatus } from "@/types/api";

export interface HealthIndicatorProps {
  /** Name of the component, service, or API */
  name: string;
  /** Current operational state */
  status: OperationalStatus;
  /** Optional response time in ms */
  responseTime?: number;
  /** Optional detail or error string */
  detail?: string;
  /** True to hide the border-bottom (default false) */
  noBorder?: boolean;
}

export const HealthIndicator = memo(function HealthIndicator({
  name,
  status,
  responseTime,
  detail,
  noBorder = false,
}: HealthIndicatorProps) {
  // Map SHAKTI OperationalStatus to SDK StatusTone
  const sdkTone: StatusTone = 
    status === "online" ? "success" : 
    status === "offline" ? "danger" : 
    "caution"; // Maps both degraded and warning to caution

  // Build the metrics array from responseTime and detail props
  const metrics = [
    { value: responseTime != null ? `${responseTime}ms` : "—", width: "w-14" as const },
    { value: detail || "—", width: "w-16" as const, title: detail }
  ];

  return (
    <StatusIndicatorRow
      label={name}
      tone={sdkTone}
      statusText={status}
      metrics={metrics}
      noBorder={noBorder}
    />
  );
});
