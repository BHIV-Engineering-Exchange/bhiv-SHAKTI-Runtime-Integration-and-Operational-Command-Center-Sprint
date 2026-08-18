# SHAKTI Production Runtime Evidence Gap Analysis — 2026-08-13

This report reviews the current production runtime evidence collected on **2026-08-13** for the SHAKTI Command Center certification. It identifies what evidence is currently available, what remains missing, and assigns actions to the appropriate owners.

---

## 1. Summary of Evidence Status

### A. Evidence Already Available
- **API Integration Telemetry Logs**: A complete network routing audit has been completed and saved in [niyantran_retest_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/niyantran_retest_2026-08-13.md), [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md), and [production_integration_verification_2026-08-13.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json).
- **Client Code Base Layout Audit**: Verification of Axios clients, interceptors, network hook retries, and error boundaries.
- **Local Compiler & Build Verification**: Clean compilation output verified from `npm run build` and successful Vitest execution (27/27 test specs passed) recorded in [testing_results.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/testing_results.md).

### B. Evidence Still Missing
- **VM-Level Container State Evidence**: The terminal output of `docker compose ps` on the target remote VM showing running containers and health flags.
- **VM Container Standard Output Logs**: Active runtime stdout logs (`docker compose logs --tail=100`) from the hosting environment.
- **CI/CD Action Executions**: Run logs or URLs of the `.github/workflows/cicd.yml` workflow run verifying successful deployments and post-deploy health check pass marks.
- **Production SSL & CORS Verifications**: Real browser network headers proving CORS policies permit static dashboard clients to connect to remote APIs.

### C. Evidence Requiring Another Person (Alay / VM Owner / Backend Owner)
- Remote VM diagnostics (`docker compose` command runs).
- Server-side fixes for the **BHIV Bucket** (503), **Karma** (500 on lineage), **Setu** (404 on ngrok tunnel), **InsightFlow** (TIMEOUT), **Rajya** (TIMEOUT), and **Keshav** (TIMEOUT on health).
- Transitioning local configurations to public production domains for **Sanskar** and **Control Plane**.

### D. Evidence I Can Collect Myself
- None. All repository audits, client configs, and workspace connectivity tests are fully collected and documented. I cannot access the remote VM or modify cloud endpoints.

### E. Evidence Requiring Independent Tester (Vinayak)
- The functional testing verdict and zone approvals checklist.

### F. Evidence That Should NOT Be Recollected (Already Exists)
- Niyantran API endpoint checks (`/api/aims`, `/api/aims/with-progress`, `/api/dashboard/stats` all return `200 OK`).
- Basic connection proofs for Prana, Tantra, Keshav (metrics), and Karma (health).
- Staging/local build compilation logs.

---

## 2. Service-by-Service Audit Inventory

### Niyantran
- **Endpoint(s) Tested**: `/api/aims`, `/api/aims/with-progress`, `/api/dashboard/stats`
- **Current Status**: `200 OK` (RESOLVED)
- **Existing Evidence File**: [niyantran_retest_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/niyantran_retest_2026-08-13.md)
- **Evidence Sufficient**: Yes, for API connection proof.
- **Missing Evidence**: VM Docker container logs under load.
- **Who Should Provide**: Alay (VM Operator).

### BHIV Prana
- **Endpoint(s) Tested**: `/health`, `/prana/propagation-log`
- **Current Status**: `/health` -> `200 OK` (117 ms), `/prana/propagation-log` -> `200 OK` (66 ms)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: Yes, for API routing.
- **Missing Evidence**: Remote VM container diagnostics.
- **Who Should Provide**: Alay (VM Operator).

### InsightFlow
- **Endpoint(s) Tested**: `/health`, `/stage-metrics`
- **Current Status**: `TIMEOUT` (15000+ ms)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: No (Service timed out).
- **Missing Evidence**: Connectivity proof (`200 OK`) and service uptime status.
- **Who Should Provide**: Alay (VM Operator / Backend Owner).

### Tantra
- **Endpoint(s) Tested**: `/health`
- **Current Status**: `200 OK` (12362 ms, auth accepted)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: Yes, for basic API proof.
- **Missing Evidence**: Remote VM container diagnostics.
- **Who Should Provide**: Alay (VM Operator).

### Rajya
- **Endpoint(s) Tested**: `/health`
- **Current Status**: `TIMEOUT` (15000+ ms)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: No (Service timed out).
- **Missing Evidence**: Connectivity proof (`200 OK`) and service uptime status.
- **Who Should Provide**: Alay (VM Operator / Backend Owner).

### Keshav
- **Endpoint(s) Tested**: `/health`, `/metrics/json`
- **Current Status**: `/health` -> `TIMEOUT` (FAIL), `/metrics/json` -> `200 OK` (7623 ms)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: Partially. The metrics endpoint is responsive but `/health` is failing.
- **Missing Evidence**: Uptime proof for the `/health` endpoint.
- **Who Should Provide**: Alay (VM Operator / Backend Owner).

### Karma
- **Endpoint(s) Tested**: `/health`, `/intelligence/lineage`
- **Current Status**: `/health` -> `200 OK` (60 ms), `/intelligence/lineage` -> `500 Internal Server Error` (5327 ms)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: No (Core intelligence lineage endpoint fails with 500).
- **Missing Evidence**: Restored functional `/intelligence/lineage` response and error log analysis.
- **Who Should Provide**: Alay (VM Operator / Backend Owner).

### BHIV Bucket
- **Endpoint(s) Tested**: `/health`, `/bucket/storage-stats`
- **Current Status**: `503 Service Unavailable` on both endpoints
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: No (Service returns 503).
- **Missing Evidence**: Restored functional bucket response.
- **Who Should Provide**: Alay (VM Operator / Backend Owner).

### Setu
- **Endpoint(s) Tested**: `/api/v1/health`, `/api/v1/ready`
- **Current Status**: `404 Not Found` on both endpoints
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: No (Ngrok tunnel is active but returns 404).
- **Missing Evidence**: Restored health/readiness connectivity (`200 OK`).
- **Who Should Provide**: Alay (VM Operator / Tunnel configurer).

### Sanskar
- **Endpoint(s) Tested**: `/health`
- **Current Status**: `ERROR` / `BLOCKED` (Connection Refused on localhost)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: No (Localhost configuration cannot be audited externally).
- **Missing Evidence**: Production API endpoint routing proof.
- **Who Should Provide**: Alay (VM Operator / Configuration).

### Control Plane
- **Endpoint(s) Tested**: `/health`
- **Current Status**: `ERROR` / `BLOCKED` (Connection Refused on localhost)
- **Existing Evidence File**: [production_integration_verification_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.md) / [.json](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/production_integration_verification_2026-08-13.json)
- **Evidence Sufficient**: No (Localhost configuration cannot be audited externally).
- **Missing Evidence**: Production API endpoint routing proof.
- **Who Should Provide**: Alay (VM Operator / Configuration).

---

## 3. NEXT ACTIONS

1. **Deploy Production Fixes (Alay / Backend Team)**:
   - Restore the **BHIV Bucket** service (currently returning 503).
   - Investigate the server-side crash on **Karma** `/intelligence/lineage` (currently returning 500).
   - Reconfigure/re-route the **Setu** ngrok tunnel to resolve the active 404 failures on `/api/v1/health`.
   - Wake up or debug timed-out services: **InsightFlow**, **Rajya**, and **Keshav** health.
2. **Collect VM-Level Logs (Alay)**:
   - Provide command printouts of `docker compose ps` and `docker compose logs` directly from the production VM hosting environment.
3. **Execute Independent QA Audit (Vinayak)**:
   - Review and sign off the dashboard operational features checklist.
