# Production Runtime Integration Audit

This document contains a comprehensive read-only audit of the SHAKTI Command Center repository. It outlines all active and pending integrations, API clients, environment variables, layouts, and error-handling behaviors.

---

## 1. Integrated Backend & Runtime Services

The SHAKTI frontend communicates with **11 distinct backend/runtime services** using dedicated Axios client configurations under `src/api/`:

| Service | Client File | Environment Variable | Timeout | Key Purpose |
|---|---|---|---|---|
| **Control Plane** | [client.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/client.ts) | `VITE_CONTROL_PLANE_URL` | 300,000ms | System metrics, operations telemetry, service/dependency health. |
| **BHIV Bucket** | [bucketEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/bucketEndpoints.ts) | `VITE_BUCKET_SERVICE_URL` | 15,000ms | Storage metrics, audit chain integrity, replay records, and artifacts. |
| **BHIV Prana** | [pranaEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/pranaEndpoints.ts) | `VITE_PRANA_SERVICE_URL` | 10,000ms | Propagation log telemetry and node replication health. |
| **Niyantran** | [niyantranEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/niyantranEndpoints.ts) | `VITE_NIYANTRAN_URL` | 15,000ms | Active developers, team workloads, attendance summary, and AIMS. |
| **InsightFlow** | [insightflowEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/insightflowEndpoints.ts) | `VITE_INSIGHTFLOW_URL` | 15,000ms | Sync percentage, stage-by-stage write queues, and metrics. |
| **Tantra** | [tantraEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/tantraEndpoints.ts) | `VITE_TANTRA_BASE_URL` | 30,000ms | Elevated timeout telemetry to mitigate Render cold starts. |
| **Rajya** | [rajyaEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/rajyaEndpoints.ts) | `VITE_RAJYA_BASE_URL` | 30,000ms | Text risk scoring and contract health checks. |
| **Sanskar** | [sanskarEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/sanskarEndpoints.ts) | `VITE_SANSKAR_BASE_URL` | 15,000ms | Moderation rankings, decision states, and integrity verdicts. |
| **Karma** | [karmaEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/karmaEndpoints.ts) | `VITE_KARMA_URL` | 15,000ms | Lineage hashes, punya/paap ratios, and seva flow diagrams. |
| **Keshav** | [keshavEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/keshavEndpoints.ts) | `VITE_KESHAV_URL` | 10,000ms | Latency tracking, requests distribution, and compliance scoring. |
| **Setu** | [setuEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/setuEndpoints.ts) | `VITE_SETU_URL` | 10,000ms | Project tasks, milestone targets, and engineering assignments. |

---

## 2. API Endpoints & Operations

### Control Plane (`apiClient`):
*   `GET /health`: Basic health state check.
*   `GET /system/status`: Normalized status list of components/services.
*   `GET /metrics`: Uptime, success/error rates, and response times.
*   `GET /dashboard/operations`: Details on active operation progress.
*   `GET /dashboard/alerts`: Active alerts list and severity statistics.
*   `GET /dashboard/runtime`: active sessions status, performance stats.
*   `GET /dashboard/telemetry`: Uptime timelines and response graphs.

### BHIV Bucket (`bucketClient`):
*   `GET /health`: Health status.
*   `GET /bucket/artifacts`: Lists storage artifacts (paginated).
*   `GET /bucket/storage-stats`: Compression and size bytes metrics.
*   `GET /bucket/chain-state`: Merkle tree lineage checks.
*   `GET /audit/recent` & `GET /audit/failed`: Audit timelines.
*   `GET /metrics/scale-status`, `/metrics/query-performance`, `/metrics/alerts`: Observability feeds.
*   `GET /constitutional/status`: Blockchain rule state.

### Niyantran (`niyantranClient`):
*   `GET /api/dashboard/stats`: Task metrics (pending, completed, in-progress).
*   `GET /api/dashboard/tasks-overview`: Task status and priority lists.
*   `GET /api/dashboard/departments`: Department allocations.
*   `GET /api/dashboard/leaderboard`: Workload metrics and completion rates.
*   `GET /api/dashboard/attendance-summary`: Clock-in times, worked hours, and biometric details.
*   `GET /api/dashboard/merge-analysis`: Mismatches and mapping statuses.
*   `GET /api/tantra/execution/:id/history`: Lineage rejections and hashes.
*   `GET /api/aims` & `GET /api/aims/with-progress`: Universal project objectives.
*   `GET /api/alerts`: Monitored alerts.
*   `GET /api/submissions`: Work submissions.
*   `GET /api/tasks`: Active task lists.
*   `GET /api/attendance-dashboard/locations`: Live developer location track.

### Setu (`setuClient`):
*   `GET /health` & `/ready`: Health checks.
*   `GET /projects`: Project list.
*   `GET /projects/:id`: Project details.
*   `GET /projects/:id/milestones`: Milestone targets.
*   `GET /tasks/:id`: Task details.
*   `GET /tasks/:id/assignments`: Task assignment details.

---

## 3. Resilience, Fault-Tolerance & Error States

*   **Loading States**: Handled dynamically via `@tanstack/react-query` using `isLoading` properties. The page renders skeleton loaders during active requests.
*   **Empty States**: Component views inspect payload lengths (e.g., `data.length === 0`) and show stylized empty messages (e.g., "No Active Engineers").
*   **Error States**: React Query catch-blocks return offline cache/fallbacks. Failed client-side API requests return empty schemas (e.g., `{ total_engineers: 0, engineers: [] }`) instead of crashing the UI.
*   **Offline Handling**: [useNetworkState.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/hooks/useNetworkState.ts) hooks monitor browser connectivity. An offline banner is displayed when network access drops.
*   **Retry Handling**: Custom Axios response interceptors handle Render cold starts (30s timeouts) and retry on transient errors. React Query is configured with `retry: 1` for registry services to prevent infinite loops.

---

## 4. Docker & CI/CD Verification

*   **Dockerfile**: Uses multi-stage builds. Stage 1 compiles the Vite bundle using `node:20-alpine`, injecting `VITE_` variables. Stage 2 serves the static `/dist` directory via `serve -s dist -l 5173`.
*   **docker-compose.yml**: Maps the container port `5173` to the host port `5173` locally.
*   **docker-compose.production.template.yml**: Configures the production port mapping `5176:5173` and defines a health check: `test: ["CMD", "curl", "-f", "http://localhost:5173"]`.
*   **GitHub Actions (`cicd.yml`)**: Automates validation, build (pushes to Docker Hub), SSH-based VM deployment, container health checks (polling port 5176), and automatic rollbacks parsing `RELEASE_HISTORY.md` on failure.
