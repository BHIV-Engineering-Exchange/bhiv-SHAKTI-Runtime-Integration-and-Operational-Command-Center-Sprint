# Phase 2 API Contract Validation Report — SHAKTI Command Center

**Validation Date**: 2026-09-07  
**Auditor**: Pratik Bhuwad (AI ML Department)  
**Task**: Phase 2: Integration Contract Validation  

---

## 1. Active Frontend Integration Contract Matrix

| Service | Frontend Base URL | Active Frontend Endpoint | Documented Published Contract | Method | Expected Response Schema | Frontend Response Mapping | Auth / Access Requirements | Live Runtime Result | Classification |
|---|---|---|---|---|---|---|---|---|---|
| **Control Plane** | `/api/control-plane` | `/system/status` | `/system/status` | `GET` | `{ "overall_status": string, "services": map, ... }` | Mapped to `components` array with operational statuses | None | HTTP 200 JSON (`overall_status: "ok"`) | **F (Verified Operational)** |
| **Control Plane** | `/api/control-plane` | `/metrics` | `/metrics` | `GET` | `{ "uptime_seconds": number, "services": map, ... }` | Mapped to metrics summary card & throughput | None | HTTP 200 JSON (Live metrics) | **F (Verified Operational)** |
| **Bucket Storage**| `/api/bucket` | `/health` | `/health` | `GET` | `{ "status": string, "append_only_storage": object, ... }` | Mapped to `bucket_storage` component status | None | HTTP 200 JSON (`status: "degraded"`, append-only active) | **F (Verified Operational)** |
| **Bucket Storage**| `/api/bucket` | `/bucket/artifacts` | `/bucket/artifacts` | `GET` | `{ "artifacts": array, "count": number, ... }` | Mapped to Evidence & Artifacts table | None | HTTP 200 JSON (Active artifacts returned) | **F (Verified Operational)** |
| **Bucket Storage**| `/api/bucket` | `/metrics/scale-status` | `/metrics/scale-status` | `GET` | `{ "concurrent_writes": object, ... }` | Mapped to concurrent writes gauge | None | HTTP 200 JSON (`current: 0, limit: 100`) | **F (Verified Operational)** |
| **Bucket Storage**| `/api/bucket` | `/metrics/query-performance` | `/metrics/query-performance` | `GET` | `{ "p50_ms": number, "p99_ms": number, ... }` | Mapped to telemetry P50/P99 latency cards | None | HTTP 200 JSON (`p50_ms: 0`) | **F (Verified Operational)** |
| **Prana Engine** | `/api/prana` | `/health` | `/health` | `GET` | `{ "status": string, "forwarding_enabled": bool }` | Mapped to PRANA service health | None | HTTP 200 JSON (`status: "healthy"`) | **F (Verified Operational)** |
| **Prana Engine** | `/api/prana` | `/prana/propagation-log` | `/prana/propagation-log` | `GET` | `{ "events": array, "count": number }` | Mapped to telemetry chart & recent logs | None | HTTP 200 JSON (`count: 0`) | **F (Verified Operational)** |
| **Prana Engine** | `/api/prana` | `/prana/system/health`| `/prana/system/health` | `GET` | `{ "status": string, "mode": string, ... }` | Mapped to PRANA mode & forwarding indicators | None | HTTP 200 JSON (`mode: "stateful"`) | **F (Verified Operational)** |
| **Keshav Engine** | `/api/keshav` | `/health` | `/health` | `GET` | `{ "status": "OK", "service": "KESHAV" }` | Case-insensitive mapping to `operational` | None | HTTP 200 JSON (`status: "OK"`) | **F (Verified Operational)** |
| **Keshav Engine** | `/api/keshav` | `/metrics/json` | `/metrics/json` | `GET` | `{ "request_count": number, "avg_latency_seconds": number }` | Mapped to KESHAV requests/latency cards | None | HTTP 200 JSON (`success_rate: 1.0`) | **F (Verified Operational)** |
| **Karma Analytics**| `/api/karma` | `/health` | `/health` | `GET` | `{ "status": string, "service": string }` | Mapped to KARMA helper health | None | HTTP 200 JSON (`status: "healthy"`) | **F (Verified Operational)** |
| **Karma Analytics**| `/api/karma` | `/api/v1/analytics/metrics/live`| `/api/v1/analytics/metrics/live` | `GET` | `{ "data": { "live_score": number, ... } }` | Mapped to KARMA live telemetry metrics | None | HTTP 200 JSON (`live_score: null`) | **F (Verified Operational)** |
| **Karma Analytics**| `/api/karma` | `/api/v1/analytics/karma_trends`| `/api/v1/analytics/karma_trends` | `GET` | `{ "data": { "trends": array } }` | Mapped to KARMA telemetry area chart | None | HTTP 200 JSON (`trends: []`) | **F (Verified Operational)** |
| **Karma Analytics**| `/api/karma` | `/intelligence/confidence/{id}` | `/intelligence/confidence/{id}` | `GET` | `{ "confidence_score": number, "explanation": string }` | Full Pydantic query params & body transmitted | None | HTTP 200 JSON (Resolved contract) | **F (Verified Operational)** |
| **Karma Analytics**| `/api/karma` | `/intelligence/reasoning/{id}` | `/intelligence/reasoning/{id}` | `GET` | `{ "conclusion": string, "evidence": array }` | Full Pydantic query params & body transmitted | None | HTTP 200 JSON (Resolved contract) | **F (Verified Operational)** |
| **Sanskar Domain** | `/api/sanskar` | `/health` | `/health` | `GET` | `{ "status": "healthy", "contract_version": "v1" }` | Mapped to Sanskar runtime status | None | HTTP 200 JSON (`status: "healthy"`) on Port 8018 | **F (Verified Operational)** |
| **Sanskar Domain** | `/api/sanskar` | `/ranking` | `/ranking` | `GET` | Array of domain entity rankings | Mapped to Decision Intelligence ranking list | None | HTTP 404 (`{"detail":"No ranking available"}`) | **D (Runtime Data Unavailable)** |
| **Rajya Enforcement**| `/api/rajya` | `/health` | `/health` | `GET` | `{ "status": string, "service": string }` | Mapped to Rajya enforcement status | None | HTTP 200 JSON (`status: "ok"`) | **F (Verified Operational)** |
| **Tantra Bridge** | `/api/tantra` | `/health` | `/health` | `GET` | `{ "service": "core", "status": "healthy" }` | Mapped to Tantra gated bridge status | None | HTTP 200 JSON (`status: "healthy"`) | **F (Verified Operational)** |
| **Tantra Bridge** | `/api/tantra` | `/telemetry` | Undocumented / Missing | `GET` | Telemetry response distributions | Fallback to zero metrics | None | HTTP 404 (`Cannot GET /telemetry`) | **C / D (Backend Route Missing)** |
| **SETU Interface** | `/api/setu` | `/health` | `/health` | `GET` | `{ "success": true, "status": "healthy" }` | Mapped to SETU interface status | None | HTTP 200 JSON (`status: "healthy"`) | **F (Verified Operational)** |
| **SETU Interface** | `/api/setu` | `/projects` | Undocumented / Missing | `GET` | Projects list | Fallback to empty projects list | None | HTTP 404 (`Route not found`) | **C / D (Backend Route Missing)** |
| **InsightFlow** | `/api/insightflow` | `/health` | `/health` | `GET` | `{ "status": "healthy", "service": "InsightBridge" }` | Mapped to InsightFlow runtime status | None | HTTP 200 JSON (`status: "healthy"`) | **F (Verified Operational)** |
| **InsightFlow** | `/api/insightflow` | `/stage-metrics` | Undocumented / Missing | `GET` | Pipeline stage telemetry | Fallback to zero metrics | None | HTTP 404 (`detail: Not Found`) | **C / D (Backend Route Missing)** |
| **Niyantran** | `https://niyantran...` | `/api/aims` | `/api/aims` | `GET` | `{ "aims": array }` | Mapped to team capacity and strategic aims | `WorkflowToken` / `Bearer` | HTTP 401 via Node / CORS Block via Browser | **E (Auth & CORS Policy Issue)** |

---

## 2. Classification Summary

* **F (Verified Operational)**: 19 endpoints verified active, responding with valid JSON schemas.
* **D (Runtime Data Unavailable)**: 1 endpoint (`/ranking` on Sanskar port 8018) exists in route table but has no seeded runtime data.
* **C / D (Backend Route Missing)**: 3 auxiliary endpoints (`/telemetry` on Tantra, `/projects` on SETU, `/stage-metrics` on InsightFlow) are not mounted on their respective microservices.
* **E (Authentication / Access Issue)**: Niyantran requires session bearer credentials and CORS preflight allow-origin headers for browser clients.
