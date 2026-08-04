# Runtime Validation

This document summarizes the validation of the SHAKTI Command Center frontend dashboard runtime states and integration mechanisms.

## 1. Live API Polling
The dashboard integrates real-time status checking using TanStack Query hooks. Data fetches are configured with automatic background polling intervals:
- **Critical Operations & Incidents (`GET /dashboard/operations`)**: Polling interval set to `5,000ms`.
- **System Health component logs (`GET /system/status`)**: Polling interval set to `5,000ms`.
- **Alert Feed statuses (`GET /dashboard/alerts`)**: Polling interval set to `5,000ms`.
- **Replay Sessions statuses (`GET /dashboard/runtime`)**: Polling interval set to `5,000ms`.
- **Metrics KPIs logs (`GET /metrics`)**: Polling interval set to `10,000ms`.
- **Telemetry signals (`GET /dashboard/telemetry`)**: Polling interval set to `10,000ms`.
- **Niyantran Sprints checklists (`GET /api/aims`)**: Polling interval set to `15,000ms`.

---

## 2. Loading State
When a card is in the loading state, the `DashboardCard` wrapper automatically intercepts rendering and displays uniform Tailwind CSS animate-pulse layout Skeletons. This ensures a clean initial load page skeleton.

---

## 3. Retry & Error Handling
If an API request fails:
- The card displays a red-tinted error message with a **Retry** button.
- Clicking the retry button triggers the React Query query refetch function.
- In case a single widget rendering crashes, the parent `<ErrorBoundary>` catches the react error locally, showing a "Reload Zone" action block without breaking the rest of the dashboard page.

---

## 4. Offline Handling & Caching
- **Network Lost**: The `useNetworkState` hook monitors connection states.
- **Visual Alert**: If connection drops, TanStack Query is configured with `keepPreviousData: true` which prevents the UI from blanking out.
- **Offline Banner**: A yellow warning banner is displayed at the top of the affected layouts warning the operator that the system is currently using cached data (Connection lost) and provides a retry mechanism.

---

## 5. Trace IDs
Every API response payload maps a `trace_id` property. When available:
- The trace ID is displayed inside the card footer (e.g. `Trace: 5fe155a8-4e89`).
- Hovering over chart data points inside the Telemetry card shows the associated trace ID in the hover tooltip.

---

## 6. Last Updated Timestamps
Each card footer displays an updated time indicator derived directly from the backend API `timestamp` property. The timestamp is converted to local time formatting to ensure accurate validation of data freshness.

---

## 7. Runtime Status
The card footer displays a status dot representing the connection status:
- **LIVE (Green)**: Queries are fresh and returning success payloads.
- **STALE (Amber)**: Queries are fetching new data, or the response could not be verified within the polling window.
- **OFFLINE (Red)**: The endpoint returned a network error, and no cache data is available.
