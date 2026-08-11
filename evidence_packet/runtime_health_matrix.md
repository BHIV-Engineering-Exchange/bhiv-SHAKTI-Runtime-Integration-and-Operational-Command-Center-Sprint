# Runtime Health Matrix

This document maps the health and readiness verification endpoints consumed by the SHAKTI Command Center and its integrated backend services.

---

## 1. SHAKTI Frontend Deployment Details

| Component | Port (Dev) | Port (Prod) | Verification Route | Health check definition |
|---|---|---|---|---|
| **SHAKTI Frontend** | `5173` | `5176` | `/` | Defined in [docker-compose.production.template.yml](file:///c:/Pratik_Bhuwad/shakti-command-center/docker-compose.production.template.yml#L10) using `curl -f http://localhost:5173` |

---

## 2. Integrated Backend Health & Readiness Matrix

SHAKTI is a static single-page React frontend application. Therefore, it does not host its own health check endpoint, but it queries `/health` or `/ready` on its integrated backend APIs:

| Integrated Service | Health Endpoint | Readiness Endpoint | Consumed via Hook / Endpoint Function | Purpose |
|---|---|---|---|---|
| **Control Plane** | `/health` | — | `fetchHealth()` | Verifies availability of the core system metrics broker. |
| **BHIV Bucket** | `/health` | — | `fetchBucketHealth()` | Verifies compliance and storage node status. |
| **BHIV Prana** | `/health` | — | `fetchPranaHealth()` | Verifies replication and propagation status. |
| **Niyantran** | — | — | — | Accessed directly via API paths (e.g. `/api/dashboard/stats`). |
| **InsightFlow** | `/health` | — | `fetchInsightFlowHealth()` | Verifies write queue queue health. |
| **Tantra** | `/health` | — | `fetchTantraHealth()` | Verifies bridge connectivity. |
| **Rajya** | `/health` | — | `fetchRajyaHealth()` | Verifies text risk scoring gateway status. |
| **Sanskar** | `/health` | — | `getHealth()` | Verifies content filtering service status. |
| **Karma** | `/health` | — | `fetchKarmaHealth()` | Verifies telemetry flow and lineage ledger. |
| **Keshav** | `/health` | — | `getHealth()` | Verifies trace compliance scores. |
| **Setu** | `/health` | `/ready` | `getHealth()`, `getReady()` | Verifies project milestone backend readiness status. |
| **BHEX Registries** | — | — | — | Implementation pending; stubs return empty arrays locally. |
