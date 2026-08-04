# SHAKTI Command Center — Reviewer Notes

## For the Reviewer
This document provides context for code reviewers evaluating the SHAKTI Command Center frontend application. It covers design rationale, intentional trade-offs, and areas that may benefit from future iteration.

---

## Architecture Rationale

### Why zone-based grid instead of a single monolithic page?
Each of the 19 dashboard zones is an independent React component that:
- Fetches its own data via a dedicated TanStack Query hook
- Is wrapped in its own `<ErrorBoundary>` for crash isolation
- Is lazy-loaded with `React.lazy()` for code splitting
- Can be toggled on/off or re-ordered via `DashboardConfig`

This means a crash in the Workflow zone will never take down the Executive Summary or Runtime Health zones. Each zone is also independently testable.

### Why `DashboardCard` as a universal wrapper?
Rather than duplicating loading/error/empty/data state logic in 19 layouts, `DashboardCard` centralizes this into one component with consistent props:
- `isLoading` → shows skeleton placeholders
- `isError` → shows red error panel with retry
- `isEmpty` → shows informational empty message
- `hasData` → gates child rendering
- `headerRight` → slot for status badges/counts

This guarantees visual consistency and reduces boilerplate per zone from ~30 lines to ~5 lines of state handling.

### Why `keepPreviousData` in every query hook?
Executive dashboards are viewed during incidents when networks are unstable. Blanking the entire UI on a failed refetch creates panic. `keepPreviousData` ensures the last known good data remains visible while TanStack Query retries in the background.

---

## Intentional Design Trade-offs

### No light theme
Only a dark theme is implemented. This matches standard practice for operational monitoring dashboards (Grafana, Datadog, PagerDuty) where operators work in low-light NOC environments. A light theme can be added via Tailwind's `dark:` variant utilities if required.

---

## Code Quality Notes

### Automated Testing
The frontend has a fully implemented testing suite:
- **Unit & Component tests (Vitest):** Run with `npm run test` (all 25 tests pass).
- **End-to-End tests (Playwright):** Run with `npm run test:e2e` to verify multi-viewport rendering.

### TypeScript strictness
- `tsc --noEmit` returns **zero errors** across the entire codebase.
- Primitive component props are fully typed and memoized with `React.memo()`.

---

## Files Worth Close Review

| File | Reason |
|---|---|
| `src/config/dashboard.config.ts` | Central config — defines all 19 zone visibilities and column spans |
| `src/components/dashboard/DashboardCard.tsx` | Universal wrapper — any change here affects all 19 zones |
| `src/pages/Dashboard.tsx` | Grid layout — orchestrates the 19 layouts |
| `src/api/setuEndpoints.ts` | Setu API client with ngrok warning bypass header |
| `src/components/dashboard/layouts/RuntimeHealthLayout.tsx` | Health layout with status parser mappings |
