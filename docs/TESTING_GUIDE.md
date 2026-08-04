# SHAKTI Command Center — Testing Guide

## Overview

This document describes how to test the SHAKTI Operational Command Center dashboard. The application is built with React 19, TypeScript 6, Vite 8, TanStack Query 5, Recharts 3, and Tailwind CSS 4. It connects to multiple microservice backends (Control Plane, Setu, Karma, Niyantran, Prana, etc.).

---

## 1. Environment Setup

### Prerequisites
- Node.js ≥ 20.x
- npm ≥ 10.x

### Install and Start
```bash
npm install
npm run dev          # Dev server on http://localhost:5173
npm run build        # Production build (tsc -b && vite build)
npm run preview      # Preview production build
npm run lint         # ESLint checks
```

### Type Checking
```bash
npx tsc --noEmit     # Full TypeScript compile check (zero errors expected)
```

---

## 2. Automated Test Suite

The project includes unit, component, and E2E test scripts configured in `package.json`:

- **Unit/Component Testing (Vitest + React Testing Library):**
  - Run once: `npm run test`
  - Interactive mode: `npm run test:watch`
  - *Covers*: `ErrorBoundary.test.tsx`, `DashboardCard.test.tsx`, `layouts.test.tsx`, `DecisionIntelligenceLayout.test.tsx`, and `integration.test.tsx`.

- **End-to-End Testing (Playwright):**
  - Pre-requisites: `npx playwright install chromium`
  - Start local server (`npm run dev`) and run in a separate terminal: `npm run test:e2e`
  - *Covers*: Rendering integrity, widget presence, and viewport responsiveness (desktop grid vs mobile stack).

---

## 3. Component-Level Testing

### Primitives (`src/components/dashboard/primitives/`)

Each primitive is a stateless, memoized card component that renders based on props:

| Primitive | Key Props to Test | Expected Behavior |
|---|---|---|
| `ExecutiveMetricCard` | `value`, `trend`, `unit`, `variant` | Primary variant renders 30px value; compact variant renders 20px value |
| `AlertCard` | `severity`, `acknowledged` | Critical shows red icon/border; acknowledged reduces opacity to 50% |
| `StatusCard` | `severity`, `progress`, `statusTheme` | Progress bar color matches theme; priority dot matches severity |
| `DecisionCard` | `status`, `isAutomated` | Executed shows green shield; rejected shows red alert icon |
| `CapabilityCard` | `status`, `isEngaged` | Engaged shows pulsing indigo indicator and indigo border |
| `OperatorCard` | `status`, `taskCount` | Status dot color changes; task count badge appears when > 0 |
| `TelemetryCard` | `data`, `series`, `summaryMetrics` | Chart renders monotone area fills; empty state shows "No telemetry data" |
| `IntegrationCard` | `status`, `latency` | Connected shows green; disconnected shows red |
| `TimelineCard` | `severity`, `isLast` | Timeline connector line hidden when `isLast=true` |
| `APIHealthCard` | `uptime`, `errorRate`, `latency` | Uptime ≥ 99.9% renders green; error rate > 1% renders red |
| `ReplayCard` | `status`, `progress` | Renders simulation progress and operational states |
| `CapabilityGraphVisualizer`| `lineageData` | Renders SVG capability node dependency lineage maps |

---

## 4. Layout-Level Testing

### Data Flow Verification

Each layout fetches data through a dedicated TanStack Query hook matching specific API endpoints:

| Layout | Hook | API Endpoint | Refetch Interval |
|---|---|---|---|
| `ExecutiveLayout` | `useSystemStatus`, `useSetuProjects` | `/system/status`, `/projects` | 5s / 10s |
| `OperationsLayout` | `useOperationsDashboard` | `/dashboard/operations` | 5s |
| `IntegrationLayout` | `useAlertsDashboard` | `/dashboard/alerts` | 5s |
| `DecisionIntelligenceLayout` | `useSanskarRanking`, `useKarmaConfidence` | `/ranking`, `/intelligence/confidence/{id}` | 10s / 15s |
| `ObservabilityLayout` | `useTelemetryDashboard`, `useKarmaTrends` | `/dashboard/telemetry`, `/api/v1/analytics/karma_trends` | 10s |
| `WorkflowLayout` | `useSetuProjects` | `/projects` | 10s |
| `OperatorConsoleLayout` | `useAlertsDashboard` | `/dashboard/alerts` | 5s |
| `RuntimeHealthLayout` | `useSystemStatus`, `usePranaHealth` | `/system/status`, `/health` (per service) | 5s |
| `ReplayLayout` | `useRuntimeDashboard` | `/dashboard/runtime` | 5s |
| `EvidenceLayout` | `useBucketArtifacts` | `/bucket/artifacts` | 15s |

### State Rendering Verification

Every layout wraps content in `<DashboardCard>`, which handles five states:

1. **Loading** — Skeleton placeholders are displayed
2. **Error** — Red error panel with "Retry" button
3. **Empty** — Informational empty state message
4. **Data** — Normal rendered content
5. **Stale** — Previous data preserved via `keepPreviousData`

---

## 5. Resilience Testing (Chaos Engineering)

### Test 1: API Timeout
1. Start the dashboard with `npm run dev`.
2. In Chrome DevTools → Network tab, throttle to "Slow 3G" or block backend endpoints.
3. **Expected:** Client timeout triggers. `<DashboardCard>` shows the red error state. App does not crash.

### Test 2: Mid-Session Network Loss
1. Let the dashboard load successfully with live data.
2. Disconnect internet (or toggle Offline in DevTools).
3. **Expected:** The `useNetworkState` hook triggers. A red "System Offline" banner drops from the header. Layouts continue showing the last cached data via `keepPreviousData`.

### Test 3: Zone-Level Crash
1. Temporarily inject `throw new Error("test")` inside any layout (e.g., `WorkflowLayout.tsx`).
2. **Expected:** Only the affected zone crashes with the localized `<ErrorBoundary>` fallback ("Zone Crashed" + "Reload Zone" button). All other zones continue updating normally.
