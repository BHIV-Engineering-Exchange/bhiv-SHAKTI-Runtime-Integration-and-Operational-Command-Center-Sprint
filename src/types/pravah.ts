/**
 * Pravah Types — Strictly Read-Only Observational Models
 *
 * Canonical contracts verified from Pravah repository (agent_api.py):
 * - GET /registry/trace/{trace_id}
 * - GET /evidence/{evidence_ref}
 * Header: X-Source-System: SHAKTI
 */

export interface PravahExecutionRecord {
  execution_id: string;
  sequence: number;
  event_id: string;
  state: string;
  timestamp: number | string;
  source: string;
  details?: {
    trace_id?: string;
    action?: string;
    provenance?: {
      system_origin?: string;
      authority_level?: string;
    };
    [key: string]: unknown;
  };
}

export interface PravahEvidenceBundleProvenance {
  authority_level?: string;
  governance_role?: string;
  system_origin?: string;
  operator_hash?: string;
  ingested_at?: string;
  environment?: string;
  [key: string]: unknown;
}

export interface PravahEvidenceBundle {
  bundle_id: string;
  trace_id: string;
  execution_id: string;
  decision_id: string;
  decision_type?: string;
  authority_chain?: Array<Record<string, unknown>>;
  evidence?: Record<string, unknown>;
  produced_at?: string;
  correlation_id?: string;
  source?: string;
  action?: string;
  evidence_ref: string;
  provenance?: PravahEvidenceBundleProvenance;
}

export interface PravahProvenanceSummary {
  contributing_systems: string[];
  consolidated_authority_levels: string[];
  governance_adherence: string;
  [key: string]: unknown;
}

export interface PravahTraceRegistryResponse {
  trace_id: string;
  execution_records?: PravahExecutionRecord[];
  replay_index_entry?: Record<string, unknown>;
  evidence_bundles?: PravahEvidenceBundle[];
  provenance_summary?: PravahProvenanceSummary;
  status?: string;
  error?: string;
}

export interface PravahEvidenceBundleResponse {
  bundle_id?: string;
  trace_id?: string;
  execution_id?: string;
  decision_id?: string;
  decision_type?: string;
  authority_chain?: Array<Record<string, unknown>>;
  evidence?: Record<string, unknown>;
  replay_reference?: string;
  constitutional_hash?: string;
  produced_at?: string;
  published_at?: string;
  correlation_id?: string;
  source?: string;
  action?: string;
  evidence_ref: string;
  provenance?: PravahEvidenceBundleProvenance;
  error?: string;
}
