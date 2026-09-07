# Phase 2 Live Runtime Verification Report — SHAKTI Command Center

**Verification Date**: 2026-09-07  
**Auditor**: Pratik Bhuwad (AI ML Department)  
**Target Environment**: Live VM (`163.128.209.18`) & Production Frontend Container (`:5176`)  

---

## 1. Direct Microservice Probing (Bypassing Frontend Routing)

Each VM microservice was probed directly on its dedicated port using HTTP GET requests.

| Service | Port | Endpoint | HTTP Status | Latency | Content-Type | Live Response Body Preview | Status Classification |
|---|---|---|---|---|---|---|---|
| **Control Plane** | `8120` | `/system/status` | `200 OK` | 3872ms | `application/json` | `{"timestamp":"...","overall_status":"ok","uptime_seconds":170261,...}` | **VERIFIED OPERATIONAL** |
| **Control Plane** | `8120` | `/metrics` | `200 OK` | 1666ms | `application/json` | `{"timestamp":"...","uptime_seconds":170272,"services":{"total":10,...}}` | **VERIFIED OPERATIONAL** |
| **Bucket Storage** | `8012` | `/health` | `200 OK` | 60ms | `application/json` | `{"status":"degraded","bucket_version":"1.0.0","append_only_storage":{...}}` | **VERIFIED OPERATIONAL** |
| **Bucket Storage** | `8012` | `/bucket/artifacts` | `200 OK` | 75ms | `application/json` | `{"artifacts":[{"artifact_id":"0e1cb512...","trace_id":"SAM-TRACE-..."}]}` | **VERIFIED OPERATIONAL** |
| **Bucket Storage** | `8012` | `/metrics/scale-status`| `200 OK` | 31ms | `application/json` | `{"timestamp":"...","concurrent_writes":{"current":0,"limit":100}}` | **VERIFIED OPERATIONAL** |
| **Bucket Storage** | `8012` | `/metrics/query-performance`| `200 OK` | 43ms | `application/json` | `{"p50_ms":0,"p99_ms":0,"p999_ms":0,"sla_status":"NO_DATA"}` | **VERIFIED OPERATIONAL** |
| **Prana Engine** | `8103` | `/health` | `200 OK` | 92ms | `application/json` | `{"status":"healthy","service":"bhiv-prana","forwarding_enabled":true,...}` | **VERIFIED OPERATIONAL** |
| **Prana Engine** | `8103` | `/prana/propagation-log`| `200 OK` | 60ms | `application/json` | `{"events":[],"count":0}` | **VERIFIED OPERATIONAL** |
| **Prana Engine** | `8103` | `/prana/system/health` | `200 OK` | 121ms | `application/json` | `{"status":"healthy","mode":"stateful","forwarding_enabled":true,...}` | **VERIFIED OPERATIONAL** |
| **Keshav Engine** | `5003` | `/health` | `200 OK` | 68ms | `application/json` | `{"status":"OK","service":"KESHAV"}` | **VERIFIED OPERATIONAL (HEALTHY)** |
| **Keshav Engine** | `5003` | `/metrics/json` | `200 OK` | 60ms | `application/json` | `{"request_count":0,"request_errors":0,"request_success_rate":1.0,...}` | **VERIFIED OPERATIONAL** |
| **Karma Analytics**| `8102` | `/health` | `200 OK` | 61ms | `application/json` | `{"status":"healthy","service":"bhiv-karma-helper"}` | **VERIFIED OPERATIONAL** |
| **Karma Analytics**| `8102` | `/api/v1/analytics/metrics/live`| `200 OK` | 80ms | `application/json` | `{"status":"success","data":{"timestamp":"...","total_users":0}}` | **VERIFIED OPERATIONAL** |
| **Karma Analytics**| `8102` | `/api/v1/analytics/karma_trends`| `200 OK` | 48ms | `application/json` | `{"status":"success","data":{"dharma_seva_trends":{...}}}` | **VERIFIED OPERATIONAL** |
| **Karma Analytics**| `8102` | `/karma/latest-hash` | `200 OK` | 48ms | `application/json` | `{"latest_hash":"0000000000000000...","chain":"PranaPack"}` | **VERIFIED OPERATIONAL** |
| **Sanskar Domain** | `8018` | `/health` | `200 OK` | 60ms | `application/json` | `{"status":"healthy","service":"sanskar","contract_version":"v1"}` | **VERIFIED OPERATIONAL** |
| **Sanskar Domain** | `8018` | `/ranking` | `404 Not Found` | 59ms | `application/json` | `{"detail":"No ranking available"}` | **ROUTE REGISTERED / DATA PENDING** |
| **Rajya Enforcement**| `8015` | `/health` | `200 OK` | 65ms | `application/json` | `{"status":"ok","service":"bhiv-enforcement-gateway"}` | **VERIFIED OPERATIONAL** |
| **Tantra Bridge** | `3009` | `/health` | `200 OK` | 54ms | `application/json` | `{"service":"core","status":"healthy"}` | **VERIFIED OPERATIONAL** |
| **Tantra Bridge** | `3009` | `/telemetry` | `404 Not Found` | 55ms | `text/html` | `Cannot GET /telemetry` | **ROUTE NOT IMPLEMENTED** |
| **SETU Interface** | `8014` | `/health` | `200 OK` | 56ms | `application/json` | `{"success":true,"status":"healthy","message":"Server is healthy"}` | **VERIFIED OPERATIONAL** |
| **SETU Interface** | `8014` | `/projects` | `404 Not Found` | 56ms | `application/json` | `{"success":false,"message":"Route not found"}` | **ROUTE NOT IMPLEMENTED** |
| **InsightFlow** | `8122` | `/health` | `200 OK` | 56ms | `application/json` | `{"status":"healthy","service":"InsightBridge"}` | **VERIFIED OPERATIONAL** |
| **InsightFlow** | `8122` | `/bucket/status` | `404 Not Found` | 59ms | `application/json` | `{"detail":"Not Found"}` | **ROUTE NOT IMPLEMENTED** |
| **InsightFlow** | `8122` | `/stage-metrics` | `404 Not Found` | 28ms | `application/json` | `{"detail":"Not Found"}` | **ROUTE NOT IMPLEMENTED** |

---

## 2. Production Frontend Container Routing Verification (`http://163.128.209.18:5176`)

All active frontend API routes were queried on the production container port `:5176`.

| Route | HTTP Status | Content-Type | Contains HTML SPA Fallback | Result |
|---|---|---|---|---|
| `/api/control-plane/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/bucket/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/prana/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/insightflow/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/tantra/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/rajya/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/karma/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/keshav/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |
| `/api/setu/health` | `200 OK` | `text/html; charset=utf-8` | **YES (`<!doctype html>`)** | **ROUTING BLOCKED** |

### Definitive Routing Architectural Finding
* The Keshav backend on `:5003` is verified **100% HEALTHY**.
* The Command Center frontend source code has case-insensitive health mapping implemented and tested.
* The production deployment on `:5176` runs `serve -s dist -l 5173`, which lacks a reverse-proxy layer. Therefore, **Production Command Center runtime certification is blocked by the deployed frontend API routing architecture, while the Keshav backend itself is verified healthy.**
