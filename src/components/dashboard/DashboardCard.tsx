import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── DashboardCard ────────────────────────────────────────────────────────────
// Reusable wrapper for every dashboard zone.
// Handles: card shell, section title, loading skeletons, error + retry, empty state.
// Eliminates the 9× duplicated pattern across zone components.

interface DashboardCardProps {
  /** Section heading displayed in the card header */
  title: string;
  /** Override aria-label for the section; defaults to title */
  ariaLabel?: string;
  /** Optional content rendered to the right of the title (badges, status, refresh) */
  headerRight?: ReactNode;
  /** Show loading skeleton placeholders */
  isLoading?: boolean;
  /** Show error state with retry button */
  isError?: boolean;
  /** True if we have valid data (even if stale). Triggers graceful degradation UI if isError is also true. */
  hasData?: boolean;
  /** Callback for the retry button in error state */
  onRetry?: () => void;
  /** Error message shown in error state */
  errorMessage?: string;
  /** Custom title for error state instead of default */
  errorTitle?: string;
  /** When true, show the empty state message instead of children */
  isEmpty?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Number of skeleton rows during loading */
  skeletonCount?: number;
  /** Tailwind height class for each skeleton row */
  skeletonHeight?: string;
  /** Additional className merged with card base styles */
  className?: string;
  /** Content rendered in success state */
  children?: ReactNode;

  // Metadata props
  timestamp?: string;
  isFetching?: boolean;
  isStale?: boolean;
  traceId?: string;
  dataSource?: string;
}

function formatTimeWithSeconds(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  } catch {
    return iso;
  }
}

export function DashboardCard({
  title,
  ariaLabel,
  headerRight,
  isLoading = false,
  isError = false,
  hasData = false,
  onRetry,
  errorMessage = "Failed to load data",
  isEmpty = false,
  emptyMessage = "No Runtime Data Available",
  skeletonCount = 4,
  skeletonHeight = "h-14",
  className,
  children,
  timestamp,
  isFetching = false,
  isStale = false,
  traceId,
  dataSource,
  errorTitle,
}: DashboardCardProps) {
  let runtimeStatus: "LIVE" | "STALE" | "OFFLINE" = "LIVE";
  if (isError && !hasData) {
    runtimeStatus = "OFFLINE";
  } else if (isStale || (isError && hasData)) {
    runtimeStatus = "STALE";
  } else if (!hasData) {
    runtimeStatus = "OFFLINE";
  }

  return (
    <section
      aria-label={ariaLabel ?? title}
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "bg-slate-800/60 border border-slate-700/50 rounded-lg p-2 flex flex-col gap-1.5 h-full",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[13.5px] font-semibold text-slate-200">
          {title}
        </h2>
        {headerRight}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} className={`${skeletonHeight} bg-slate-700/50 rounded`} />
          ))}
        </div>
      ) : isError && !hasData ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 flex-1 border border-dashed border-slate-800 rounded-lg bg-slate-900/30 my-auto text-center gap-1">
          <p className="text-xs font-mono font-medium text-slate-400">{errorTitle ?? "No Runtime Data Available"}</p>
          <span className="text-[10px] text-slate-600 font-mono">{errorMessage}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-slate-400 hover:text-slate-200 underline mt-1.5 font-mono"
            >
              Retry
            </button>
          )}
        </div>
      ) : isEmpty ? (
        <p className="text-xs text-slate-500 text-center py-4">{emptyMessage}</p>
      ) : (
        <>
          {isError && hasData && (
            <div className="text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-1.5 rounded mb-2 flex items-center justify-between border border-yellow-500/20">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                Using cached data (Connection lost)
              </span>
              {onRetry && (
                <button onClick={onRetry} className="underline hover:text-yellow-400 transition-colors">
                   Retry
                </button>
              )}
            </div>
          )}
          {children}
        </>
      )}

      {/* Metadata Panel */}
      {hasData && (
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[9px] text-slate-500 border-t border-slate-700/30 pt-1 mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 shrink-0">
              <span className={cn(
                "w-1 h-1 rounded-full shrink-0",
                runtimeStatus === "LIVE" ? "bg-emerald-400 shadow-[0_0_3px_#34d399]" :
                runtimeStatus === "STALE" ? "bg-amber-400" : "bg-red-400"
              )} />
              <span className="text-slate-400 uppercase font-semibold">{runtimeStatus}</span>
            </span>
            {timestamp && (
              <span className="border-l border-slate-700/60 pl-2 shrink-0">
                Updated: <span className="font-mono text-slate-400">{formatTimeWithSeconds(timestamp)}</span>
              </span>
            )}
            {traceId && (
              <span className="border-l border-slate-700/60 pl-2 shrink-0">
                Trace: <span className="font-mono text-slate-400">{traceId}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {dataSource && (
              <span>
                Source: <span className="text-slate-400 font-medium">{dataSource}</span>
              </span>
            )}
            {isFetching && (
              <span className="flex items-center gap-0.5 text-indigo-400 shrink-0">
                <span className="w-1 h-1 rounded-full bg-indigo-400 animate-ping" />
                Refreshing
              </span>
            )}
            {isStale && (
              <span className="text-amber-500 font-semibold shrink-0">
                [STALE]
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
