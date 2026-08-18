# DEP: Next Tasks

This document contains immediate next actions required to certify the SHAKTI Command Center deployment.

---

1.  ~~**Resolve Niyantran Outage**~~: **RESOLVED** (2026-08-13). All 3 endpoints now return `200 OK`. Evidence: [niyantran_retest_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/niyantran_retest_2026-08-13.md).
2.  ~~**Deploy Production Stack**~~: **COMPLETE**. GitHub Actions deployment succeeded. Container `shakti-dashboard` is `Up (healthy)` on production VM. Evidence: [production_deployment_success.png](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/github_actions/production_deployment_success.png).
3.  ~~**Collect Production Evidence**~~: **COMPLETE** (2026-08-13). VM container status, dashboard runtime logs, HTTPS verification, and Niyantran retest all collected. See `evidence_packet/runtime_logs/`.
4.  **Resolve Remaining Backend Failures (Alay / Backend Team)**:
    *   BHIV Bucket — `503 Service Unavailable` on `/health` and `/bucket/storage-stats`.
    *   Karma — `500 Internal Server Error` on `/intelligence/lineage`.
    *   InsightFlow — `TIMEOUT` on `/health` and `/stage-metrics` (Render cold start / offline).
    *   Rajya — `TIMEOUT` on `/health` (Render cold start / offline).
    *   Keshav — `TIMEOUT` on `/health` (but `/metrics/json` returns `200 OK`).
    *   Setu — `404 Not Found` on `/api/v1/health` and `/api/v1/ready` (ngrok tunnel issue).
    *   Sanskar — `Connection Refused` on `localhost:8000` (needs production endpoint).
    *   Control Plane — `Connection Refused` on `localhost:8009` (needs production endpoint).
5.  **Provide VM `RELEASE_HISTORY.md` (Alay)**: Copy `/var/tmp/SHAKTI/RELEASE_HISTORY.md` from the production VM into `evidence_packet/release_history/`.
6.  **Independent QA Verification (Vinayak)**: Perform manual QA checks across all 19 dashboard zones and log the testing verdict.
7.  **GC and TMS Sign-Offs**: Finalize compliance and task ticket updates once all backend blockers and QA are resolved.
