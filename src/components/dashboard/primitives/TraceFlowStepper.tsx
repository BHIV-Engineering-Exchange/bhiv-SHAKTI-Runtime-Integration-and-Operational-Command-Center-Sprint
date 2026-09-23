import { memo } from "react";
import { Eye, Server, Shield, FileCheck, Layers } from "lucide-react";

export type FlowStep = "setu" | "niyantran" | "pravah_registry" | "pravah_evidence";

interface TraceFlowStepperProps {
  activeStep: FlowStep;
  onSelectStep: (step: FlowStep) => void;
  hasTraceId: boolean;
  hasExecutionId: boolean;
  hasEvidenceRef: boolean;
  hasTenantId: boolean;
}

export const TraceFlowStepper = memo(function TraceFlowStepper({
  activeStep,
  onSelectStep,
  hasTraceId,
  hasExecutionId,
  hasEvidenceRef,
  hasTenantId,
}: TraceFlowStepperProps) {
  const steps: Array<{
    id: FlowStep;
    label: string;
    system: "SETU" | "NIYANTRAN" | "PRAVAH";
    systemBadge: string;
    icon: React.ElementType;
    isAvailable: boolean;
    hint: string;
  }> = [
    {
      id: "setu",
      label: "Observation",
      system: "SETU",
      systemBadge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      icon: Eye,
      isAvailable: hasTraceId,
      hint: hasTraceId ? "Trace telemetry & timeline" : "Requires trace_id",
    },
    {
      id: "niyantran",
      label: "Execution History",
      system: "NIYANTRAN",
      systemBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: Server,
      isAvailable: hasExecutionId && hasTenantId,
      hint: !hasExecutionId
        ? "Awaiting execution_id"
        : !hasTenantId
        ? "Blocked: tenant context required"
        : "Lineage, session & events",
    },
    {
      id: "pravah_registry",
      label: "Registry & Provenance",
      system: "PRAVAH",
      systemBadge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      icon: Layers,
      isAvailable: hasTraceId,
      hint: hasTraceId ? "Execution records & bundle index" : "Requires trace_id",
    },
    {
      id: "pravah_evidence",
      label: "Evidence Bundle",
      system: "PRAVAH",
      systemBadge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      icon: Shield,
      isAvailable: hasEvidenceRef,
      hint: hasEvidenceRef ? "Attestation & authority chain" : "Awaiting evidence_ref",
    },
  ];

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 rounded border border-slate-800/80 mb-2">
      <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
        <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <FileCheck size={11} className="text-cyan-400" />
          Ecosystem Trace Flow
        </span>
        <span className="font-mono text-[9px] text-slate-500">
          TRACE &rarr; SETU &rarr; NIYANTRAN &rarr; PRAVAH
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isSelected = activeStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`flex flex-col text-left p-1.5 rounded transition-all border ${
                isSelected
                  ? "bg-slate-800 border-indigo-500/80 shadow-sm"
                  : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-850 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className={`text-[8px] font-bold px-1 py-0.2 rounded border font-mono ${step.systemBadge}`}
                >
                  {step.system}
                </span>
                <span className="text-[9px] font-mono text-slate-500">0{idx + 1}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-200 truncate">
                <StepIcon
                  size={12}
                  className={isSelected ? "text-indigo-400 shrink-0" : "text-slate-400 shrink-0"}
                />
                <span className="truncate">{step.label}</span>
              </div>

              <span className="text-[9px] text-slate-500 truncate mt-0.5" title={step.hint}>
                {step.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
