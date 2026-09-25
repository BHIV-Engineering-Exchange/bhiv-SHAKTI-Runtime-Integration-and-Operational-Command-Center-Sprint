/**
 * Canonical integration contract types for Sovereign Core / RAJYA.
 * Service: Sovereign Core / RAJYA (Rajaryan Verma)
 * Live deployment: http://163.128.209.18:8015
 *
 * SHAKTI / Niyantran Kendra is strictly observational and read-only.
 * All identifiers and payloads are consumed directly without fabrication or modification.
 */

export type ExecutionStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CRASHED";

export type DgicState =
  | "KNOWN"
  | "INFERRED"
  | "AMBIGUOUS"
  | "UNKNOWN";

export type RajyaVerdict =
  | "EXECUTION_APPROVED"
  | "DENY"
  | "PENDING";

export type SarathiStatus =
  | "VALID"
  | "PENDING";

export type CoreStatus =
  | "ALLOW"
  | "DENY"
  | "ABSTAIN"
  | "PENDING";

export interface SovereignExecutionTrace {
  execution_id: string;
  execution_status: ExecutionStatus;
  dgic_state: DgicState;
  risk_score: number | null;
  confidence: number;
  rajya_verdict: RajyaVerdict;
  sarathi_status: SarathiStatus;
  core_status: CoreStatus;
  bucket_persistence: boolean;
  failure_reason: string | null;
  trace_hash: string;
}

export type SovereignBucketEntry = Record<string, unknown>;

export interface RajyaHealthResponse {
  status: string;
  service?: string;
}
