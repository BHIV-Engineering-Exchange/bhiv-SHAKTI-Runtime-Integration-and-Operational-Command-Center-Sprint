# API Samples Verification

This directory contains instructions for reviewing backend API interactions consumed by the SHAKTI Command Center dashboard.

## 1. Endpoints Consumed
The frontend dashboard initiates requests to multiple backend services configured in the environment variables:
- **Control Plane API:** `/health`, `/system/status`, `/metrics`, `/dashboard/operations`, `/dashboard/alerts`, `/dashboard/runtime`, `/dashboard/telemetry`
- **Setu PMC API:** `/health`, `/ready`, `/projects`, `/projects/{id}/milestones`
- **Karma Analytics API:** `/health`, `/intelligence/lineage`
- **Niyantran Engine API:** `/api/aims`, `/api/dashboard/stats`, `/api/dashboard/leaderboard`, `/api/dashboard/history`
- **Bucket Service API:** `/health`, `/bucket/artifacts`, `/bucket/storage-stats`
- **InsightFlow API:** `/health`, `/stage-metrics`
- **Tantra API:** `/health`, `/telemetry/summary`
- **Sanskar API:** `/health`, `/ranking`

---

## 2. Retrieving Live Responses
To view live responses, ensure the relevant backend services (configured in your `.env`) are reachable. Open a browser or api client to query any of the endpoints, for example Setu projects:
- `<VITE_SETU_URL>/projects`
- `<VITE_CONTROL_PLANE_URL>/system/status`
- `<VITE_NIYANTRAN_URL>/api/aims`

---

## 3. How to Capture JSON Responses Using Chrome DevTools
1. Press `F12` or right-click the page and select **Inspect** to open Developer Tools.
2. Select the **Network** tab at the top.
3. Reload the dashboard (`Ctrl + R`) to force queries.
4. Set the Network filter to **Fetch/XHR**.
5. Select any of the request queries from the list (e.g. `projects`, `ranking`, `operations`).
6. Click the **Preview** or **Response** sub-tabs on the right panel to capture the exact JSON response payload returned by the server.
