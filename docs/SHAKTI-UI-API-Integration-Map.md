# SHAKTI UI/API Integration Map

## 1. Document Status

* **Document Type**: Authoritative Integration & Routing Specification
* **Certified Release**: `ee77c3a3d12f46ec8013a2e5230a6b7d53824f90`
* **Release Branch**: `main`
* **Verification Date**: 2026-09-16
* **Repository**: `shakti-command-center`
* **Target Production Domain**: `https://niyantrankendra.blackholeinfiverse.com`
* **Authoritative Evidence Reference**: `docs/SHAKTI-Production-Certification-Report.md`

---

## 2. High-Level Data Flow

The SHAKTI Command Center functions as an operational presentation, observation, and workflow coordination layer within the BHIV/TANTRA ecosystem. It connects to external services exclusively through established HTTP/REST contracts and proxy paths.

```
Operator / Browser
       │
       ▼
SHAKTI Command Center UI (React 19 / TypeScript / Vite)
       │
       ▼
SHAKTI API Integration Layer (src/api/* Clients & Query Hooks)
       │
       ▼
Production Reverse Proxy / Host Routing Layer (Nginx & Proxies)
       ├── /api/control-plane/*  ──►  Control Plane Service (163.128.209.18:8120)
       ├── /api/bucket/*         ──►  BUCKET Storage Engine (163.128.209.18:8012)
       ├── /api/prana/*          ──►  PRANA Event Propagation (163.128.209.18:8103)
       ├── /api/tantra/*         ──►  TANTRA Gated Bridge (163.128.209.18:3009)
       ├── /api/rajya/*          ──►  RAJYA Risk Service (163.128.209.18:8015)
       ├── /api/sanskar/*        ──►  SANSKAR Decision Engine (163.128.209.18:8018)
       ├── /api/insightflow/*    ──►  InsightFlow Pipeline (163.128.209.18:8122)
       ├── /api/karma/*          ──►  KARMA Ledger & Intelligence (163.128.209.18:8102)
       ├── /api/keshav/*         ──►  KESHAV Ingestion Telemetry (163.128.209.18:5003)
       ├── /api/setu/*           ──►  SETU Project Bridge (163.128.209.18:8014)
       └── /api/niyantran/*      ──►  Niyantran Engine (https://niyantran.blackholeinfiverse.com)
       │
       ▼
Existing BHIV / TANTRA Services (Authoritative External Infrastructure)
       │
       ▼
Telemetry, State Normalization & Evidence Payloads
       │
       ▼
SHAKTI UI Operational Surfaces (8 Certified Surfaces with ErrorBoundaries)
```

---

## 3. Service Integration Matrix

The following matrix documents every verified service integrated with the SHAKTI Command Center:

| Service | SHAKTI Route | Endpoint Examples | HTTP Method | UI Consumer | Purpose | Auth Boundary | Ownership | Production Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **Control Plane** | `/api/control-plane` | `/system/status`<br>`/metrics`<br>`/dashboard/operations`<br>`/dashboard/alerts`<br>`/dashboard/runtime`<br>`/dashboard/telemetry` | `GET` | `RuntimeHealthLayout`<br>`OperationsLayout`<br>`ObservabilityLayout`<br>`IntegrationLayout` | Cluster status, process health, active runtime sessions, and aggregate metrics. | Public dashboard access | Core Control Plane Team | **VERIFIED (200 OK)** |
| **BUCKET** | `/api/bucket` | `/health`<br>`/bucket/artifacts`<br>`/bucket/storage-stats`<br>`/bucket/chain-state`<br>`/metrics/alerts`<br>`/metrics/query-performance`<br>`/metrics/scale-status`<br>`/constitutional/status` | `GET` | `EvidenceLayout`<br>`ObservabilityLayout`<br>`RuntimeHealthLayout` | Append-only artifact verification, storage compression, blockchain chain state, and query performance. | Public dashboard access | BUCKET Service Team | **VERIFIED (200 OK)** |
| **PRANA** | `/api/prana` | `/health`<br>`/prana/system/health`<br>`/prana/propagation-log` | `GET` | `ObservabilityLayout`<br>`EvidenceLayout`<br>`RuntimeHealthLayout` | Lifecycle event propagation logs, distributed state propagation tracking, and system health. | Public dashboard access | PRANA Service Team | **VERIFIED (200 OK)** |
| **TANTRA** | `/api/tantra` | `/health`<br>`/telemetry`<br>`/telemetry/summary` | `GET` | `ObservabilityLayout`<br>`RuntimeHealthLayout`<br>`OperationsLayout` | Execution bridge telemetry, latency distributions, event rates, and summary health. | Header support: `Authorization: Bearer <sig>` and `x-bridge-signature` | TANTRA Team | **VERIFIED (200 OK)** |
| **RAJYA** | `/api/rajya` | `/health` | `GET` | `RuntimeHealthLayout`<br>`IntegrationLayout` | Governance rule health, risk scoring runtime status. | Public dashboard access | RAJYA Service Team | **VERIFIED (200 OK)** |
| **SANSKAR** | `/api/sanskar` | `/health`<br>`/ranking`<br>`/trace/{id}` | `GET` | `DecisionIntelligenceLayout`<br>`EvidenceLayout`<br>`RuntimeHealthLayout` | Decision trace evaluation, entity rankings, and governance evaluation. | Public dashboard access | SANSKAR Team | **PARTIAL**<br>(Health: 200 OK; Ranking/Trace: 404 documented limitation) |
| **InsightFlow** | `/api/insightflow` | `/health`<br>`/stage-metrics`<br>`/bucket/status` | `GET` | `ObservabilityLayout`<br>`RuntimeHealthLayout` | Pipeline sync telemetry, stage duration metrics, and storage sync status. | Public dashboard access | InsightFlow Team | **PARTIAL**<br>(Health: 200 OK; Stage-metrics/Bucket: 404 documented limitation) |
| **KARMA** | `/api/karma` | `/health`<br>`/karma/latest-hash`<br>`/intelligence/lineage`<br>`/intelligence/lineage/{id}/ancestry`<br>`/intelligence/confidence/{id}`<br>`/intelligence/reasoning/{id}`<br>`/api/v1/analytics/metrics/live`<br>`/api/v1/analytics/karma_trends`<br>`/api/v1/analytics/charts/dharma_seva_flow`<br>`/api/v1/analytics/charts/paap_punya_ratio` | `GET`<br>`POST` (Confidence & Reasoning) | `DecisionIntelligenceLayout`<br>`EvidenceLayout`<br>`RuntimeHealthLayout`<br>`OperationsLayout` | Canonical decision intelligence evaluation, lineage DAG, cryptographically verifiable ledger hashes, and analytics charts. | Public dashboard access; Confidence and Reasoning require trajectory-gated JSON payload | KARMA Team | **VERIFIED (200 OK)** |
| **KESHAV** | `/api/keshav` | `/health`<br>`/metrics/json` | `GET` | `ObservabilityLayout`<br>`RuntimeHealthLayout` | Ingestion metrics, HTTP throughput, and latency percentiles. | Public dashboard access | KESHAV Team | **VERIFIED (200 OK)**<br>(Fail-closed contract enforced) |
| **SETU** | `/api/setu` | `/health`<br>`/projects`<br>`/projects/{id}`<br>`/projects/{id}/milestones`<br>`/tasks/{id}`<br>`/tasks/{id}/assignments` | `GET` | `OperationsLayout`<br>`RuntimeHealthLayout` | Engineering project tracking, cross-milestone progress, and delivery task mapping. | Public dashboard access | SETU Team | **VERIFIED (200 OK)** |
| **Niyantran** | `/api/niyantran` or direct HTTPS | `/api/dashboard/stats`<br>`/api/dashboard/leaderboard`<br>`/api/dashboard/departments`<br>`/api/aims`<br>`/api/aims/with-progress`<br>`/api/tasks`<br>`/api/submissions`<br>`/api/dashboard/merge-analysis`<br>`/api/dashboard/attendance-summary` | `GET` | `OperationsLayout`<br>`WorkflowLayout`<br>`DeliveryIntelligenceLayout`<br>`EmployeeExecutionLayout`<br>`EngineeringCapacityLayout` | Public task metrics, engineer leaderboard, sprint goals (AIMS), and attendance analysis. | **Split Boundary**: `/dashboard/stats` and `/leaderboard` are public. Operational/AIMS/attendance routes require `x-auth-token`. | Niyantran Team | **VERIFIED (200 OK public; 401 protected documented boundary)** |

*(Note on Reverse Proxy Prefix Stripping: All `/api/<service>/*` proxy routes strip the `/api/<service>` prefix before forwarding requests upstream. For example, a client request to `GET /api/setu/health` or `GET /api/setu/projects` is forwarded upstream as `GET /health` or `GET /projects` to SETU (`163.128.209.18:8014`). Canonical frontend paths consistently use `GET /api/setu/health`, `GET /api/setu/projects`, `GET /api/setu/projects/{id}`, and `GET /api/setu/projects/{id}/milestones`.)*

---

## 4. Frontend API Modules

SHAKTI structures its API communication through dedicated TypeScript modules located in `src/api/`:

### 1. `src/api/client.ts`
* **Responsibility**: Base Axios instance (`apiClient`) configured with `VITE_CONTROL_PLANE_URL` (defaults to `/api/control-plane`).
* **Interceptors**: Automatically captures distributed tracing headers (`x-trace-id`, `traceparent`, `x-request-id`, `x-amzn-trace-id`) and injects them into response payloads.
* **Error Handling**: Normalizes network timeouts, 404s, and 503s with structured logging via `src/utils/logger.ts`.

### 2. `src/api/endpoints.ts`
* **Responsibility**: High-level cluster queries against Control Plane.
* **Exported Functions**: `fetchHealth()`, `fetchSystemStatus()`, `fetchMetrics()`, `fetchOperationsDashboard()`, `fetchAlertsDashboard()`, `fetchRuntimeDashboard()`, `fetchTelemetryDashboard()`, `fetchDeliveryIntelligence()`.
* **BHEX Placeholders**: Provides placeholder implementations for `fetchRepositoryRegistry()`, `fetchBuildRegistry()`, `fetchMigrationQueue()`, `fetchReviewQueue()`, and `fetchCapabilityRegistry()`. These isolate UI layouts from unreleased backend registry services.
* **Consumers**: `RuntimeHealthLayout`, `OperationsLayout`, `ObservabilityLayout`, `IntegrationLayout`.

### 3. `src/api/bucketEndpoints.ts`
* **Responsibility**: Direct interface to BUCKET storage engine via `bucketClient` (`/api/bucket`).
* **Exported Functions**: `fetchBucketArtifacts()`, `fetchBucketStorageStats()`, `fetchBucketChainState()`, `fetchBucketHealth()`, `fetchAuditRecent()`, `fetchMetricsScaleStatus()`, `fetchMetricsQueryPerformance()`, `fetchMetricsAlerts()`, `fetchConstitutionalStatus()`.
* **Consumers**: `EvidenceLayout`, `ObservabilityLayout`, `RuntimeHealthLayout`.

### 4. `src/api/pranaEndpoints.ts`
* **Responsibility**: Event propagation monitoring via `pranaClient` (`/api/prana`).
* **Exported Functions**: `fetchPranaHealth()`, `fetchPranaSystemHealth()`, `fetchPranaPropagationLog()`.
* **Consumers**: `ObservabilityLayout`, `EvidenceLayout`, `RuntimeHealthLayout`.

### 5. `src/api/tantraEndpoints.ts`
* **Responsibility**: Execution telemetry and security gateway interaction via `tantraClient` (`/api/tantra`).
* **Request Interceptor**: Extracts optional bridge signature from `localStorage.getItem("x-bridge-signature")` or build environment `VITE_TANTRA_BRIDGE_SIGNATURE`, injecting standard `Authorization: Bearer <sig>` and `x-bridge-signature` headers.
* **Exported Functions**: `fetchTantraHealth()`, `fetchTantraTelemetry()`, `fetchTantraTelemetrySummary()`.
* **Consumers**: `ObservabilityLayout`, `RuntimeHealthLayout`, `OperationsLayout`.

### 6. `src/api/rajyaEndpoints.ts`
* **Responsibility**: Governance risk evaluation health checks via `rajyaClient` (`/api/rajya`).
* **Exported Functions**: `fetchRajyaHealth()`.
* **Consumers**: `RuntimeHealthLayout`, `IntegrationLayout`.

### 7. `src/api/sanskarEndpoints.ts`
* **Responsibility**: SANSKAR decision intelligence queries via `sanskarClient` (`/api/sanskar`).
* **Exported Functions**: `getHealth()`, `getRanking()`, `getTrace(traceId)`.
* **Fallback Behavior**: Resilient `try/catch` in `getRanking()` catches 404 responses from unreleased backend routes and returns safe empty structures (`{ ranking: [], entities: [] }`), preventing UI failure.
* **Consumers**: `DecisionIntelligenceLayout`, `EvidenceLayout`, `RuntimeHealthLayout`.

### 8. `src/api/insightflowEndpoints.ts`
* **Responsibility**: Pipeline synchronization and stage metrics via `insightflowClient` (`/api/insightflow`).
* **Exported Functions**: `fetchInsightFlowHealth()`, `fetchInsightFlowStageMetrics()`, `fetchInsightFlowBucketStatus()`.
* **Fallback Behavior**: `fetchInsightFlowStageMetrics()` and `fetchInsightFlowBucketStatus()` safely catch 404s and return empty metrics arrays or default zero-sync structures.
* **Consumers**: `ObservabilityLayout`, `RuntimeHealthLayout`.

### 9. `src/api/karmaEndpoints.ts`
* **Responsibility**: Canonical KARMA Decision Intelligence evaluation, lineage graphs, and analytics via `karmaClient` (`/api/karma`).
* **Exported Functions**: `fetchKarmaHealth()`, `fetchKarmaLatestHash()`, `fetchKarmaLineage()`, `fetchKarmaAncestry()`, `fetchKarmaConfidence()`, `fetchKarmaReasoning()`, `fetchKarmaLiveMetrics()`, `fetchKarmaTrends()`, `fetchKarmaDharmaSevaFlow()`, `fetchKarmaPaapPunyaRatio()`.
* **Live Contract**: Explicitly verifies the canonical `POST` contract for `/intelligence/confidence/{id}` and `/intelligence/reasoning/{id}`, transmitting structured JSON bodies with `behavior_score`, `aggregated_feedback`, `purushartha_alignment`, and `schema_version`.
* **Consumers**: `DecisionIntelligenceLayout`, `EvidenceLayout`, `RuntimeHealthLayout`, `OperationsLayout`.

### 10. `src/api/keshavEndpoints.ts`
* **Responsibility**: Ingestion telemetry via `keshavClient` (`/api/keshav`).
* **Exported Functions**: `getHealth()`, `getMetricsJson()`.
* **Fail-Closed Contract**: Enforces strict fail-closed telemetry (`014f8052`). Synthetic or mocked metric fallbacks were permanently removed; errors bubble cleanly to React Query and render as degraded/offline states.
* **Consumers**: `ObservabilityLayout`, `RuntimeHealthLayout`.

### 11. `src/api/setuEndpoints.ts`
* **Responsibility**: Engineering project and milestone tracking via `setuClient` (`/api/setu`).
* **Path Normalization**: Uses `/api/setu/*` base paths to prevent static SPA 405 Method Not Allowed preflight errors (`18b221e8`).
* **Exported Functions**: `getHealth()`, `getProjects()`, `getProject()`, `getProjectMilestones()`, `getTask()`, `getTaskAssignments()`.
* **Consumers**: `OperationsLayout`, `RuntimeHealthLayout`.

### 12. `src/api/niyantranEndpoints.ts`
* **Responsibility**: Operational sprint tracking, developer capacity, and biometric merge analysis via `niyantranClient` (`/api/niyantran` or direct HTTPS).
* **Token Loading**: Dynamically loads session tokens from `localStorage.getItem("WorkflowToken")` at runtime and attaches `x-auth-token` (`b0b66751`). Static build tokens were eliminated.
* **Execution Key**: Injects `x-execution-key` from `VITE_NIYANTRAN_EXECUTION_KEY`.
* **Exported Functions**: `fetchNiyantranStats()`, `fetchNiyantranTasksOverview()`, `fetchNiyantranDepartments()`, `fetchNiyantranLeaderboard()`, `fetchNiyantranAttendanceSummary()`, `fetchNiyantranMergeAnalysis()`, `fetchNiyantranExecutionHistory()`, `fetchNiyantranAims()`, `fetchNiyantranEnhancedAims()`, `fetchNiyantranAlerts()`, `fetchNiyantranSubmissions()`, `fetchNiyantranTasks()`, `fetchNiyantranLiveLocations()`, `fetchEmployeeExecution()`, `fetchEngineeringCapacity()`.
* **Consumers**: `OperationsLayout`, `WorkflowLayout`, `DeliveryIntelligenceLayout`, `EmployeeExecutionLayout`, `EngineeringCapacityLayout`.

---

## 5. Authentication Boundaries

The SHAKTI Command Center maintains a strict boundary between public operational views and protected enterprise features:

```
+─────────────────────────────────────────────────────────────────────────────+
|                         SHAKTI COMMAND CENTER UI                            |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
+──────────────────────────────+             +────────────────────────────────+
|   PUBLIC OPERATIONAL TIER    |             |   PROTECTED OPERATIONAL TIER   |
+──────────────────────────────+             +────────────────────────────────+
| No user token required       |             | Requires operator session      |
| • Control Plane status       |             | • Niyantran AIMS (/api/aims)   |
| • BUCKET artifacts & stats   |             | • Task assignments (/api/tasks)|
| • PRANA propagation logs     |             | • Attendance Merge Analysis    |
| • TANTRA live telemetry      |             | • Employee execution details   |
| • KARMA lineage & hashes     |             +────────────────────────────────+
| • SETU projects & milestones |                            │
| • KESHAV ingestion metrics   |                            ▼
| • Niyantran stats/leaderboard|             Token: localStorage.WorkflowToken
+──────────────────────────────+             Header: x-auth-token
```

### Verified Authentication Behaviors:
1. **Public Dashboard Mode**: When loaded in an unauthenticated browser session, all public tier endpoints return `HTTP 200 OK`. The eight core dashboard surfaces render without blocking.
2. **Protected Routes (Niyantran)**: Endpoints requiring operator privileges (`/api/aims`, `/api/aims/with-progress`, `/api/tasks`, `/api/dashboard/merge-analysis`, `/api/dashboard/attendance-summary`) return `HTTP 401 Unauthorized`.
3. **Graceful UI Handling**: Try/catch handlers in `src/api/niyantranEndpoints.ts` intercept 401 errors and return empty fallback models. Protected sub-sections display empty or waiting states without crashing the surrounding operational layouts.
4. **Execution Key**: Where required by backend gateways, `x-execution-key` is injected at the network layer. Secret values are injected during CI/CD image build or deployment and are never committed to source code.
5. **Bridge Signature**: `x-bridge-signature` and `Authorization: Bearer <sig>` are attached by `src/api/tantraEndpoints.ts` from runtime storage or build-time arguments.

---

## 6. Health and Failure Propagation

### Status Normalization Model (`src/utils/healthStatus.ts`)
Disparate backend microservices emit differing status strings (`online`, `healthy`, `UP`, `active`, `OK`, `warning`, `degraded`, `failed`, `DOWN`). To prevent false positives where impaired services appear fully green, SHAKTI strictly normalizes all health states into a canonical three-state model:

```typescript
export type NormalizedComponentStatus = "operational" | "degraded" | "offline";
```

* **`operational`**: Assigned strictly when raw status is `healthy`, `operational`, `ok`, or `online`, and network queries succeeded.
* **`degraded`**: Assigned when raw status is `degraded` or `warning`, during active queries (`isLoading`), or when status values are missing/unrecognized.
* **`offline`**: Assigned when transport fails (`isError`) or raw status indicates failure (`offline`, `unhealthy`, `failed`, `error`, `crash_looping`, `down`).

The behavior of this normalization is verified by 27 unit tests in `src/test/health-mapping.test.tsx`.

### Fail-Closed Telemetry (`src/api/keshavEndpoints.ts`)
In commit `014f8052`, mock/synthetic fallbacks were removed from `keshavEndpoints.ts`. If the KESHAV service is unreachable, the client throws a transport error rather than masking downtime with synthetic data.

### ErrorBoundary Isolation (`src/components/ErrorBoundary.tsx`)
Each of the 8 core operational surfaces is wrapped in an isolated React `ErrorBoundary`. A fatal JavaScript rendering error inside a single component displays a localized retry banner (`text="[Surface] Crashed"`) while allowing the remaining 7 layouts to run uninterrupted.

---

## 7. Known Integration Gaps

The following non-2xx responses are documented operational boundaries and do not constitute SHAKTI application defects:

1. **SANSKAR Secondary Routes**:
   * Endpoints: `GET /api/sanskar/ranking` and `GET /api/sanskar/trace/{id}` return `HTTP 404 Not Found`.
   * Root Cause: Secondary route implementations are pending registration in the upstream SANSKAR microservice.
   * Frontend Fallback: SANSKAR health check returns `200 OK`. In `DecisionIntelligenceLayout.tsx`, decision items derive from Control Plane operations. In `EvidenceLayout.tsx`, SANSKAR sub-panels are conditionally omitted while core BUCKET and PRANA evidence displays normally.

2. **InsightFlow Secondary Routes**:
   * Endpoints: `GET /api/insightflow/stage-metrics` and `GET /api/insightflow/bucket/status` return `HTTP 404 Not Found`.
   * Root Cause: Secondary stage metric endpoints are pending backend release.
   * Frontend Fallback: InsightFlow health check returns `200 OK`. In `ObservabilityLayout.tsx`, telemetry charting is populated by live data from PRANA logs (`200 OK`), BUCKET metrics (`200 OK`), and TANTRA telemetry (`200 OK`).

3. **Niyantran Protected Routes**:
   * Endpoints: Protected routes (`/api/aims`, `/api/tasks`, `/api/dashboard/merge-analysis`, `/api/dashboard/attendance-summary`) return `HTTP 401 Unauthorized` without an operator session.
   * Root Cause: Expected authentication-boundary enforcement.
   * Frontend Fallback: Niyantran public statistics (`/api/dashboard/stats`) and leaderboard (`/api/dashboard/leaderboard`) return `200 OK`. Protected panels fall back to safe empty states.

---

## 8. Ownership Boundaries

SHAKTI maintains strict architectural separation from external services:

* **SHAKTI Owns**:
  * Command Center presentation layer and component tree.
  * API client modules (`src/api/*`), header injection, and response normalization.
  * Status mapping and multi-service health aggregation.
  * UI state management via React Query.
  * Client bundle compilation and production container packaging.
  * Production live E2E certification suite.

* **Upstream Teams Authoritatively Own**:
  * **SANSKAR**: Ranking algorithms, scoring models, and backend route registrations (`/ranking`, `/trace/*`).
  * **InsightFlow**: Pipeline queue orchestration, write-synchronization engines, and metric endpoint implementations.
  * **Niyantran**: Operator identity management, JWT signing, HR/attendance database, and RBAC middleware.
  * **TANTRA**: Gated bridge execution engine, Sarathi token validation, and internal consensus ledger.
  * **BUCKET**: Append-only storage clustering, cryptographic chain state, and database replication.
  * **PRANA**: Distributed event propagation forwarders.
  * **KESHAV**: Telemetry ingestion daemon and raw metric aggregation.
  * **SETU**: Cross-repository bridge synchronization and task database.
  * **DevOps / Infrastructure**: VM host maintenance, host-level Nginx configuration, TLS certificates, firewall rules, and DNS routing.

---

## 9. Traceability and Observability

Cross-service request tracing is supported across the SHAKTI API client layer:

* **Trace Header Extraction**: In `src/api/client.ts`, `src/api/tantraEndpoints.ts`, `src/api/rajyaEndpoints.ts`, `src/api/sanskarEndpoints.ts`, `src/api/insightflowEndpoints.ts`, and `src/api/niyantranEndpoints.ts`, response interceptors extract:
  * `x-trace-id`
  * `x-execution-id`
  * `traceparent`
  * `x-request-id`
  * `x-amzn-trace-id`
* **Payload Injection**: Extracted IDs are attached directly to payload objects as `trace_id` for display in `EvidenceLayout` and `ObservabilityLayout`.
* **Lineage Tracking**: KARMA lineage endpoint (`/intelligence/lineage`) provides direct Directed Acyclic Graph (DAG) node and edge relationships for event ancestry tracing.
* **Deterministic Hashing**: KARMA confidence responses supply a `deterministic_hash`, verified end-to-end in `DecisionIntelligenceLayout`.

---

## 10. Verification References

The integration layer was verified against repository source code and live production infrastructure:

* **Health Normalization**: `src/utils/healthStatus.ts`
* **Health Mapping Unit Tests**: `src/test/health-mapping.test.tsx` (27/27 passed)
* **KESHAV Fail-Closed Tests**: `src/test/keshavEndpoints.test.tsx` (passed)
* **KARMA Contract Tests**: `src/test/integration.test.tsx` (passed)
* **Live Production E2E Suite**: `src/test/e2e/production-live.spec.ts` (4/4 passed)
* **Authoritative Production Certification Report**: `docs/SHAKTI-Production-Certification-Report.md`
