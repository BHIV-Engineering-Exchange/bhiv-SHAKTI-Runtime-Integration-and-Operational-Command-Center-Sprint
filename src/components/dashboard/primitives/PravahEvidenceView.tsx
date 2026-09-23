import { memo, useState, useMemo } from "react";
import { usePravahTraceRegistry, usePravahEvidence } from "@/hooks/usePravahQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Layers, FileText, AlertCircle } from "lucide-react";
import { formatTime } from "@/utils/format";

interface PravahEvidenceViewProps {
  traceId?: string;
}

export const PravahEvidenceView = memo(function PravahEvidenceView({
  traceId,
}: PravahEvidenceViewProps) {
  const [subTab, setSubTab] = useState<"records" | "bundles" | "provenance">("bundles");
  const [selectedEvidenceRef, setSelectedEvidenceRef] = useState<string | null>(null);

  const registryQuery = usePravahTraceRegistry(traceId);

  // STRICT RULE: Only query Pravah evidence bundle if an actual evidence_ref exists
  // in the registry response. Never invent or synthesize evidence_ref values.
  const evidenceBundles = useMemo(
    () => registryQuery.data?.evidence_bundles ?? [],
    [registryQuery.data?.evidence_bundles]
  );

  const activeEvidenceRef = useMemo(() => {
    if (selectedEvidenceRef) {
      const match = evidenceBundles.find((b) => b.evidence_ref === selectedEvidenceRef);
      if (match) return match.evidence_ref;
    }
    return evidenceBundles[0]?.evidence_ref ?? null;
  }, [evidenceBundles, selectedEvidenceRef]);

  const evidenceQuery = usePravahEvidence(activeEvidenceRef || undefined);

  if (!traceId) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono">
        Select or enter a Trace ID to inspect Pravah registry and evidence.
      </div>
    );
  }

  if (registryQuery.isLoading) {
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-6 bg-slate-800 rounded" />
        <Skeleton className="h-16 bg-slate-800 rounded" />
        <Skeleton className="h-24 bg-slate-800 rounded" />
      </div>
    );
  }

  if (registryQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-red-800/60 rounded bg-red-950/20 text-center gap-1.5 my-2">
        <AlertCircle size={16} className="text-red-400" />
        <span className="text-xs font-semibold text-red-300 font-mono">
          Pravah data unavailable
        </span>
        <span className="text-[10px] text-slate-400">
          Failed to retrieve trace registry from Pravah control plane proxy (/api/pravah).
        </span>
      </div>
    );
  }

  const registry = registryQuery.data;
  const executionRecords = registry?.execution_records ?? [];
  const provenanceSummary = registry?.provenance_summary;
  const evidenceDetail = evidenceQuery.data;

  const hasAnyData =
    executionRecords.length > 0 ||
    evidenceBundles.length > 0 ||
    Boolean(provenanceSummary);

  if (!hasAnyData) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 font-mono">
        No Pravah registry data available for trace: {traceId}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 text-[11px] space-y-2">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <Shield size={10} />
            PRAVAH REGISTRY
          </span>
          <span className="font-mono text-slate-400 text-[10px] truncate max-w-[180px]" title={traceId}>
            {traceId}
          </span>
        </div>

        {provenanceSummary?.governance_adherence && (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
            {provenanceSummary.governance_adherence}
          </span>
        )}
      </div>

      {/* Sub navigation */}
      <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded border border-slate-800 text-[10px]">
        {[
          { id: "bundles" as const, label: "Evidence Bundles", count: evidenceBundles.length },
          { id: "records" as const, label: "Execution Records", count: executionRecords.length },
          { id: "provenance" as const, label: "Provenance Summary", count: provenanceSummary ? 1 : 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-0.5 px-1.5 rounded transition-colors flex items-center justify-center gap-1 ${
              subTab === tab.id
                ? "bg-purple-600/30 text-purple-200 border border-purple-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="text-[8px] font-mono px-1 rounded-full bg-slate-800 text-slate-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto max-h-[260px] pr-1 space-y-1.5">
        {subTab === "bundles" && (
          <div className="space-y-2">
            {/* Bundles Selector */}
            {evidenceBundles.length > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Bundles for this trace:</span>
                  <span className="font-mono text-[9px]">{evidenceBundles.length} indexed</span>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {evidenceBundles.map((bundle) => {
                    const isSelected = activeEvidenceRef === bundle.evidence_ref;
                    return (
                      <div
                        key={bundle.bundle_id || bundle.evidence_ref}
                        onClick={() => setSelectedEvidenceRef(bundle.evidence_ref)}
                        className={`p-1.5 rounded border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-purple-950/40 border-purple-500/50"
                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-cyan-300 text-[10px]">
                            {bundle.evidence_ref}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {bundle.decision_type || bundle.action || "Evidence"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 text-[9px] mt-0.5">
                          <span>Decision: {bundle.decision_id || "N/A"}</span>
                          <span>Source: {bundle.source || "pravah"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Evidence Detail Panel */}
                {activeEvidenceRef && (
                  <div className="mt-2 p-2 bg-slate-900/60 rounded border border-purple-500/30 space-y-1.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <span className="font-semibold text-purple-300 text-[10px] flex items-center gap-1">
                        <FileText size={11} />
                        Evidence Bundle Details
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 select-all">
                        {activeEvidenceRef}
                      </span>
                    </div>

                    {evidenceQuery.isLoading ? (
                      <div className="space-y-1 py-2">
                        <Skeleton className="h-4 bg-slate-800 rounded" />
                        <Skeleton className="h-10 bg-slate-800 rounded" />
                      </div>
                    ) : evidenceQuery.isError ? (
                      <div className="p-2 text-center text-red-400 text-[10px] font-mono">
                        Failed to fetch evidence bundle details ({activeEvidenceRef}).
                      </div>
                    ) : evidenceDetail ? (
                      <div className="space-y-1 text-[10px]">
                        {evidenceDetail.decision_id && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Decision ID:</span>
                            <span className="font-mono text-slate-300">{evidenceDetail.decision_id}</span>
                          </div>
                        )}
                        {evidenceDetail.execution_id && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Execution ID:</span>
                            <span className="font-mono text-emerald-400">{evidenceDetail.execution_id}</span>
                          </div>
                        )}
                        {evidenceDetail.produced_at && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Produced At:</span>
                            <span className="font-mono text-slate-400">{formatTime(evidenceDetail.produced_at)}</span>
                          </div>
                        )}
                        {evidenceDetail.constitutional_hash && (
                          <div className="flex flex-col gap-0.5 pt-0.5 border-t border-slate-800">
                            <span className="text-slate-500 text-[9px]">Constitutional Hash:</span>
                            <span className="font-mono text-[9px] text-emerald-400 break-all select-all bg-slate-950 p-1 rounded">
                              {evidenceDetail.constitutional_hash}
                            </span>
                          </div>
                        )}
                        {evidenceDetail.replay_reference && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Replay Ref:</span>
                            <span className="font-mono text-slate-300">{evidenceDetail.replay_reference}</span>
                          </div>
                        )}
                        {evidenceDetail.provenance && (
                          <div className="p-1.5 bg-slate-950/60 rounded border border-slate-850 mt-1 space-y-0.5 text-[9px]">
                            <span className="font-semibold text-slate-400 uppercase tracking-wider block">
                              Provenance Metadata
                            </span>
                            {evidenceDetail.provenance.authority_level && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Authority:</span>
                                <span className="font-mono text-purple-300">{evidenceDetail.provenance.authority_level}</span>
                              </div>
                            )}
                            {evidenceDetail.provenance.governance_role && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Gov Role:</span>
                                <span className="font-mono text-slate-300">{evidenceDetail.provenance.governance_role}</span>
                              </div>
                            )}
                            {evidenceDetail.provenance.system_origin && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Origin:</span>
                                <span className="font-mono text-slate-300">{evidenceDetail.provenance.system_origin}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {evidenceDetail.evidence && Object.keys(evidenceDetail.evidence).length > 0 && (
                          <div className="mt-1 pt-1 border-t border-slate-800">
                            <span className="text-slate-500 text-[9px] block mb-0.5">Evidence Claims:</span>
                            <pre className="font-mono text-[9px] text-slate-300 bg-slate-950 p-1.5 rounded overflow-x-auto max-h-28">
                              {JSON.stringify(evidenceDetail.evidence, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-2">No detail payload returned.</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No evidence bundles in this registry.</p>
            )}
          </div>
        )}

        {subTab === "records" && (
          <div className="space-y-1">
            {executionRecords.length > 0 ? (
              executionRecords.map((rec, idx) => (
                <div
                  key={rec.event_id || idx}
                  className="p-1.5 bg-slate-900/40 rounded border border-slate-800 text-[10px] space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Layers size={10} className="text-purple-400" />
                      Seq #{rec.sequence}: {rec.state}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">{rec.source}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[9px]">
                    <span className="font-mono">
                      {typeof rec.timestamp === "number"
                        ? new Date(rec.timestamp * 1000).toISOString()
                        : formatTime(rec.timestamp)}
                    </span>
                    {rec.execution_id && (
                      <span className="font-mono text-emerald-400">
                        Exec: {rec.execution_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                  {rec.details && Object.keys(rec.details).length > 0 && (
                    <div className="text-[9px] font-mono text-slate-400 bg-slate-950/60 p-1 rounded mt-0.5 break-all">
                      {JSON.stringify(rec.details)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No execution records found.</p>
            )}
          </div>
        )}

        {subTab === "provenance" && (
          <div className="space-y-1.5">
            {provenanceSummary ? (
              <div className="p-2 bg-slate-900/40 rounded border border-slate-800 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Governance Adherence:</span>
                  <span className="font-mono font-bold text-emerald-400 uppercase">
                    {provenanceSummary.governance_adherence}
                  </span>
                </div>
                {provenanceSummary.contributing_systems && (
                  <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-800">
                    <span className="text-slate-500 text-[9px]">Contributing Systems:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {provenanceSummary.contributing_systems.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] border border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {provenanceSummary.consolidated_authority_levels && (
                  <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-800">
                    <span className="text-slate-500 text-[9px]">Authority Levels:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {provenanceSummary.consolidated_authority_levels.map((lvl) => (
                        <span
                          key={lvl}
                          className="px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-300 font-mono text-[9px] border border-purple-700/50"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">No provenance summary available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
