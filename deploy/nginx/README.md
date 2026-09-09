# SHAKTI Command Center — Host-Level Nginx Deployment Guide

This directory contains the production Nginx location configuration fragment for the **SHAKTI Command Center**.

---

## 1. Architectural Overview & Responsibilities

```
[Client Browser]
       │
       ▼ (Port 80 / 443 with TLS)
[VM Host Nginx]
       ├── /api/control-plane/* ──► 163.128.209.18:8120/*  (Strips prefix)
       ├── /api/sanskar/*       ──► 163.128.209.18:8018/*  (Strips prefix)
       ├── /api/bucket/*        ──► 163.128.209.18:8012/*  (Strips prefix)
       ├── /api/prana/*         ──► 163.128.209.18:8103/*  (Strips prefix)
       ├── /api/insightflow/*   ──► 163.128.209.18:8122/*  (Strips prefix)
       ├── /api/tantra/*        ──► 163.128.209.18:3009/*  (Strips prefix)
       ├── /api/rajya/*         ──► 163.128.209.18:8015/*  (Strips prefix)
       ├── /api/karma/*         ──► 163.128.209.18:8102/*  (Strips prefix)
       ├── /api/keshav/*        ──► 163.128.209.18:5003/*  (Strips prefix)
       ├── /api/setu/*          ──► 163.128.209.18:8014/*  (Strips prefix)
       │
       └── / (SPA Fallback)     ──► 127.0.0.1:5176/*       (Docker Container: serve -s dist)
```

### Key Principles:
1. **Nginx Runs on VM Host**: Nginx is installed and managed directly on the Linux VM host (e.g. via `systemd` / `/etc/nginx/`).
2. **Not in Docker**: Nginx is **NOT** run as a Docker container, nor does SHAKTI modify Docker Compose to package Nginx.
3. **DevOps Ownership**: DevOps owns applying this configuration fragment, managing TLS certificates, domain names (`server_name`), firewall rules, and the Nginx service lifecycle.
4. **SHAKTI Docker Role**: The SHAKTI Docker container continues to serve the compiled frontend on host port `5176` (`5176:5173` mapping running `serve -s dist`).
5. **Prefix Stripping**: All `/api/<service>/` endpoints strip the `/api/<service>` prefix before forwarding upstream to microservices.
6. **Direct Niyantran**: Niyantran (`https://niyantran.blackholeinfiverse.com`) is accessed directly over HTTPS from client browsers and is **NOT** proxied through VM Nginx.
7. **Not a Full Installer**: The file `shakti-command-center.locations.conf` is a location fragment, not a full Nginx installation or root configuration.

---

## 2. Routing Contract Table

| Frontend Route | Upstream Target | Strips Prefix? | Purpose / Microservice |
|---|---|:---:|---|
| `/api/control-plane/*` | `http://163.128.209.18:8120/` | **YES** | System status, health, runtime metrics |
| `/api/sanskar/*` | `http://163.128.209.18:8018/` | **YES** | Decision traces, entity rankings |
| `/api/bucket/*` | `http://163.128.209.18:8012/` | **YES** | Storage stats, audit records, artifacts |
| `/api/prana/*` | `http://163.128.209.18:8103/` | **YES** | Lifecycle health, propagation logs |
| `/api/insightflow/*` | `http://163.128.209.18:8122/` | **YES** | Pipeline observability & stage metrics |
| `/api/tantra/*` | `http://163.128.209.18:3009/` | **YES** | Telemetry and system summaries |
| `/api/rajya/*` | `http://163.128.209.18:8015/` | **YES** | Text risk scoring & governance health |
| `/api/karma/*` | `http://163.128.209.18:8102/` | **YES** | Lineage graphs, hashes, analytics |
| `/api/keshav/*` | `http://163.128.209.18:5003/` | **YES** | Ingestion metrics, request distribution |
| `/api/setu/*` | `http://163.128.209.18:8014/` | **YES** | Project bridge, tasks, milestones |
| `/*` | `http://127.0.0.1:5176` | **NO** | Frontend SPA container (`dist/index.html`) |

*Excluded development routes: `/api/control-plane-8003` and `/api/control-plane-8009` are local developer mocks and are deliberately omitted from production.*

---

## 3. DevOps Deployment Instructions

### Step 1: Copy Location Fragment to VM
Copy `deploy/nginx/shakti-command-center.locations.conf` to the VM Nginx configuration directory (e.g. `/etc/nginx/snippets/` or `/etc/nginx/conf.d/`):

```bash
# Example copy to VM snippets directory
sudo cp deploy/nginx/shakti-command-center.locations.conf /etc/nginx/snippets/shakti-command-center.locations.conf
```

### Step 2: Include in Existing Server Block
In the existing host Nginx virtual host configuration (e.g. `/etc/nginx/sites-available/default` or `/etc/nginx/sites-available/shakti`), include the location fragment:

```nginx
server {
    listen 80;
    server_name shakti.internal; # Or authoritative domain name

    # Optional: TLS Configuration managed by DevOps
    # listen 443 ssl http2;
    # ssl_certificate /path/to/fullchain.pem;
    # ssl_certificate_key /path/to/privkey.pem;

    # Performance and body size
    client_max_body_size 50M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 60s;

    # Include SHAKTI Command Center location routes
    include /etc/nginx/snippets/shakti-command-center.locations.conf;
}
```

---

## 4. Verification & Smoke Testing (DevOps Execution)

After applying the configuration to the VM Nginx server, DevOps should run the following validation commands directly on the VM:

### 1. Test Nginx Configuration Syntax
```bash
sudo nginx -t
```
*Expected: `syntax is ok` and `test is successful`.*

### 2. Reload Nginx Service
```bash
sudo nginx -s reload
# or: sudo systemctl reload nginx
```

### 3. Application-Level API Smoke Tests
Run HTTP GET tests against the Nginx listening port on `localhost` (or domain) to verify reverse-proxy forwarding and prefix-stripping:

```bash
# 1. Frontend SPA Root
curl -sI http://localhost/ | head -n 5

# 2. Control Plane Health
curl -sS http://localhost/api/control-plane/health

# 3. Sanskar Health
curl -sS http://localhost/api/sanskar/health

# 4. Bucket Health
curl -sS http://localhost/api/bucket/health

# 5. Prana Health
curl -sS http://localhost/api/prana/health

# 6. InsightFlow Health
curl -sS http://localhost/api/insightflow/health

# 7. Tantra Health
curl -sS http://localhost/api/tantra/health

# 8. Rajya Health
curl -sS http://localhost/api/rajya/health

# 9. Karma Health
curl -sS http://localhost/api/karma/health

# 10. Keshav Health
curl -sS http://localhost/api/keshav/health

# 11. Setu Health
curl -sS http://localhost/api/setu/health
```

*(Note: Verify that responses return HTTP 200 with valid JSON payloads rather than HTML text).*
