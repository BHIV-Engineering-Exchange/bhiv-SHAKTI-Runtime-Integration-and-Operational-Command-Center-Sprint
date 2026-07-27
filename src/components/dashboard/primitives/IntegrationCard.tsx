import { memo } from "react";
import { Link2, Link2Off } from "lucide-react";
import type { OperationalStatus } from "@/types/api";

export interface IntegrationCardProps {
  /** Name of the external system */
  systemName: string;
  /** Integration status */
  status: OperationalStatus;
  /** Latency to the external system */
  latency?: number;
  /** Optional sync metric (e.g. "99.9% synced") */
  syncStatus?: string;
  /** Type of integration (e.g. "Webhook", "REST API") */
  protocol?: string;
}

export const IntegrationCard = memo(function IntegrationCard({
  systemName,
  status,
  latency,
  syncStatus,
  protocol,
}: IntegrationCardProps) {
  const statusStr = String(status).toLowerCase();
  const isOnline = statusStr === "online" || statusStr === "operational" || statusStr === "active" || statusStr === "healthy";
  const Icon = isOnline ? Link2 : Link2Off;

  // Visual state classification matching Task 8 requirements
  let statusColorClass = "text-slate-400";
  if (statusStr === "offline" || statusStr === "failed" || statusStr === "disconnected") {
    statusColorClass = "text-red-400";
  } else if (statusStr === "warning" || statusStr === "degraded" || statusStr === "connecting") {
    statusColorClass = "text-amber-400";
  } else if (statusStr === "online" || statusStr === "operational" || statusStr === "active" || statusStr === "healthy" || statusStr === "ok") {
    statusColorClass = "text-emerald-400";
  }

  return (
    <div className="flex items-center justify-between p-2 bg-slate-800/30 border border-slate-700/40 rounded-lg gap-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className={`p-1.5 rounded bg-slate-700/50 ${statusColorClass} shrink-0`}>
          <Icon size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate" title={systemName}>{systemName}</p>
            {protocol && (
              <span className="text-[9px] px-1 bg-slate-700 text-slate-400 rounded-sm uppercase shrink-0">{protocol}</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate" title={`${isOnline ? "Connected" : "Disconnected"}${syncStatus ? ` · ${syncStatus}` : ""}`}>
            {isOnline ? "Connected" : "Disconnected"} {syncStatus ? `· ${syncStatus}` : ""}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColorClass}`}>
          {status}
        </span>
        {latency != null && (
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{latency}ms ping</p>
        )}
      </div>
    </div>
  );
});
