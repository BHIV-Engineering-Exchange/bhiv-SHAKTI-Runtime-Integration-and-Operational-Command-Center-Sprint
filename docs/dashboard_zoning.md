# Dashboard Zoning

## 1. Purpose
This document defines the physical layout, grid positioning, and information priority of every zone in the SHAKTI Command Center dashboard.

Dashboard zoning establishes how operational information is organized on screen, ensuring that users achieve situational awareness with minimal cognitive effort and minimal scrolling. The strategy follows an **importance-first** approach: the most operationally critical information occupies the highest visual position and the largest screen real estate.

---

## 2. Design Goals
- **Immediate Awareness:** Executive Summary and Grid Status are in Row 1 and Row 2.
- **Consistent Spacing:** `gap-2` (8px) uniform grid gap throughout.
- **Responsive across breakpoints:** 12-column grid collapses gracefully to tablet and mobile.

---

## 3. Dashboard Grid Structure
The dashboard uses a **12-column CSS Grid** rendered inside `src/pages/Dashboard.tsx` with the following physical zone positions:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                   Executive Summary (col-span-12)                      │
└────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┬─────────────────────────────┐
│   BHIV Operations & Ecosystem (col 7)    │  Integrations & Alerts (col 5)│
└──────────────────────────────────────────┴─────────────────────────────┘

┌────────────────────────┬───────────────────────────────────────────────┐
│ Risk Heatmap (col 4)   │            Telemetry & Analytics (col 8)      │
└────────────────────────┴───────────────────────────────────────────────┘

┌──────────────────────────────────────────┬─────────────────────────────┐
│   Active Workflows (col 7)               │   Operator Console (col 5)  │
└──────────────────────────────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────┬──────────────────────────┐
│   Runtime Health (col 7)                    │   Simulation Replay (col 5)│
└─────────────────────────────────────────────┴──────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                   Evidence & Intelligence (col-span-12)                │
└────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────────────┐
│ Repository Registry (col 6)  │       Build Registry (col 6)            │
└──────────────────────────────┴─────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────────────┐
│ Migration Queue (col 6)      │       Review Queue (col 6)              │
└──────────────────────────────┴─────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                   Capability Registry (col-span-12)                    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                   Employee Execution (col-span-12)                     │
└────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────────────┐
│ Engineering Capacity (col 6) │       Delivery Intelligence (col 6)     │
└──────────────────────────────┴─────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                   Capability Dependency Graph (col-span-12)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Zone Specifications

| Zone | Component | col-span | Row | API Endpoint | Polling |
|---|---|---|---|---|---|
| **Executive Summary** | `ExecutiveLayout.tsx` | `col-span-12` | 1 | `/system/status`, `/projects`, `/health` | 5s |
| **Operations Grid** | `OperationsLayout.tsx` | `col-span-12 lg:col-span-7` | 2 | `/dashboard/operations` | 5s |
| **Live Alerts** | `IntegrationLayout.tsx` | `col-span-12 lg:col-span-5` | 2 | `/dashboard/alerts` | 5s |
| **Decision Intelligence** | `DecisionIntelligenceLayout.tsx` | `col-span-12 md:col-span-6 lg:col-span-4` | 3 | `/ranking`, `/intelligence/confidence/{id}` | 10s |
| **Observability** | `ObservabilityLayout.tsx` | `col-span-12 md:col-span-6 lg:col-span-8` | 3 | `/dashboard/telemetry`, `/api/v1/analytics/karma_trends` | 10s |
| **Active Workflows** | `WorkflowLayout.tsx` | `col-span-12 lg:col-span-7` | 4 | `/projects`, `/projects/{id}/milestones` | 10s |
| **Operator Console** | `OperatorConsoleLayout.tsx` | `col-span-12 lg:col-span-5` | 4 | `/dashboard/alerts` | 5s |
| **Runtime Health** | `RuntimeHealthLayout.tsx` | `col-span-12 md:col-span-7` | 5 | `/system/status`, `/health` (all services) | 5s |
| **Simulation Replay** | `ReplayLayout.tsx` | `col-span-12 md:col-span-5` | 5 | `/dashboard/runtime` | 5s |
| **Evidence Panel** | `EvidenceLayout.tsx` | `col-span-12` | 6 | `/bucket/artifacts` | 15s |
| **Repository Registry** | `RepositoryRegistryLayout.tsx` | `col-span-12 lg:col-span-6` | 7 | Placeholder | — |
| **Build Registry** | `BuildRegistryLayout.tsx` | `col-span-12 lg:col-span-6` | 7 | Placeholder | — |
| **Migration Queue** | `MigrationQueueLayout.tsx` | `col-span-12 lg:col-span-6` | 8 | Placeholder | — |
| **Review Queue** | `ReviewQueueLayout.tsx` | `col-span-12 lg:col-span-6` | 8 | Placeholder | — |
| **Capability Registry** | `CapabilityRegistryLayout.tsx` | `col-span-12` | 9 | Placeholder | — |
| **Employee Execution** | `EmployeeExecutionLayout.tsx` | `col-span-12` | 10 | `/api/dashboard/stats`, `/api/dashboard/leaderboard` | 15s |
| **Engineering Capacity** | `EngineeringCapacityLayout.tsx` | `col-span-12 lg:col-span-6` | 11 | `/api/dashboard/stats` | 15s |
| **Delivery Intelligence**| `DeliveryIntelligenceLayout.tsx`| `col-span-12 lg:col-span-6` | 11 | `/api/aims` | 15s |
| **Dependency Graph** | `CapabilityDependencyGraphLayout.tsx`| `col-span-12` | 12 | `/intelligence/lineage` | 10s |
