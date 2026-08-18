# SHAKTI Production Runtime Integration Verification
Date: 2026-08-13
Environment: Production
Method: Read-only HTTP verification

## Executive Summary
This report summarizes the production runtime verification of the 10 core integrated backend services in the SHAKTI Command Center. 

A fresh read-only verification was completed on **2026-08-13**. The verification reveals:
- **2 Services (BHIV Prana and Tantra)** are fully operational (**PASS**).
- **1 Service (Keshav)** is partially operational, with the metrics endpoint resolving successfully while the health endpoint times out (**PARTIALLY RESOLVED**).
- **5 Services (InsightFlow, Rajya, Karma, BHIV Bucket, and Setu)** are currently failing or unreachable (**FAIL**).
- **2 Services (Sanskar and Control Plane)** are configured to point to localhost endpoints which are currently offline in the repository's configuration (**BLOCKED**).

Compared with the historical baseline from the **Aug 11** audit, the Niyantran service outage has been resolved, but BHIV Bucket remains down (503), Karma's intelligence lineage endpoint continues to fail (500), Setu's ngrok tunnel continues to return 404, and local service integrations (Sanskar and Control Plane) remain blocked. Furthermore, Rajya and InsightFlow, which were previously operational, now exhibit network timeouts.

## Verification Method
Verification was conducted via a Node.js fetch script executing from the terminal workspace. The script loaded service base URLs from the active [.env](file:///c:/Pratik_Bhuwad/shakti-command-center/.env) file and performed HTTP GET requests. Timeouts were capped at 15 seconds per request. Custom bypass headers (`ngrok-skip-browser-warning: true`) were appended for ngrok endpoints, and authorization signatures (for Tantra) were populated internally while keeping all credentials masked in logs.

## Service Results

| Service | Endpoint | Status | Latency | Result | Notes |
|---|---|---:|---:|---|---|
| **BHIV Prana** | `/health` | `200` | 117 ms | PASS | Healthy |
| **BHIV Prana** | `/prana/propagation-log` | `200` | 66 ms | PASS | Retrieved propagation logs |
| **InsightFlow** | `/health` | `TIMEOUT` | 15014 ms | FAIL | Timeout (Render cold start or offline) |
| **InsightFlow** | `/stage-metrics` | `TIMEOUT` | 15006 ms | FAIL | Timeout |
| **Tantra** | `/health` | `200` | 12362 ms | PASS | Healthy (Render cold start recovery) |
| **Rajya** | `/health` | `TIMEOUT` | 15012 ms | FAIL | Timeout (Render cold start or offline) |
| **Keshav** | `/health` | `TIMEOUT` | 15013 ms | FAIL | Initial health request timed out |
| **Keshav** | `/metrics/json` | `200` | 7623 ms | PASS | Resolved metrics dashboard data |
| **Karma** | `/health` | `200` | 60 ms | PASS | Basic service reachability operational |
| **Karma** | `/intelligence/lineage` | `500` | 5327 ms | FAIL | Internal Server Error |
| **BHIV Bucket** | `/health` | `503` | 287 ms | FAIL | Service Unavailable |
| **BHIV Bucket** | `/bucket/storage-stats` | `503` | 735 ms | FAIL | Service Unavailable |
| **Setu** | `/api/v1/health` | `404` | 49 ms | FAIL | Ngrok tunnel returned 404 |
| **Setu** | `/api/v1/ready` | `404` | 18 ms | FAIL | Ngrok tunnel returned 404 |
| **Sanskar** | `/health` | `ERROR` | 1 ms | BLOCKED | Localhost offline (Connection refused) |
| **Control Plane** | `/health` | `ERROR` | 1 ms | BLOCKED | Localhost offline (Connection refused) |

## Detailed Results

### BHIV Prana
- **Base URL**: `http://163.128.209.18:8103`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `200 OK`
- **Latency**: 117 ms
- **Content-Type**: `application/json`
- **Safe Response Summary**: `JSON Object with keys: [status, service, forwarding_enabled, mongodb]`
- **PASS/FAIL/BLOCKED**: PASS
- **Evidence Timestamp**: `2026-08-13T05:50:52.099Z`

- **Endpoint**: `/prana/propagation-log`
- **HTTP Method**: GET
- **Status**: `200 OK`
- **Latency**: 66 ms
- **Content-Type**: `application/json`
- **Safe Response Summary**: `JSON Object with keys: [events, count]`
- **PASS/FAIL/BLOCKED**: PASS
- **Evidence Timestamp**: `2026-08-13T05:50:52.219Z`

### InsightFlow
- **Base URL**: `https://bhiv-svacs.onrender.com`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `TIMEOUT`
- **Latency**: 15014 ms
- **Content-Type**: `N/A`
- **Safe Response Summary**: `Network Error: This operation was aborted`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:50:52.286Z`

- **Endpoint**: `/stage-metrics`
- **HTTP Method**: GET
- **Status**: `TIMEOUT`
- **Latency**: 15006 ms
- **Content-Type**: `N/A`
- **Safe Response Summary**: `Network Error: This operation was aborted`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:51:07.300Z`

### Tantra
- **Base URL**: `https://tantra-gated-bridge-infrastructure.onrender.com`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `200 OK`
- **Latency**: 12362 ms
- **Content-Type**: `application/json; charset=utf-8`
- **Safe Response Summary**: `JSON Object with keys: [service, status, algorithms]`
- **PASS/FAIL/BLOCKED**: PASS
- **Authentication**: Yes (Bearer token attached, verified internally, credentials masked as `[REDACTED]`)
- **Evidence Timestamp**: `2026-08-13T05:51:22.307Z`

### Rajya
- **Base URL**: `https://text-risk-scoring-service.onrender.com`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `TIMEOUT`
- **Latency**: 15012 ms
- **Content-Type**: `N/A`
- **Safe Response Summary**: `Network Error: This operation was aborted`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:51:34.670Z`

### Keshav
- **Base URL**: `https://keshav-cia7.onrender.com`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `TIMEOUT`
- **Latency**: 15013 ms
- **Content-Type**: `N/A`
- **Safe Response Summary**: `Network Error: This operation was aborted`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:51:49.682Z`

- **Endpoint**: `/metrics/json`
- **HTTP Method**: GET
- **Status**: `200 OK`
- **Latency**: 7623 ms
- **Content-Type**: `application/json`
- **Safe Response Summary**: `JSON Object with keys: [request_count, request_errors, request_success_rate, avg_latency_seconds, p95_latency_seconds, p99_latency_seconds, severity_distribution, unique_traces_processed]`
- **PASS/FAIL/BLOCKED**: PASS
- **Evidence Timestamp**: `2026-08-13T05:52:04.695Z`

### Karma
- **Base URL**: `http://163.128.209.18:8102`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `200 OK`
- **Latency**: 60 ms
- **Content-Type**: `application/json`
- **Safe Response Summary**: `JSON Object with keys: [status, service]`
- **PASS/FAIL/BLOCKED**: PASS
- **Evidence Timestamp**: `2026-08-13T05:52:12.318Z`

- **Endpoint**: `/intelligence/lineage`
- **HTTP Method**: GET
- **Status**: `500 Internal Server Error`
- **Latency**: 5327 ms
- **Content-Type**: `text/plain; charset=utf-8`
- **Safe Response Summary**: `Text/HTML response, length: 21 chars. Snippet: Internal Server Error`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:52:12.378Z`

### BHIV Bucket
- **Base URL**: `https://bhiv-bucket-i1l6.onrender.com`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `503 Service Unavailable`
- **Latency**: 287 ms
- **Content-Type**: `text/html; charset=utf-8`
- **Safe Response Summary**: `Text/HTML response, length: 256 chars. Snippet: <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:52:17.706Z`

- **Endpoint**: `/bucket/storage-stats`
- **HTTP Method**: GET
- **Status**: `503 Service Unavailable`
- **Latency**: 735 ms
- **Content-Type**: `text/html; charset=utf-8`
- **Safe Response Summary**: `Text/HTML response, length: 256 chars. Snippet: <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:52:17.993Z`

### Setu
- **Base URL**: `https://f12f-2409-40c2-1036-1957-5840-48d5-a6b3-98ab.ngrok-free.app`
- **Endpoint**: `/api/v1/health`
- **HTTP Method**: GET
- **Status**: `404 Not Found`
- **Latency**: 49 ms
- **Content-Type**: `text/html`
- **Safe Response Summary**: `Text/HTML response, length: 2410 chars. Snippet: <!DOCTYPE html> <html class="h-full" lang="en-US" dir="ltr"> <head> <meta charset="utf-8">`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:52:18.728Z`

- **Endpoint**: `/api/v1/ready`
- **HTTP Method**: GET
- **Status**: `404 Not Found`
- **Latency**: 18 ms
- **Content-Type**: `text/html`
- **Safe Response Summary**: `Text/HTML response, length: 2410 chars. Snippet: <!DOCTYPE html> <html class="h-full" lang="en-US" dir="ltr"> <head> <meta charset="utf-8">`
- **PASS/FAIL/BLOCKED**: FAIL
- **Evidence Timestamp**: `2026-08-13T05:52:18.778Z`

### Sanskar
- **Base URL**: `http://localhost:8000`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `ERROR`
- **Latency**: 1 ms
- **Content-Type**: `N/A`
- **Safe Response Summary**: `Network Error: fetch failed`
- **PASS/FAIL/BLOCKED**: BLOCKED (Service is configured to look locally and the local service is offline)
- **Evidence Timestamp**: `2026-08-13T05:52:18.797Z`

### Control Plane
- **Base URL**: `http://127.0.0.1:8009`
- **Endpoint**: `/health`
- **HTTP Method**: GET
- **Status**: `ERROR`
- **Latency**: 1 ms
- **Content-Type**: `N/A`
- **Safe Response Summary**: `Network Error: fetch failed`
- **PASS/FAIL/BLOCKED**: BLOCKED (Service is configured to look locally and the local service is offline)
- **Evidence Timestamp**: `2026-08-13T05:52:18.798Z`

## Historical Comparison
The following table details the status transition of the services from the August 11 baseline to the current August 13 retest:

| Service / Endpoint | Aug 11 Status | Current Status | Status Verdict |
|---|---|---|---|
| **Niyantran (`/api/aims`)** | `504` | `200` | RESOLVED |
| **Niyantran (`/api/aims/with-progress`)** | `200` | `200` | UNCHANGED (PASS) |
| **Niyantran (`/api/dashboard/stats`)** | `200` | `200` | UNCHANGED (PASS) |
| **BHIV Prana (`/health`)** | `200` | `200` | UNCHANGED (PASS) |
| **InsightFlow (`/health`)** | `200` | `TIMEOUT` | DEGRADED (FAIL) |
| **Tantra (`/health`)** | `200` | `200` | UNCHANGED (PASS) |
| **Rajya (`/health`)** | `200` | `TIMEOUT` | DEGRADED (FAIL) |
| **Keshav (`/health`)** | `200` | `TIMEOUT` | DEGRADED (FAIL) |
| **Keshav (`/metrics/json`)** | `200` | `200` | UNCHANGED (PASS) |
| **Karma (`/health`)** | `200` | `200` | UNCHANGED (PASS) |
| **Karma (`/intelligence/lineage`)** | `500` | `500` | STILL FAILING |
| **BHIV Bucket (`/health`)** | `503` | `503` | STILL FAILING |
| **Setu (`/api/v1/health`)** | `404` | `404` | STILL FAILING |
| **Sanskar (`/health`)** | `Offline` | `Offline` | STILL BLOCKED |
| **Control Plane (`/health`)** | `Offline` | `Offline` | STILL BLOCKED |

## Active Blockers
- **BHIV Bucket Outage**: The bucket service continues to return `503 Service Unavailable` on both `/health` and storage stats endpoints, blocking storage metrics and Merkle check capabilities.
- **Karma Intelligence Failure**: While basic connectivity returns `200 OK` on health, the `/intelligence/lineage` endpoint returns `500 Internal Server Error`, indicating a server-side analytics crash.
- **Setu ngrok Tunnel closed/misconfigured**: The ngrok URL returns `404 Not Found` for the `/api/v1/health` and `/api/v1/ready` endpoints, blocking integration with project and milestone services.
- **InsightFlow Timeout**: The service timed out (`15000+ ms` latency), indicating it is either offline or failed to wake up.
- **Rajya Timeout**: The text-risk-scoring-service timed out, blocking contract health checks.
- **Keshav Health Timeout**: The trace compliance health endpoint timed out.
- **Local Service Integrations**: Sanskar (`http://localhost:8000`) and Control Plane (`http://127.0.0.1:8009`) remain down.

## Verified Integrations
The following service integrations are proven healthy and functional:
- **Niyantran** (Verified separately on 2026-08-13)
- **BHIV Prana**
- **Tantra**
- **Keshav** (Metrics endpoint `/metrics/json` only)
- **Karma** (Health check endpoint `/health` only)

## Limitations
- **Control Plane & Sanskar**: Configured to look locally (`localhost`). Production verification could not be done as local servers are offline.
- **InsightFlow & Rajya**: Exhibited HTTP network timeouts (15s limit), preventing complete payload checks.
- **Credentials Masking**: Tantra authentication (Bearer signature) and Niyantran tokens were evaluated internally but masked in logs to preserve security.
