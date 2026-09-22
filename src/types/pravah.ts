/**
 * Pravah Types — Strictly Read-Only Observational Models
 *
 * Canonical contracts verified from Pravah repository (agent_api.py):
 * - GET /registry/trace/{trace_id}
 * - GET /evidence/{evidence_ref}
 * Header: X-Source-System: SHAKTI
 */

export interface PravahTraceRegistryResponse {
  trace_id: string;
  execution_records?: Array<Record<string, unknown>>;
  replay_index_entry?: Record<string, unknown>;
  evidence_bundles?: Array<Record<string, unknown>>;
  provenance_summary?: Record<string, unknown>;
  status?: string;
  error?: string;
}

export interface PravahEvidenceBundleResponse {
  evidence_ref: string;
  trace_id?: string;
  execution_id?: string;
  correlation_id?: string;
  decision_id?: string;
  authority_chain?: Array<Record<string, unknown>>;
  evidence?: Record<string, unknown>;
  produced_at?: string;
  published_at?: string;
  error?: string;
}
