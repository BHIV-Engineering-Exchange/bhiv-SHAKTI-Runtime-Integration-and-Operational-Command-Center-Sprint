# DEP: Active Blockers

This document tracks all active blockers preventing production VM certification.

---

| Blocker Description | Owner | Severity | Impact on Certification | Status |
|---|---|---|---|---|
| **Niyantran Cloud Service Outage** (`504 Gateway Time-out` on `https://niyantran.blackholeinfiverse.com`) | Alay / Backend Team | **Critical** | Previously blocked Employee Execution and Delivery Intelligence zones. | **Resolved** (2026-08-13). Retest confirmed `/api/aims` → 200, `/api/aims/with-progress` → 200, `/api/dashboard/stats` → 200. Evidence: [niyantran_retest_2026-08-13.md](file:///c:/Pratik_Bhuwad/shakti-command-center/evidence_packet/runtime_logs/niyantran_retest_2026-08-13.md). |
| **Missing Production Telemetry Logs** | VM Operator (Alay) | **Medium** | Missing evidence blocks final GC and deployment sign-offs. | **Active** |
| **Missing Independent QA Sign-Off** | Tester (Vinayak) | **Medium** | Prevents final TMS completion ticket closure. | **Active** |
