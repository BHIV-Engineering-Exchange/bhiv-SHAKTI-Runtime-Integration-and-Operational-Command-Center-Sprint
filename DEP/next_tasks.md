# DEP: Next Tasks

This document contains immediate next actions required to certify the SHAKTI Command Center deployment.

---

1.  **Resolve Niyantran Outage (High Priority)**: Alay needs to investigate the Niyantran backend server (`https://niyantran.blackholeinfiverse.com`) which is currently returning `504 Gateway Time-out` errors.
2.  **Deploy Production Stack**: Trigger the GitHub Actions workflow to build the Docker image and deploy to the remote VM.
3.  **Collect Production Evidence**:
    *   Capture running container status using `docker compose ps` on the VM.
    *   Capture health check logs and web console requests.
    *   Populate `evidence_packet/screenshots/` and `evidence_packet/runtime_logs/` directories.
4.  **Independent QA Verification**: Assign to Vinayak to perform manual QA checks across all 15 dashboard zones and log the testing verdict.
5.  **GC and TMS Sign-Offs**: Finalize compliance and task tickets updates.
