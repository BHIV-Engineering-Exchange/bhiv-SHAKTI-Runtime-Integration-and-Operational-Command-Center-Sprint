import { memo } from "react";
import { ProgressStatusRow } from "@bhiv/ui";
import type { StatusTone } from "@bhiv/ui";
import type { Severity } from "@/types/api";

export interface StatusCardProps {
  /** Identifier or name of the status */
  label: string;
  /** Severity/priority of the item */
  severity: Severity;
  /** Current progress or completion state (0-100) */
  progress?: number;
  /** Visual theme mapping for the progress bar */
  statusTheme?: "running" | "completed" | "failed" | "pending" | "paused";
  /** Optional supplementary string right-aligned */
  secondaryText?: string;
}

export const StatusCard = memo(function StatusCard({
  label,
  severity,
  progress = 0,
  statusTheme = "running",
  secondaryText,
}: StatusCardProps) {
  // Map SHAKTI Severity to SDK StatusTone
  const sdkTone: StatusTone = 
    severity === "critical" ? "danger" : 
    severity === "high" || severity === "medium" ? "caution" : 
    severity === "low" ? "success" : 
    "info";

  // Map statusTheme to barTone
  const sdkBarTone: StatusTone = 
    statusTheme === "running" ? "info" : 
    statusTheme === "completed" ? "success" : 
    statusTheme === "failed" ? "danger" : 
    statusTheme === "pending" ? "caution" : 
    "neutral";

  return (
    <ProgressStatusRow
      label={label}
      progress={progress}
      tone={sdkTone}
      barTone={sdkBarTone}
      trailingText={secondaryText || severity}
    />
  );
});
