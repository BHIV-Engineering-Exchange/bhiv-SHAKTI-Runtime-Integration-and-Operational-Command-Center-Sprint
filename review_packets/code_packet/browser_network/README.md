# Browser Network Verification

This document describes how to verify successful API network requests from the browser client during review testing.

## 1. Verifying Successful API Requests
Reviewers can monitor live network streams directly inside modern browser client inspector panels. To verify that requests are resolving cleanly:
1. Open the browser and navigate to the dashboard at `http://localhost:5173/`.
2. Press `F12` to open Developer Tools, and navigate to the **Network** tab.
3. Filter requests by selecting **Fetch/XHR**.
4. Confirm that the dashboard successfully queries endpoints every polling interval (ranging from 5 seconds to 15 seconds depending on the microservice).

---

## 2. Expected HTTP Statuses
The dashboard relies on multiple microservices. Each query must resolve with an expected HTTP status code of `200 OK`:

| Endpoint Query | Microservice | Expected Status | Polling Frequency |
|---|---|---|---|
| `/health` | Control Plane | `200 OK` | Every 10 seconds |
| `/system/status` | Control Plane | `200 OK` | Every 5 seconds |
| `/metrics` | Control Plane | `200 OK` | Every 10 seconds |
| `/dashboard/operations` | Control Plane | `200 OK` | Every 5 seconds |
| `/dashboard/alerts` | Control Plane | `200 OK` | Every 5 seconds |
| `/dashboard/runtime` | Control Plane | `200 OK` | Every 5 seconds |
| `/dashboard/telemetry` | Control Plane | `200 OK` | Every 10 seconds |
| `/projects` | Setu PMC | `200 OK` | Every 10 seconds |
| `/ranking` | Sanskar | `200 OK` | Every 10 seconds |
| `/api/aims` | Niyantran | `200 OK` | Every 15 seconds |
| `/intelligence/lineage` | Karma | `200 OK` | Every 10 seconds |
| `/bucket/artifacts` | Bucket Service | `200 OK` | Every 15 seconds |

---

## 3. How to Capture the Network Tab
1. Open the **Network** tab in DevTools and confirm the list is logging fetches.
2. Verify that the **Status** column shows `200` or `304` in green.
3. Take a screenshot of the DevTools panel including the request list to record complete validation proof.
