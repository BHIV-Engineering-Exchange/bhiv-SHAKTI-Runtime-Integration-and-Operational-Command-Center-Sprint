# Code Packet

This document serves as an index for developers onboarding onto the SHAKTI Dashboard Capability.

## Core File Index

### 1. Configuration & Layout
- `packages/dashboard-platform/src/config/` - The beating heart of the capability, extracted as reusable platform infrastructure (`DashboardProvider`, `useDashboardConfig`, the generic `DashboardConfig` contract).
- `src/types/dashboard.types.ts` - SHAKTI's concrete zone map, layered on top of the platform's generic config contract.
- `src/config/dashboard.config.ts` - SHAKTI's default config values (branding, zone labels, feature flags).
- `src/pages/Dashboard.tsx` - The CSS Grid root. Consumes the provider config and lazy-loads the 10 layout components.
- `src/layouts/DashboardLayout.tsx` - The global application shell, containing the Header and the offline state banner.

### 2. Layouts (Smart Components)
Located in `src/components/dashboard/layouts/`
These files are responsible for fetching data via React Query and memoizing it before passing it down.
- `ExecutiveLayout.tsx`
- `OperationsLayout.tsx`
- `DecisionIntelligenceLayout.tsx`
- `ObservabilityLayout.tsx`
- ...

### 3. Primitives (Dumb Components)
Located in `src/components/dashboard/primitives/`
These are purely presentational. They do not fetch data.
- `ExecutiveMetricCard.tsx`
- `TimelineCard.tsx`
- `CapabilityCard.tsx`

### 4. Utilities & Hooks
- `src/hooks/useQueries.ts` - All TanStack Query integrations.
- `src/api/client.ts` - The Axios instance with 8000ms timeouts and error interception.
- `src/utils/logger.ts` - Structured logging utility.
- `src/hooks/useAuth.ts` & `src/hooks/useAuthorization.ts` - Authentication and RBAC stubs.

## Developer Quick Start
To modify a specific zone:
1. Locate the Layout in `src/components/dashboard/layouts/`.
2. Do not add raw HTML/Tailwind here. If you need a new visual element, create a Primitive first in `src/components/dashboard/primitives/`.
3. Wrap your new Primitive inside the Layout's `<DashboardCard>`.
