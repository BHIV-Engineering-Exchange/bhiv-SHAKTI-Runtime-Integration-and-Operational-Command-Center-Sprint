# Phase 2 Baseline Audit — SHAKTI Operational Command Center Convergence

**Audit Date**: 2026-09-07  
**Auditor**: Pratik Bhuwad (AI ML Department)  
**Task**: Phase 2: Advanced Integration & Security Hardening — SHAKTI Operational Command Center Convergence  
**Target Date**: 2026-09-08  
**Repository**: `c:\Pratik_Bhuwad\SHAKTI\shakti-command-center`  

---

## 1. Git Repository State

* **Active Branch**: `main`
* **Head Commit**: `b91aa450` (`fix(integration): update Sanskar service port to 8018 and resolve Karma intelligence contract.`)
* **Remote Tracking**: `origin/main` (Up to date)
* **Working Tree State**:
  * `modified: src/utils/format.ts` — Hardened `toStatus()` so that `unhealthy`, `down`, `failed`, `error`, `crash_looping` strictly map to `offline` (red: `text-red-400` / `bg-red-400`) instead of incorrectly falling through to `online` (green).
  * `modified: src/test/health-mapping.test.tsx` — Added 4 comprehensive unit tests verifying `toStatus()` mapping integrity.

---

## 2. Recent Git History (Last 10 Commits)

1. `b91aa450` — fix(integration): update Sanskar service port to 8018 and resolve Karma intelligence contract.
2. `a6272930` — fix(integration): resolve SETU endpoints, InsightFlow and Keshav health mappings
3. `a42cf524` — fix(cicd): escape negation operators in find command to match TANTRA deployment pattern
4. `08594e87` — Update : vercel.json & vite.config.ts (InsightFlow & Tantra URL)
5. `07e8fcde` — Merge branch 'main' of https://github.com/blackholeinfiverse145/SHAKTI-Runtime-Integration-and-Operational-Command-Center-Sprint
6. `54748eea` — fix: normalize SETU API responses and add safety guards across dashboard layouts
7. `cd8b6e1d` — modified env file and docker file
8. `884cfe3c` — Configure reverse proxy routes and relative paths to resolve mixed-content blocks - Added vercel.json with server-side rewrites for all backend microservice endpoints.
9. `b631d4a8` — added URLs for RAJYA and KESHAV
10. `1f5ad435` — added control-plan URL of core integrator to shakti

---

## 3. Existing Implementation Baseline

* **Technology Stack**: React 19.2.7, TypeScript 6.0.2, Vite 8.1.4, Tailwind CSS v4, TanStack React Query v5.101.2, Lucide React, Recharts.
* **Component Architecture**: 18 specialized dashboard layouts wrapped in `ErrorBoundary` with custom skeleton loaders and fallback states:
  * `ExecutiveLayout`
  * `OperationsLayout`
  * `IntegrationLayout`
  * `DecisionIntelligenceLayout`
  * `WorkflowLayout`
  * `OperatorConsoleLayout`
  * `RuntimeHealthLayout`
  * `ReplayLayout`
  * `EvidenceLayout`
  * `RepositoryRegistryLayout`
  * `BuildRegistryLayout`
  * `MigrationQueueLayout`
  * `ReviewQueueLayout`
  * `CapabilityRegistryLayout`
  * `EmployeeExecutionLayout`
  * `EngineeringCapacityLayout`
  * `DeliveryIntelligenceLayout`
  * `CapabilityDependencyGraphLayout`
  * `ObservabilityLayout`
* **API Client Layer**: Dedicated typed client modules in `src/api/` for all 10 microservices:
  * Control Plane (`client.ts`, `endpoints.ts`)
  * Bucket Storage (`bucketEndpoints.ts`)
  * Prana Engine (`pranaEndpoints.ts`)
  * Niyantran Management (`niyantranEndpoints.ts`)
  * InsightFlow (`insightflowEndpoints.ts`)
  * Tantra Bridge (`tantraEndpoints.ts`)
  * Rajya Governance (`rajyaEndpoints.ts`)
  * Karma Analytics (`karmaEndpoints.ts`)
  * Keshav Dependency Engine (`keshavEndpoints.ts`)
  * SETU Interface (`setuEndpoints.ts`)

---

## 4. Current Test & Build Baseline

* **Vitest Suite**: **44 passed** across 6 test files (`npm run test`):
  * `src/test/integration.test.tsx` (8 tests)
  * `src/test/DashboardCard.test.tsx` (6 tests)
  * `src/test/ErrorBoundary.test.tsx` (3 tests)
  * `src/test/health-mapping.test.tsx` (17 tests)
  * `src/test/layouts.test.tsx` (6 tests)
  * `src/test/DecisionIntelligenceLayout.test.tsx` (4 tests)
* **TypeScript Compilation**: `tsc -b` passes with **0 errors**.
* **Production Bundle**: `vite build` succeeds cleanly in ~1.8s.

---

## 5. Live Production & Known Blocker Inventory

1. **Keshav Backend Status**:
   * Direct check on `http://163.128.209.18:5003/health` returns `200 OK` (`{"status":"OK","service":"KESHAV"}`).
   * The backend is **HEALTHY**.
2. **Production Container Routing Blocker**:
   * The container on `http://163.128.209.18:5176` serves static files via `serve -s dist -l 5173`.
   * It has **no reverse proxy configured** for `/api/*`. All `/api/*` requests return the single-page application `index.html` (HTTP 200 `text/html`) instead of forwarding to VM microservices.
3. **Niyantran CORS Configuration**:
   * `https://niyantran.blackholeinfiverse.com` does not send `Access-Control-Allow-Origin` headers for `http://163.128.209.18:5176` or `localhost:5174`, blocking browser direct calls.
4. **Sanskar Port & Ranking State**:
   * Sanskar is active on port `8018` (updated from port 8000).
   * `/health` returns `200 OK` (`healthy`).
   * `/ranking` returns `404 Not Found` (`{"detail":"No ranking available"}`) because ranking calculation data has not been seeded.
5. **Backend Route Gaps**:
   * InsightFlow (Port 8122): `/bucket/status` and `/stage-metrics` return 404 (only `/enforce`, `/login`, `/health` registered).
   * Tantra (Port 3009): `/telemetry` and `/telemetry/summary` return 404.
   * SETU (Port 8014): `/projects` returns 404.
