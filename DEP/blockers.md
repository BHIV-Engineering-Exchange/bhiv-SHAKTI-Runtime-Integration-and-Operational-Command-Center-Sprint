# DEP: Active Blockers

This document tracks all active blockers preventing production VM certification.

---

| Blocker Description | Owner | Severity | Impact on Certification | Status |
|---|---|---|---|---|
| **Niyantran Cloud Service Outage** (`504 Gateway Time-out` on `https://niyantran.blackholeinfiverse.com`) | Alay / Backend Team | **Critical** | Previously blocked Employee Execution and Delivery Intelligence zones. | **Resolved** (2026-08-13). Retests on 2026-08-13 and 2026-09-04 confirm `/api/dashboard/stats` → 200 OK (2626 tasks). |
| **SETU Frontend Integration Mismatch** (`/api/v1` prefix & `/ready` dependency) | Pratik (Frontend) | **High** | Previously blocked SETU health monitoring. | **Resolved** (2026-09-04). Removed `/api/v1` prefix and `/ready` dependency; health mapping updated for `"healthy"`. Live `/health` verified 200 OK. |
| **Missing Production Telemetry Logs** | VM Operator (Alay) | **Medium** | Missing evidence blocks final GC and deployment sign-offs. | **Active** |
| **Missing Independent QA Sign-Off** | Tester (Vinayak) | **Medium** | Prevents final TMS completion ticket closure. | **Active** |

