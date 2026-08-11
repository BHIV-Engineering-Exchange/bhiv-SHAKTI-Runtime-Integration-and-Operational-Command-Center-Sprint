# Missing Production Evidence Checklist

This document details all deployment verification logs, VM runtime states, and external audits that cannot be proven directly from the local repository state. 

These items **must be captured from the production environment** by Alay (VM Operator) or Vinayak (Tester) to achieve final production certification.

---

## 1. VM Deployment & Container Evidence

The following runtime verification data is required directly from the target production VM:

*   **Production Frontend URL Accessibility**: Screenshot and browser request confirmation of the live dashboard running at the public domain or address.
*   **Docker Container Status**: Output of `docker compose -f docker-compose.production.yml ps` running on the remote VM, showing container status and health state.
*   **Live Container Logs**: Standard output from `docker compose -f docker-compose.production.yml logs --tail=100` to verify there are no active runtime console errors.
*   **Production SSL Status**: Verification that HTTPS is configured and active for browser clients.
*   **Deployment Script Logs**: The terminal output/log of the "Deploy production stack on VM" stage of the CI/CD pipeline.

---

## 2. GitHub Actions Pipeline Proofs

*   **Action Run Logs**: Logs/URLs for successful runs of the `.github/workflows/cicd.yml` workflow, confirming the Build, Deploy, and post-deploy Health Checks passed.
*   **Rollback Verification**: Evidence or logs demonstrating the successful execution of the SSH rollback job under failure conditions (for example, using a previous tag).

---

## 3. Production API Integration Telemetry

*   **Active Integration API Payloads**: Sanitized JSON response payloads from the live production endpoints:
    *   Control Plane `/health` and `/system/status` responses.
    *   BHIV Bucket `/health` and `/bucket/storage-stats` responses.
    *   Niyantran `/api/dashboard/attendance-summary` and `/api/dashboard/stats` responses.
*   **CORS Verification**: Browser network logs verifying that CORS headers are correctly set by the remote APIs to allow requests originating from the production dashboard domain.

---

## 4. Independent Testing Evidence

*   **Vinayak's Testing Verdict**: Verification checklist or approval sheet from the independent testing phase confirming functional validation of all dashboard zones.
