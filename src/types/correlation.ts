/**
 * Runtime Correlation Identifiers
 *
 * Implements strict separation of constitutional runtime identifiers:
 * tenant_id !== request_id !== trace_id !== execution_id !== decision_id !== policy_id
 *
 * SHAKTI is strictly an observational consumer and NEVER generates these identifiers.
 */

export interface RuntimeCorrelation {
  tenant_id: string | null;
  request_id: string | null;
  trace_id: string | null;
  execution_id: string | null;
  decision_id: string | null;
  policy_id: string | null;
}
