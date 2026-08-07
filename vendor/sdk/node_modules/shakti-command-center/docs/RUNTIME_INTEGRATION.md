# Runtime Integration

The frontend operates completely decoupled from backend constraints, but it relies on a standardized set of Control Plane APIs to retrieve data.

## API Architecture
All API calls are brokered through an Axios instance (`src/api/client.ts`) and wrapped in TanStack React Query (`src/hooks/useQueries.ts`).

### The Axios Client
The client intercepts every response.
- **Timeout:** Hardcoded at 8000ms.
- **Error Interception:** 404, 503, and ECONNABORTED are caught and forwarded to the frontend `logger.ts`.
- **Global Error Handling:** Promise rejections are safely propagated back to React Query for retry logic.

### React Query Hooks
Every dashboard zone has a corresponding custom hook:
- `useExecutiveDashboard()` -> `GET /dashboard/executive`
- `useOperationsDashboard()` -> `GET /dashboard/operations`
- `useAlertsDashboard()` -> `GET /dashboard/alerts`
- `useRuntimeDashboard()` -> `GET /dashboard/runtime`
- `useTelemetryDashboard()` -> `GET /dashboard/telemetry`

### Resilience Mechanism (`keepPreviousData`)
All hooks are configured with `@tanstack/react-query`'s `placeholderData: keepPreviousData`. 
If a polling interval triggers and the backend is down, React Query will fail the request, but the hook will **continue returning the last cached `data` object**. The `isError` flag flips to true, allowing the UI to render an "Offline / Cached Data" warning without destroying the existing rendered components.
