# SHAKTI Command Center — Unified Production Integration, Health & Deployment Audit Report

**Date:** 2026-09-04T15:45+05:30 (IST)  
**Auditor:** Automated Production Integration & Architecture Diagnostics Suite  
**Scope:** Full Ecosystem Health Audit (11 Microservices), Frontend Contract Reconciliation, and VM Container Deployment Architecture  
**Status:** Unified Master Audit Report  

---

## 1. Executive Summary & Core Verdict

This single consolidated report summarizes all audit, verification, contract reconciliation, and deployment architecture findings for the SHAKTI Command Center as of **September 4, 2026**.

### Key Findings:
1. **Frontend Codebase is Fixed & Verified:** All source code fixes (SETU `/api/v1` prefix & `/ready` removal, InsightFlow `"healthy"` mapping, Keshav case-insensitive `"OK"` mapping) are implemented and verified locally with **38/38 passing Vitest tests** and **0 TypeScript compilation errors**.
2. **Backend Services are Live on VM:** 10 of 11 backend service health checks are active on the VM (`163.128.209.18:*`) and Niyantran HTTPS. (*Sanskar is not yet deployed on the VM and is out of scope*).
3. **Keshav Backend is 100% Healthy:** Direct calls to `http://163.128.209.18:5003/health` return `HTTP 200 OK` (`{"status":"OK","service":"KESHAV"}`). The degraded display in the live dashboard is **caused entirely by the frontend container deployment and routing architecture**, not the backend.
4. **Container Deployment Architecture Gap Identified:** The production container on port `5176` uses Node `serve -s dist -l 5173`, which lacks reverse proxy rules for `/api/*` and serves an outdated bundle. When the browser calls `/api/keshav/health`, the server returns `index.html` (text/html) instead of proxying to the backend.

---

## 2. Live Service Health & Backend Contract Status

| Service | VM Endpoint | Direct Path Tested | Backend HTTP Status | Backend Raw Payload | Dashboard Interpreted Health | Contract Alignment | Notes |
|---|---|---|---|---|---|---|---|
| **Control Plane** | `163.128.209.18:8120` | `/health`<br>`/system/status` | 200 OK<br>200 OK | `{"status":"ok"}`<br>`{"overall_status":"ok"}` | **Operational** | **PASS** | 6/6 data endpoints return 200 OK. |
| **Bucket** | `163.128.209.18:8012` | `/health` | 200 OK | `{"status":"degraded"}` | **Operational** (from degraded) | **PARTIAL** | Redis disconnected on backend; core storage & all 9 published routes return 200 OK. |
| **Prana** | `163.128.209.18:8103` | `/health`<br>`/prana/system/health` | 200 OK<br>200 OK | `{"status":"healthy"}`<br>`{"status":"healthy","mode":"stateful"}` | **Operational** | **PASS** | MongoDB connected; propagation logs return 200 OK. |
| **Niyantran** | `niyantran.blackholeinfiverse.com` | `/api/dashboard/stats` | 200 OK | `{"totalTasks":2626,...}` | **Operational** | **PASS** | Live task statistics verified. |
| **InsightFlow** | `163.128.209.18:8122` | `/health` | 200 OK | `{"status":"healthy","service":"InsightBridge"}` | **Operational** | **PASS** | Frontend mapping updated to accept `"healthy"`. |
| **Tantra** | `163.128.209.18:3009` | `/health` | 200 OK | `{"service":"core","status":"healthy"}` | **Operational** | **PASS** | Gated bridge core healthy. |
| **Rajya** | `163.128.209.18:8015` | `/health` | 200 OK | `{"status":"ok","service":"bhiv-enforcement-gateway"}` | **Operational** | **PASS** | Enforcement gateway active. |
| **Karma** | `163.128.209.18:8102` | `/health` | 200 OK | `{"status":"healthy","service":"bhiv-karma-helper"}` | **Operational** | **PASS** | Lineage, hash, and live analytics return 200 OK. |
| **Keshav** | `163.128.209.18:5003` | `/health` | 200 OK | `{"status":"OK","service":"KESHAV"}` | **Operational** (in source code) | **PASS** (Backend) | Direct backend is 100% healthy (68ms latency). |
| **SETU** | `163.128.209.18:8014` | `/health` | 200 OK | `{"status":"healthy","message":"Server is healthy"}` | **Operational** | **PASS** (Health) | `/api/v1` & `/ready` removed. Optional `/projects` 404 is handled gracefully. |
| **Sanskar** | `163.128.209.18:8000` | `/health` | 404 Not Found | `{"detail":"Not Found"}` | **Offline / Out of Scope** | **OUT OF SCOPE** | Backend container not yet deployed on VM. |

---

## 3. Keshav Degraded Status — Detailed Root Cause

```
+-------------------------------------------------------------------------------------------------------------+
|                                    WHY KESHAV DISPLAYED AS DEGRADED                                         |
+-------------------------------------------------------------------------------------------------------------+
| 1. Keshav Backend Status: VERIFIED HEALTHY (http://163.128.209.18:5003/health -> 200 OK {"status":"OK"}).   |
| 2. The issue is entirely on the FRONTEND DEPLOYMENT & ROUTING SIDE.                                         |
|                                                                                                             |
| EXACT ROOT CAUSES:                                                                                          |
| A. Case Sensitivity in Stale Build:                                                                         |
|    - Old code checked `status === "ok"` (lowercase only). Backend returns uppercase `"OK"`.                 |
|    - We fixed this in local source with `toLowerCase() === "ok"`, but the fix is not yet deployed on the VM.|
|                                                                                                             |
| B. Missing Reverse Proxy in Container Server:                                                               |
|    - The production container runs `serve -s dist -l 5173`.                                                 |
|    - `serve -s` is a static file server with NO reverse proxy capability.                                  |
|    - When the browser calls `/api/keshav/health` on port 5176, `serve -s` returns `index.html` (text/html)  |
|      instead of forwarding the request to `http://163.128.209.18:5003/health`.                               |
|    - Axios receives HTML string -> `data?.status` is undefined -> frontend defaults to `degraded`.          |
|                                                                                                             |
| C. Stale Container Image:                                                                                   |
|    - The VM container on port 5176 is running an August build (`RuntimeHealthLayout-Bd7sT1Ib.js`).          |
|    - The updated local build (`RuntimeHealthLayout-CvkY17Ck.js`) has not yet been built and deployed by CI. |
+-------------------------------------------------------------------------------------------------------------+
```

---

## 4. Reverse Proxy & Deployment Architecture

```
+-------------------+---------------------------------------+-----------------------------+
| Environment       | Routing Mechanism                     | Status                      |
+-------------------+---------------------------------------+-----------------------------+
| Local Development | Vite Dev Server (vite.config.ts)      | Functional (HTTP 200 JSON)  |
| Vercel Deployment | Serverless Rewrites (vercel.json)     | Functional (HTTP 200 JSON)  |
| Production VM     | Node serve -s (Dockerfile)            | BROKEN (Returns index.html) |
+-------------------+---------------------------------------+-----------------------------+
```

### Git History Context:
- **Aug 7 (`ce78c525`):** `Dockerfile` created with `serve -s dist -l 5173` when backend URLs were absolute cross-origin endpoints.
- **Sep 1 (`884cfe3c` & `cd8b6e1d`):** `VITE_*` URLs transitioned to relative `/api/*` paths to eliminate HTTPS Mixed Content blocks. `vercel.json` and `vite.config.ts` were added/updated for rewrites, but the `Dockerfile` runner was left as `serve -s`.

---

## 5. Recommended Action to Complete Production VM Certification

1. **Update `Dockerfile` Serving Stage:** Replace Node `serve` with `nginx:alpine` containing an `nginx.conf` that serves `/dist` for static files, routes SPA fallbacks to `index.html`, and reverse-proxies `/api/*` paths to `http://163.128.209.18:*`.
2. **Deploy via CI/CD:** Push the commit to `main` branch to trigger `.github/workflows/cicd.yml`, building the new image and redeploying container `shakti-dashboard` on port `5176`.
3. **QA & Final Sign-Off:** Execute independent QA verification across all 19 dashboard zones and collect final telemetry logs.
