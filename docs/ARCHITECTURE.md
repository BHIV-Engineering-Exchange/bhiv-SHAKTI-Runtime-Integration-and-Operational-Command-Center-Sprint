# Architecture

## 1. System Topology
The SHAKTI Executive Dashboard is a standalone Frontend Single Page Application (SPA) built on React 19. It acts as a passive consumer of multiple external microservices (Control Plane, Karma, Setu, Niyantran, Prana, Replay, Bucket, InsightFlow, Rajya, Tantra, Sanskar, Keshav).

## 2. The Golden Rule of Architecture
**"Primitive -> Layout -> Dashboard Grid"**
We do not build monolithic zone components. We assemble decoupled layers.

### Layer 1: Primitives (`src/components/dashboard/primitives/`)
Dumb, stateless presentation components. They know nothing about APIs or layouts.
*Example: `ExecutiveMetricCard.tsx`, `StatusCard.tsx`, `TelemetryCard.tsx`*

### Layer 2: Reusable Wrappers (`src/components/dashboard/DashboardCard.tsx`)
A standardized container that provides uniform padding, titles, Error Boundaries, loading skeletons, and graceful degradation (stale data warnings). All layouts MUST wrap their content in a `DashboardCard`.

### Layer 3: Layouts (`src/components/dashboard/layouts/`)
Smart components that integrate React Query hooks. They fetch data, use `useMemo` to map data into Primitive props, and render the Primitives inside a `DashboardCard`.
*Example: `ExecutiveLayout.tsx` calls `useSetuProjects()` and `useSystemStatus()`*

### Layer 4: The Grid (`src/pages/Dashboard.tsx`)
The root orchestrator. It uses `React.lazy` and `Suspense` to code-split the Layouts. It consumes the `DashboardProvider` configuration to decide which layouts to render and what CSS grid span to apply.

## 3. Resilience Architecture
- **Error Boundaries:** Every single Layout inside the Grid is wrapped in a discrete `<ErrorBoundary>`. If `WorkflowLayout` crashes due to malformed API data, only that zone crashes. The rest of the dashboard remains operational.
- **Graceful Degradation:** React Query is configured globally with `placeholderData: keepPreviousData`. If a query fails in the background (e.g. backend goes offline), the UI does not blank out. It retains the cached data and `DashboardCard` displays an offline warning.
- **Timeouts & Backoff:** Axios clients enforce custom request timeouts per backend service (ranging from 10,000ms for Setu/Keshav to 30,000ms for Tantra/Rajya to handle Render cold starts, up to 300,000ms for heavy Control Plane calls). React Query utilizes exponential backoff for up to 3 retries.

## 4. Performance Optimizations
- **Code Splitting:** All 19 Layouts are lazy-loaded.
- **Memoization:** Expensive data mapping inside Layouts is wrapped in `useMemo` strictly tied to data dependencies.
- **Observability:** Custom `logger.ts` intercepts critical path metrics.
