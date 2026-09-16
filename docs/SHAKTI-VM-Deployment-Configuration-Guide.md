# SHAKTI VM Deployment & Configuration Guide

## 1. Scope

* **Target Production Domain**: `https://niyantrankendra.blackholeinfiverse.com`
* **Certified Release Commit**: `ee77c3a3d12f46ec8013a2e5230a6b7d53824f90`
* **Target Environment**: Remote Linux VM Host (`~/SHAKTI`)
* **Document Status**: Authoritative Operational Deployment & Configuration Guide
* **Cross-Reference**: `docs/SHAKTI-Production-Certification-Report.md`

---

## 2. Prerequisites

The following software and environment variables are verified prerequisites for building and running the SHAKTI Command Center:

### Host & Build Tools
* **Git**: `>= 2.40`
* **Node.js**: `20.x LTS` (as defined in `Dockerfile` and `docs/DEPLOYMENT_GUIDE.md`)
* **npm**: `>= 10.x`
* **Docker Engine**: `>= 24.x` with Buildx support
* **Docker Compose**: `>= v2.20`
* **Linux VM Access**: SSH access to the remote production host with sudo privileges

### Required CI/CD Secrets (Secret Names Only)
The following secrets are required by `.github/workflows/cicd.yml`. In accordance with security policy, secret values are intentionally omitted:

* `DOCKER_USERNAME`: Docker Hub registry username
* `DOCKER_PASSWORD`: Docker Hub registry access token/password
* `VITE_NIYANTRAN_EXECUTION_KEY`: Required at build time; value intentionally omitted.
* `VITE_TANTRA_BRIDGE_SIGNATURE`: Required at build time; value intentionally omitted.
* `SHAKTI_ENV_FILE`: Production `.env` contents injected during deployment; value intentionally omitted.
* `VM_IP`: Remote production VM IP address
* `VM_PORT`: Remote production VM SSH port
* `VM_USERNAME`: SSH deployment user
* `VM_PASSWORD`: SSH deployment password

*(Note: `VITE_NIYANTRAN_AUTH_TOKEN` is NOT a required deployment secret; static build-time auth tokens were permanently removed in commit `b0b66751`.)*

---

## 3. Repository Checkout

To checkout the certified release:

```bash
# Clone the repository
git clone https://github.com/blackholeinfiverse145/SHAKTI-Runtime-Integration-and-Operational-Command-Center-Sprint.git
cd shakti-command-center

# Checkout the certified commit
git checkout ee77c3a3d12f46ec8013a2e5230a6b7d53824f90

# Verify branch and commit
git rev-parse HEAD
# Output must match: ee77c3a3d12f46ec8013a2e5230a6b7d53824f90
```

---

## 4. Environment Configuration

### Non-Secret Variables (`.env`)
The following environment variables configure proxy paths to eliminate HTTPS mixed-content restrictions in production browsers:

| Variable Name | Production Proxy Target | Scope / Classification |
| :--- | :--- | :--- |
| `VITE_CONTROL_PLANE_URL` | `"/api/control-plane"` | Non-secret build-time variable |
| `VITE_BUCKET_SERVICE_URL` | `"/api/bucket"` | Non-secret build-time variable |
| `VITE_PRANA_SERVICE_URL` | `"/api/prana"` | Non-secret build-time variable |
| `VITE_NIYANTRAN_URL` | `"https://niyantran.blackholeinfiverse.com"` | Non-secret build-time variable |
| `VITE_INSIGHTFLOW_URL` | `"/api/insightflow"` | Non-secret build-time variable |
| `VITE_TANTRA_BASE_URL` | `"/api/tantra"` | Non-secret build-time variable |
| `VITE_RAJYA_BASE_URL` | `"/api/rajya"` | Non-secret build-time variable |
| `VITE_SANSKAR_BASE_URL` | `"/api/sanskar"` | Non-secret build-time variable |
| `VITE_KARMA_URL` | `"/api/karma"` | Non-secret build-time variable |
| `VITE_KESHAV_URL` | `"/api/keshav"` | Non-secret build-time variable |
| `VITE_SETU_URL` | `"https://setu.blackholeinfiverse.com"` | Non-secret build-time variable |

### Sensitive Variables
* `VITE_NIYANTRAN_EXECUTION_KEY`: Required at deployment time; value intentionally omitted.
* `VITE_TANTRA_BRIDGE_SIGNATURE`: Required at deployment time; value intentionally omitted.

### Niyantran Authentication Contract (`b0b66751`)
* `VITE_NIYANTRAN_AUTH_TOKEN` is **NOT** a required deployment secret. Static build-time auth tokens were permanently removed in commit `b0b66751`.
* Public command-center views (`/api/dashboard/stats`, `/api/dashboard/leaderboard`) require zero operator authentication.
* Protected operational routes (`/api/aims`, `/api/tasks`, `/api/dashboard/merge-analysis`, `/api/dashboard/attendance-summary`) require an operator session token dynamically loaded from `localStorage.getItem("WorkflowToken")` and attached as `x-auth-token`.
* Service-to-service execution may use `x-execution-key` (from `VITE_NIYANTRAN_EXECUTION_KEY`) where explicitly required.

### Runtime vs. Build-Time Variables
* **Build-Time (`VITE_*`)**: Statically baked into the JavaScript bundle during `npm run build` or `docker buildx build`.
* **Runtime Tokens**: Loaded dynamically from browser storage (`localStorage.getItem("WorkflowToken")` and `localStorage.getItem("x-bridge-signature")`), ensuring static tokens are not stored in image layers.

---

## 5. Build Procedure

### Local / Host Bundle Build
```bash
# 1. Install dependencies
npm ci

# 2. Compile TypeScript and build production bundle
npm run build

# Output: Compiled static assets in ./dist
```

### Docker Production Image Build
The Docker image is built using Docker Buildx with sensitive build arguments passed via environment variables:

```bash
# Set short commit SHA
SHORT_SHA=$(git rev-parse --short=7 HEAD)

# Build and tag image
docker buildx build \
  --tag bhiv/shakti-dashboard:${SHORT_SHA} \
  --tag bhiv/shakti-dashboard:latest \
  --build-arg VITE_NIYANTRAN_EXECUTION_KEY="$VITE_NIYANTRAN_EXECUTION_KEY" \
  --build-arg VITE_TANTRA_BRIDGE_SIGNATURE="$VITE_TANTRA_BRIDGE_SIGNATURE" \
  -f Dockerfile .
```

---

## 6. Docker Runtime

The container packaging is defined in `Dockerfile`:

* **Multi-Stage Architecture**:
  * **Stage 1 (`build`)**: Uses `node:20-alpine`, runs `npm ci`, sets default `VITE_*` proxy paths, maps build args, and runs `npm run build`.
  * **Stage 2 (`runtime`)**: Uses `node:20-alpine`, installs `curl` (for health checks) and `serve` (Node static web server).
* **Non-Root Security**: Runs as unprivileged user `frontend`.
* **Exposed Port**: `5173` inside the container.
* **Runtime Command**:
  ```json
  CMD ["serve", "-s", "dist", "-l", "5173"]
  ```
  The `-s` flag enables Single Page Application (SPA) routing, rewriting non-asset 404 requests to `index.html`.

---

## 7. Production Network Routing

### Container Port Mapping
The container is deployed via `docker-compose.production.yml`:

```yaml
services:
  Shakti-dashboard:
    image: bhiv/shakti-dashboard:IMG_TAG
    restart: unless-stopped
    container_name: shakti-dashboard
    ports:
      - "5176:5173"
    networks:
      - shakti-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173"]
      interval: 10s
      timeout: 5s
      retries: 5
```
* Container listens on port `5173`.
* Host binds container to port `5176` (`5176:5173`).

### Host-Level Nginx (DevOps-Owned)
Nginx runs directly on the Linux VM host (managed via `systemd`), terminating TLS for `https://niyantrankendra.blackholeinfiverse.com`:

```
[Client Browser] ──(HTTPS :443)──► [Host Nginx]
                                        ├── /*               ──► http://127.0.0.1:5176 (SHAKTI SPA)
                                        ├── /api/control-plane/* ──► http://163.128.209.18:8120/*
                                        ├── /api/sanskar/*   ──► http://163.128.209.18:8018/*
                                        ├── /api/bucket/*    ──► http://163.128.209.18:8012/*
                                        ├── /api/prana/*     ──► http://163.128.209.18:8103/*
                                        ├── /api/insightflow/* ──► http://163.128.209.18:8122/*
                                        ├── /api/tantra/*    ──► http://163.128.209.18:3009/*
                                        ├── /api/rajya/*     ──► http://163.128.209.18:8015/*
                                        ├── /api/karma/*     ──► http://163.128.209.18:8102/*
                                        ├── /api/keshav/*    ──► http://163.128.209.18:5003/*
                                        └── /api/setu/*      ──► http://163.128.209.18:8014/*
```
* All `/api/<service>/*` location blocks strip the `/api/<service>` prefix before forwarding requests upstream.
* Development routes `/api/control-plane-8003` and `/api/control-plane-8009` are local developer mocks and are deliberately excluded from production.

---

## 8. Deployment Procedure

The automated deployment pipeline is executed by GitHub Actions (`.github/workflows/cicd.yml`):

### Pipeline Stages:
1. **Validate Job**:
   * Validates Compose template syntax with `docker compose config`.
2. **Build Job**:
   * Builds the Docker image with Buildx.
   * Tags with `${GITHUB_SHA::7}` and `latest`.
   * Pushes to Docker Hub.
3. **Deploy Job (SSH to VM)**:
   * Connects to VM via SSH (`sshpass`).
   * Working directory: `~/SHAKTI`.
   * Preserves persistent release history (`docs/RELEASE_HISTORY.md` and `/var/tmp/SHAKTI/RELEASE_HISTORY.md`).
   * Substitutes image tag:
     ```bash
     sed "s|IMG_TAG|${SHORT_SHA}|g" docker-compose.production.template.yml > docker-compose.production.yml
     ```
   * Pulls target image from Docker Hub:
     ```bash
     docker compose -f docker-compose.production.yml pull
     ```
   * Starts container:
     ```bash
     docker compose -f docker-compose.production.yml up -d --remove-orphans
     ```
   * Polls health loop on `http://localhost:5176` (up to 12 attempts x 10s = 120s).
   * Appends release record to `docs/RELEASE_HISTORY.md`.

---

## 9. Post-Deployment Verification

Execute the following commands on the VM and test workstation to verify deployment success:

### 1. Check Container Health
```bash
docker compose -f docker-compose.production.yml ps
```
*Expected*: Container `shakti-dashboard` status is `Up` and `healthy`.

### 2. Local Host HTTP Check
```bash
curl -sI http://localhost:5176 | head -n 5
```
*Expected*: `HTTP/1.1 200 OK`.

### 3. Container Logs
```bash
docker compose -f docker-compose.production.yml logs --tail=50
```
*Expected*: `Accepting connections at http://localhost:5173`.

### 4. Microservice Reverse Proxy Checks
Verify that host Nginx is successfully proxying to upstream microservices:
```bash
curl -sS http://localhost/api/control-plane/system/status | grep "status"
curl -sS http://localhost/api/prana/prana/system/health | grep "status"
curl -sS http://localhost/api/karma/health | grep "status"
curl -sS http://localhost/api/keshav/metrics/json | grep "requests"
curl -sS http://localhost/api/setu/health | grep "status"
```

---

## 10. Production Live E2E Verification

Production live verification must be executed using the opt-in `PRODUCTION_URL` environment variable:

```bash
# Run Playwright production live verification suite
$env:PRODUCTION_URL="https://niyantrankendra.blackholeinfiverse.com"
npx playwright test src/test/e2e/production-live.spec.ts
```

### Verified Test Assertions:
1. **1. Production Application Shell & Critical Mounting**:
   * Confirms `HTTP 200 OK` on root navigation.
   * Asserts `#root` mounts within 15 seconds.
   * Asserts `<header>` contains `"SHAKTI"`.
   * Asserts 0 fatal JavaScript page errors during initial boot.
2. **2. Production UI Surfaces & Layout Integrity**:
   * Scrolls through entire dashboard height.
   * Asserts all 8 core operational surfaces render their primary headings.
   * Asserts zero `ErrorBoundary` crash banners (`text="[Surface] Crashed"`).
3. **3. Production Network Layer & Representative API Observation**:
   * Asserts real `/api/` network requests are captured.
   * Asserts dominant `2xx` responses (>= 10 successful requests).
   * Asserts `2xx` responses have valid JSON content types.
   * Asserts `/api/control-plane/system/status` returned `200 OK`.
   * Asserts 0 `5xx` server errors across all observed calls.
4. **4. Karma Confidence & Reasoning Contract Observation**:
   * Verifies live `POST` contract for `/intelligence/confidence/{id}` and `/intelligence/reasoning/{id}`.
   * Confirms request method is strictly `POST`.
   * Confirms responses return `200 OK`.
   * Asserts JSON request body was sent.
   * Confirms trajectory gating (`enabled: !!trajectoryId`).

---

## 11. Restart Procedure

To restart the SHAKTI Command Center stack on the VM:

```bash
cd ~/SHAKTI
docker compose -f docker-compose.production.yml restart
```

To force recreation of the container:
```bash
cd ~/SHAKTI
docker compose -f docker-compose.production.yml up -d --force-recreate
```

---

## 12. Rollback Procedure

### Automated Rollback (GitHub Actions)
If the deployment health check fails during CI/CD, the `rollback` job triggers automatically:
1. It reads `docs/RELEASE_HISTORY.md` and extracts the last known healthy 7-character commit SHA (`SUCCESS` or `ROLLBACK_SUCCESS`).
2. It substitutes `IMG_TAG` with the last healthy tag.
3. It pulls the image and runs `docker compose up -d --remove-orphans`.
4. It waits up to 120s for `http://localhost:5176` to become healthy.
5. It logs `ROLLBACK_SUCCESS` to `docs/RELEASE_HISTORY.md`.

### Manual Rollback Procedure
If manual intervention is required on the production VM:

```bash
cd ~/SHAKTI

# 1. Identify previous healthy commit SHA from release history
tail -n 10 docs/RELEASE_HISTORY.md

# 2. Substitute the target healthy commit SHA (e.g. ee77c3a)
sed "s|IMG_TAG|<PREVIOUS_HEALTHY_SHA>|g" docker-compose.production.template.yml > docker-compose.production.yml

# 3. Pull and start previous image
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d --remove-orphans

# 4. Confirm health
curl -sf http://localhost:5176
```

---

## 13. Health Verification Matrix

| Target Service | Verification Endpoint | Expected Status |
| :--- | :--- | :---: |
| **Frontend Container** | `http://localhost:5176` | `200 OK` |
| **Control Plane** | `http://localhost/api/control-plane/health` | `200 OK` |
| **BUCKET** | `http://localhost/api/bucket/health` | `200 OK` |
| **PRANA** | `http://localhost/api/prana/health` | `200 OK` |
| **TANTRA** | `http://localhost/api/tantra/health` | `200 OK` |
| **RAJYA** | `http://localhost/api/rajya/health` | `200 OK` |
| **SANSKAR** | `http://localhost/api/sanskar/health` | `200 OK` |
| **InsightFlow** | `http://localhost/api/insightflow/health` | `200 OK` |
| **KARMA** | `http://localhost/api/karma/health` | `200 OK` |
| **KESHAV** | `http://localhost/api/keshav/health` | `200 OK` |
| **SETU** | `http://localhost/api/setu/health` | `200 OK` |
| **Niyantran** | `https://niyantran.blackholeinfiverse.com/api/dashboard/stats` | `200 OK` |

---

## 14. Known Production Limitations

The following non-2xx responses are documented operational boundaries and do not represent deployment failures:

1. **SANSKAR Secondary Routes**: `GET /api/sanskar/ranking` and `/trace/{id}` return `HTTP 404 Not Found`. Fallbacks in `DecisionIntelligenceLayout` and `EvidenceLayout` maintain normal operation.
2. **InsightFlow Secondary Routes**: `GET /api/insightflow/stage-metrics` and `/bucket/status` return `HTTP 404 Not Found`. Observability telemetry derives from PRANA logs, BUCKET metrics, and TANTRA telemetry.
3. **Niyantran Protected Routes**: Protected routes return `HTTP 401 Unauthorized` without an operator session. Public dashboard statistics (`/dashboard/stats`, `/dashboard/leaderboard`) return `200 OK`.

---

## 15. Security & Secret Handling

1. **Zero Committed Secrets**: Secrets, tokens, passwords, and private keys must never be committed to repository code or configuration templates.
2. **Deployment-Time Injection**: Secrets are injected strictly through GitHub Actions repository secrets or host environment files during deployment.
3. **Runtime Token Storage**: Session tokens for Niyantran operator authentication are stored in browser `localStorage` under `WorkflowToken` and are never embedded in Docker images or server files.
4. **Public Session Safety**: The public command-center monitoring session requires zero credentials, minimizing attack surface.

---

## 16. Troubleshooting Guide

| Symptom / Error | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **Container health check failing on 5176** | Static server failed to start or port collision | Run `docker compose logs` to inspect error output. Ensure host port 5176 is not bound by an orphaned container. |
| **Browser displays 502 Bad Gateway on `/api/*`** | Upstream microservice is offline or host Nginx proxy is misconfigured | Run `curl -sS http://163.128.209.18:<port>/health` directly from the VM to verify upstream reachability. Check host Nginx logs in `/var/log/nginx/error.log`. |
| **Mixed Content errors in browser console** | `VITE_*` URLs contain hardcoded `http://` schemes | Ensure `.env` specifies relative proxy paths (`/api/<service>`) rather than raw HTTP IP addresses. Rebuild the bundle. |
| **SANSKAR or InsightFlow returns 404** | Documented upstream secondary route limitation | Verify that the service `/health` endpoint returns 200 OK. Confirm UI handles 404 gracefully via documented fallbacks. |
| **Niyantran returns 401 Unauthorized** | Public unauthenticated session accessing protected routes | Normal behavior. If testing authenticated flows, ensure a valid token is set in `localStorage.setItem("WorkflowToken", "<token>")`. |
| **BUCKET reports `degraded` state** | Redis auxiliary queue or secondary storage metric delayed | Normal normalization behavior (`src/utils/healthStatus.ts`). Status will return to `operational` when backend metrics stabilize. |

---

## 17. Operational Ownership Matrix

| Responsibility Domain | Primary Owner | Scope |
| :--- | :--- | :--- |
| **SHAKTI Command Center** | SHAKTI Frontend Team | React codebase, Dockerfile, Compose template, API clients, health normalization, and E2E verification suites. |
| **VM Host Infrastructure** | DevOps Team | Linux OS maintenance, Docker daemon, host-level Nginx configuration, SSL/TLS certs, firewall rules, and CI/CD secrets. |
| **Microservice Backends** | Service Owning Teams | Individual microservices (Control Plane, BUCKET, PRANA, TANTRA, RAJYA, SANSKAR, InsightFlow, KARMA, KESHAV, SETU, Niyantran). |
