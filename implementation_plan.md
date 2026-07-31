# TANTRA Gated Bridge Integration Plan & Architecture Audit

This document outlines the detailed architecture audit, integration mapping, duplicate detection, authentication strategy, required changes, risks, and final recommendations for integrating the canonical **TANTRA Gated Bridge Runtime** into the **SHAKTI Command Center** dashboard.

---

## 1. Architecture Audit

### Existing API Layer
- **Control Plane Client (`src/api/client.ts`)**: Built using Axios, utilizing `VITE_CONTROL_PLANE_URL` as the base. It intercepts responses to automatically parse and normalize trace identifiers (`x-trace-id`, `traceparent`, `x-request-id`, `x-amzn-trace-id`) into response payload objects.
- **Service Endpoints**:
  - **Control Plane (`src/api/endpoints.ts`)**: Retrieves system status, metrics, executive dashboards, operations, and registries.
  - **Bucket (`src/api/bucketEndpoints.ts`)**: Queries storage metrics, failed audits, and certified append-only artifacts (`/bucket/artifacts`).
  - **InsightFlow (`src/api/insightflowEndpoints.ts`)**: Captures telemetry sync status and stage execution metrics.
  - **PRANA (`src/api/pranaEndpoints.ts`)**: Obtains system health and propagation logs.
  - **NIYANTRAN (`src/api/niyantranEndpoints.ts`)**: Manages attendance records, aims/goals, task lists, and execution logs, including historical `tantra` runs.

### Endpoint Structure
- The dashboard calls REST-based backends for specific dashboard layouts. Most of these services reside on independent hostnames (e.g., `.onrender.com` or local ports) configured via `.env` environment variables.

### React Query Hooks
- Separated logically by service into:
  - `useQueries.ts` (Control Plane)
  - `useBucketQueries.ts` (Bucket Service)
  - `useInsightFlowQueries.ts` (InsightFlow)
  - `usePranaQueries.ts` (PRANA Service)
  - `useNiyantranQueries.ts` (NIYANTRAN Service)

### Runtime Telemetry Architecture
- Telemetry data is queried in `ObservabilityLayout.tsx` which plots latency metrics and event rates, feeding from `/dashboard/telemetry` (Control Plane), `/metrics/query-performance` (Bucket), and `/stage-metrics` (InsightFlow).

### Replay Architecture
- `ReplayLayout.tsx` consumes the `/dashboard/runtime` (Control Plane) endpoint to list active and historic simulation/replay sessions and track their runtime progress.

### Execution Architecture
- `OperationsLayout.tsx` monitors active background pipeline operations via the `/dashboard/operations` endpoint and displays active running nodes.

### Evidence Architecture
- `EvidenceLayout.tsx` displays recent artifacts and logs from the Bucket Service and PRANA propagation log. It contains an **Artifact Viewer** providing three logical steps: **A1 Instruction**, **A2 Blueprint**, and **A3 Execution**.

### Dashboard Layouts & Routing
- Driven by `src/pages/Dashboard.tsx`, rendering a single grid page. Visible zones are configured in `src/config/dashboard.config.ts` and managed by the global `DashboardProvider`. No complex routing exists; layout toggling is driven by configuration visibility fields.

---

## 2. Runtime Overlap & Duplicate Analysis

### Overlapping Endpoints
1. **`GET /health`**: Overlaps with Control Plane's `/health` and `/system/status`. However, every service exposing its own `/health` is valid, and the Control Plane aggregates them.
2. **`/telemetry` (summary, listings, traces)**: Overlaps with InsightFlow telemetry.
3. **`/store` & `/retrieve`**: Overlaps with Bucket Service `/bucket/artifacts`.
4. **`POST /execute` / `POST /run`**: Overlaps with Control Plane operations queue and Niyantran execution history.

### Unique Runtime Data
- **Sarathi Security**: Token generation (`POST /token`) and key checks (`GET /jwks`, `/public-key`).
- **Gated Bridge Actions**: Initiating states (`POST /initiate`), running specific payloads (`POST /run`), and executing bridge steps (`POST /execute`).
- **Local Bridge Archive**: Fetching localized trace executions (`GET /retrieve/{trace_id}/{execution_id}`) directly from the Render instance.

### Endpoints that must NEVER Replace Control Plane
- **`/health`**: The overall orchestrator status must remain the Control Plane's `/system/status`. TANTRA is a single node.
- **`/telemetry`**: System-wide telemetry must remain aggregated through CP's `/dashboard/telemetry`.
- **`/retrieve`**: Global search must remain on the Bucket Service.

### Supplementary Strategy
- **Health**: Add TANTRA as a supplementary component node (`tantra_gated_bridge`) in `RuntimeHealthLayout`.
- **Telemetry**: Plot TANTRA's localized latency/throughput side-by-side with global metrics in `ObservabilityLayout`.
- **Evidence**: Provide a query link in `EvidenceLayout` to retrieve local bridge artifacts when inspecting a bridge execution trace.

---

## 3. Endpoint Classification & Readiness Matrix

All TANTRA endpoints are classified into exactly one of three categories:
- **Category A**: Safe to implement immediately.
- **Category B**: Blocked pending architecture clarification.
- **Category C**: Should never be called directly by SHAKTI.

### Endpoint Matrix

| Endpoint | Category | Classification Reason / Blocker Explanation |
| --- | --- | --- |
| `GET /health` | **Category A** | **Safe**. Confirmed that every service exposes its own health and CP aggregates them. Valid as a supplementary component. |
| `POST /initiate` | **Category B** | **Blocked**. TANTRA initiation generates `trace_id` and `execution_id`. However, the canonical initiator (Control Plane vs NIYANTRAN) remains unresolved. Calling this directly violates execution orchestration bounds. |
| `POST /token` | **Category C** | **Never Call**. Security token exchange secrets cannot reside in the browser environment. Signature is deployment-injected or supplied by auth context. |
| `GET /jwks` | **Category C** | **Never Call**. Server-to-server security verification check; not utilized by dashboard UI. |
| `GET /.well-known/jwks.json` | **Category C** | **Never Call**. Server-to-server security verification check; not utilized by dashboard UI. |
| `GET /public-key` | **Category C** | **Never Call**. Server-to-server security verification check; not utilized by dashboard UI. |
| `POST /execute` | **Category B** | **Blocked**. Requires active `trace_id` and `execution_id` generated during initiation. Blocked until canonical initiator ownership is clarified. |
| `POST /run` | **Category B** | **Blocked**. Execution endpoint. Blocked for the same reason as `/execute` (unresolved initiator ownership contract). |
| `GET /docs.json` | **Category A** | **Safe**. Returns static schema documentation for workloads; read-only utility that does not trigger state transitions. |
| `POST /store` | **Category C** | **Never Call**. Frontend dashboard is strictly observational and must not write telemetry or artifacts directly. |
| `GET /retrieve/{trace_id}/{execution_id}` | **Category B** | **Blocked**. Requires `trace_id` and `execution_id` generated at initiation. Since initiator ownership is unresolved, the contract for how SHAKTI obtains these identifiers to query retrieval is blocked. |
| `POST /api/v1/telemetry` | **Category C** | **Never Call**. Writing telemetry data is a background runner task; frontend must remain observational. |
| `GET /telemetry` | **Category A** | **Safe**. Read-only telemetry displaying supplementary local bridge metrics. |
| `GET /telemetry/{traceId}` | **Category B** | **Blocked**. Requires a `trace_id` originating from the initiator. Blocked until initiator contract is resolved. |
| `GET /telemetry/summary` | **Category A** | **Safe**. Read-only summary metrics endpoint that does not depend on individual trace identifiers. |

---

## 4. Authentication Strategy

- **JWT Infrastructure**: No active frontend infrastructure exists for RS256/EdDSA JWTs. The current mock client has simple RBAC, and NIYANTRAN uses a pre-generated HS256 token.
- **Bridge Signature Storage**:
  - The JWT signature (`bridge_signature`) must be stored in `.env` as `VITE_TANTRA_BRIDGE_SIGNATURE` for build-time injection.
  - At runtime, it will be loaded into memory and fallback to `localStorage.getItem("x-bridge-signature")` to allow operators to override it.
- **Environment Variables**:
  - `VITE_TANTRA_BASE_URL="https://tantra-gated-bridge-infrastructure.onrender.com"`
  - `VITE_TANTRA_BRIDGE_SIGNATURE=""`
- **Dynamic Token vs Deployment Injection**:
  - **Recommended Approach**: Deployment injection of the JWT signature (via the env variable). Browser clients cannot securely hold credentials required for dynamic Sarathi `/token` exchanges without exposing secrets to users.
  - **Dynamic Token Handling**: If an OAuth authorization code flow or browser token session is provided, the token should be updated dynamically in `localStorage`. Otherwise, the static token injected during deployment is preferred.

---

## 5. Implementation Status of Key Modules

Based on the confirmed TANTRA contracts, the readiness of each primary dashboard module is evaluated below:

### 1. RuntimeHealth Integration: **READY**
- **Status**: Safe to implement.
- **Validation**: Every runtime service exposes its own `/health`, and TANTRA `GET /health` acts as a valid supplementary node inside `RuntimeHealthLayout`.

### 2. Operations Capability Card: **READY (Observation Only)**
- **Status**: Safe to implement.
- **Validation**: The capability card can render status and metrics from `GET /health` and `/telemetry/summary`. However, execution actions (Initiate, Run, Execute triggers) remain blocked and hidden from the interface.

### 3. Observability Telemetry: **READY (Aggregate Only)**
- **Status**: Safe to implement for aggregates.
- **Validation**: Displaying TANTRA node performance metrics via `GET /telemetry` and `GET /telemetry/summary` is safe. Trace-level queries (`GET /telemetry/{traceId}`) remain blocked.

### 4. Evidence Retrieval: **BLOCKED**
- **Status**: Blocked.
- **Validation**: Retrieval (`GET /retrieve/{trace_id}/{execution_id}`) requires trace and execution identifiers generated during initiation. Because the initiator ownership contract (Control Plane vs NIYANTRAN) is unresolved, SHAKTI cannot reliably obtain these identifiers to pass to the retrieval client.

---

## 6. Target Files for Safe Scope (Phase 4 Implementation)

The following files are mapped for modification to implement the safe scope:
1. **`src/types/tantra.ts` [NEW]**: Telemetry and health structures.
2. **`src/api/tantraEndpoints.ts` [NEW]**: Queries for health, telemetry, and docs.
3. **`src/hooks/useTantraQueries.ts` [NEW]**: Query hooks for health and telemetry.
4. **`src/components/dashboard/layouts/RuntimeHealthLayout.tsx` [MODIFY]**: Health list injection.
5. **`src/components/dashboard/layouts/OperationsLayout.tsx` [MODIFY]**: Capability registry card.
6. **`src/components/dashboard/layouts/ObservabilityLayout.tsx` [MODIFY]**: Telemetry chart injection.
