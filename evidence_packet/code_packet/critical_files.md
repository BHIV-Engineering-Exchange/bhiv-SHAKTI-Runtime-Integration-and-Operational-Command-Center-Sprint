# Code Packet: Critical Files

This document lists the 5 critical files along the primary execution paths of the SHAKTI Command Center dashboard.

---

## 1. [main.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/main.tsx)
*   **Path**: `src/main.tsx`
*   **Purpose**: The main application entry point that bootstraps the React application, sets up routing, and renders root DOM nodes.
*   **Runtime Impact**: Critical for app boot and provider registration.

## 2. [client.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/client.ts)
*   **Path**: `src/api/client.ts`
*   **Purpose**: Exports the Axios `apiClient` instance configured for the Control Plane backend. Attaches default headers and intercepts responses to unwrap request trace/correlation headers.
*   **Runtime Impact**: Intercepts and logs all Control Plane API communications.

## 3. [niyantranEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/niyantranEndpoints.ts)
*   **Path**: `src/api/niyantranEndpoints.ts`
*   **Purpose**: Contains the client connection logic for the Niyantran tracking backend, fetching attendance details, workload distributions, department stats, and developer velocities.
*   **Runtime Impact**: Supplies live data to the Engineering Capacity and Employee Execution zones.

## 4. [useQueries.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/hooks/useQueries.ts)
*   **Path**: `src/hooks/useQueries.ts`
*   **Purpose**: Orchestrates standard React Query hooks for fetching dashboard layouts, system states, and BHEX registries.
*   **Runtime Impact**: Provides caching, polling intervals, and error fallback policies for the dashboard components.

## 5. [EmployeeExecutionLayout.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/layouts/EmployeeExecutionLayout.tsx)
*   **Path**: `src/components/dashboard/layouts/EmployeeExecutionLayout.tsx`
*   **Purpose**: Displays the active developer list, clock-in times, worked hours, and current project contributions.
*   **Runtime Impact**: Main presentational element for the Employee Execution zone.
