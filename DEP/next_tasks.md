# DEP: Next Tasks

This document contains immediate next actions required to certify the SHAKTI Command Center deployment.

---

1.  ~~**Resolve Niyantran Outage**~~: **RESOLVED** (2026-08-13). All 3 endpoints now return `200 OK`. Evidence: [niyantran_retest_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/niyantran_retest_2026-08-13.md).
2.  ~~**Deploy Production Stack**~~: **COMPLETE**. GitHub Actions deployment succeeded. Container `shakti-dashboard` is `Up (healthy)` on production VM. Evidence: [production_deployment_success.png](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/github_actions/production_deployment_success.png).
3.  ~~**Collect Production Evidence**~~: **COMPLETE** (2026-08-13). VM container status, dashboard runtime logs, HTTPS verification, and Niyantran retest all collected. See `evidence_packet/runtime_logs/`.
4.  ~~**Resolve Backend VM Deployments & Integration Mismatches**~~: **RESOLVED / VERIFIED (2026-09-04)**.
    *   Control Plane, Prana, Niyantran, InsightFlow, Tantra, Rajya, Karma, Keshav, and SETU health checks now return `200 OK` on VM endpoints (`163.128.209.18:*`).
    *   SETU `/api/v1` prefix and `/ready` dependency removed on frontend; live `/health` maps to operational.
    *   InsightFlow and Keshav health mappings updated to handle `"healthy"` and `"OK"` statuses.
    *   BHIV Bucket operates with `status: degraded` (Redis disconnected, Socket.IO disabled), but all 9 published data endpoints return `200 OK`.
5.  **Reconcile Published Route Details**:
    *   SETU: Decide whether to expose `/projects` on backend or update published contract (currently non-blocking; UI degrades safely with empty state).
    *   Bucket: Evaluate whether Redis/Socket.IO backend remediation is desired or if degraded operational status is certified as acceptable.
6.  **Sanskar Microservice Deployment (Post-VM Deployment Task)**:
    *   Sanskar is currently NOT DEPLOYED on the production VM and is OUT OF SCOPE for current reconciliation.
    *   Once deployed on the VM, update `VITE_SANSKAR_BASE_URL`, rebuild, and perform separate live endpoint verification.
7.  **Independent QA Verification (Vinayak)**: Perform manual QA checks across all 19 dashboard zones and log the testing verdict.
8.  **GC and TMS Sign-Offs**: Finalize compliance and task ticket updates once independent QA and telemetry evidence collection are completed.

