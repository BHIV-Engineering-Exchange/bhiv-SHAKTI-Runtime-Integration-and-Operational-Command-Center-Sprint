# Production Deployment Audit

This document audits the deployment architecture, Docker configurations, GitHub Actions pipelines, and rollback mechanisms implemented in the SHAKTI Command Center.

---

## 1. Containerization & Docker Layout

The project contains two Docker compose structures:

### A. Local Development:
*   **Source**: [docker-compose.yml](file:///c:/Pratik_Bhuwad/shakti-command-center/docker-compose.yml)
*   **Build Context**: Uses local `Dockerfile` build.
*   **Port Mapping**: `5173:5173`.
*   **Network**: `shakti-network` (bridge).

### B. Production Template:
*   **Source**: [docker-compose.production.template.yml](file:///c:/Pratik_Bhuwad/shakti-command-center/docker-compose.production.template.yml)
*   **Image**: `bhiv/shakti-dashboard:IMG_TAG` (the tag is substituted dynamically during the deployment runner phase).
*   **Port Mapping**: `5176:5173` (maps container port 5173 to public host port 5176).
*   **Health Check**:
    ```yaml
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173"]
      interval: 10s
      timeout: 5s
      retries: 5
    ```

### C. Dockerfile Analysis:
*   **Source**: [Dockerfile](file:///c:/Pratik_Bhuwad/shakti-command-center/Dockerfile)
*   **Build Stage**: Uses `node:20-alpine`, runs `npm ci` for a clean install, maps build arguments `VITE_NIYANTRAN_EXECUTION_KEY`, `VITE_NIYANTRAN_AUTH_TOKEN`, and `VITE_TANTRA_BRIDGE_SIGNATURE` to build environment variables, and builds the production bundle (`npm run build`).
*   **Serving Stage**: Uses `node:20-alpine` with `serve` global package to static-serve `/dist` directory. Runs under non-root user `frontend`.

---

## 2. GitHub Actions Deployment Pipeline

The pipeline is defined in [.github/workflows/cicd.yml](file:///c:/Pratik_Bhuwad/shakti-command-center/.github/workflows/cicd.yml).

### Execution Flow:
1.  **Validate**: Verifies compile-time schema by parsing `docker-compose.production.template.yml` and generating a stub configuration using `docker compose config`.
2.  **Build**: Connects and logs in to Docker Hub using secrets (`DOCKER_USERNAME`/`DOCKER_PASSWORD`). Builds and pushes the Docker image tagged with the 7-character Git SHA and `latest`.
3.  **Deploy**: 
    *   Creates a `deployment.tar.gz` bundle with the production compose template and environmental configurations.
    *   Uses `sshpass` to connect to the remote VM and logs in to Docker Hub on the VM.
    *   Substitutes the git short SHA in `docker-compose.production.template.yml` to generate `docker-compose.production.yml`.
    *   Runs `docker compose -f docker-compose.production.yml up -d --remove-orphans`.
    *   Verifies health check: polls port 5176 and queries the container status (`health=healthy`).
    *   Appends release history to `docs/RELEASE_HISTORY.md` and backs it up in `/var/tmp/SHAKTI/RELEASE_HISTORY.md` on success.
4.  **Rollback**:
    *   If the deploy step fails, the `rollback` job triggers.
    *   It parses the remote `/var/tmp/SHAKTI/RELEASE_HISTORY.md` file to locate the last successful release tag (`SUCCESS` or `ROLLBACK_SUCCESS`).
    *   Regenerates `docker-compose.production.yml` with the last healthy tag and triggers `docker compose up -d`.
    *   Verifies health on the rolled-back container.

---

## 3. Production Deployment Status Verdict

> [!IMPORTANT]
> **DEPLOYMENT UNVERIFIED (REQUIRES VM PROOF)**
> While the Docker configurations, production templates, deployment workflows, and rollback scripts are fully complete and syntactically validated in the repository, the actual VM execution logs, active container states, and SSL configurations cannot be validated locally. Verification of successful VM execution requires access to logs directly from the hosting VM handled by Alay.
