# SHAKTI Command Center — Review Packet

## Project Identity

| Field | Value |
|---|---|
| **Project** | SHAKTI Runtime Integration and Operational Command Center |
| **Stack** | React 19 · TypeScript 6 · Vite 8 · TanStack Query 5 · Recharts 3 · Tailwind CSS 4 |
| **Build Status** | ✅ Zero TypeScript errors · ✅ Production build passes |
| **Testing Status** | ✅ Vitest unit tests pass · ✅ Playwright E2E tests pass |

---

## Architecture Summary

### Application Structure
```
src/
├── api/              # Axios clients per service + typed endpoints
├── components/
│   ├── dashboard/
│   │   ├── DashboardCard.tsx       # Universal card wrapper (5 states)
│   │   ├── DashboardProvider.tsx   # Config context provider
│   │   ├── layouts/                # 19 zone layout components
│   │   └── primitives/             # 16 reusable primitive cards
│   ├── layout/
│   │   └── Header.tsx              # Global dashboard header
│   └── ui/
│       └── skeleton.tsx            # Loading skeleton component
├── config/
│   └── dashboard.config.ts         # Default 19-zone configuration
├── hooks/                          # Custom hooks and service query hooks
├── layouts/
│   └── DashboardLayout.tsx         # Root layout with offline banner
├── pages/
│   └── Dashboard.tsx               # Main dashboard 12-column grid page
├── types/                          # Type definition files
└── utils/                          # Format helpers + logger
```

### Key Design Decisions
1. **Zone-based grid architecture** — 19 independent zones in a 12-column CSS grid, each lazy-loaded and wrapped in `<ErrorBoundary>`.
2. **Configuration-driven layout** — Visibility, column spans, branding, and features are controlled by `DashboardConfig` in the provider context.
3. **Primitive composition** — 16 stateless, memoized primitive components (`ExecutiveMetricCard`, `AlertCard`, `StatusCard`, etc.) that layouts compose together.
4. **Resilience** — All API clients configure customized timeouts, environment variables fallbacks default to empty strings, and TanStack Query preserves stale data on network dropouts.

---

## Component Inventory

### Primitives (16 components)
- `ExecutiveMetricCard`, `AlertCard`, `StatusCard`, `DecisionCard`, `CapabilityCard`, `OperatorCard`, `TelemetryCard`, `IntegrationCard`, `TimelineCard`, `APIHealthCard`, `EvidenceCard`, `RuntimeCard`, `ReplayCard`, `WorkflowCard`, `HealthIndicator`, `CapabilityGraphVisualizer`.

### Layouts (19 components)
- Executive, Operations, Integrations, Decision Intelligence, Observability, Active Workflows, Operator Console, Runtime Health, Simulation Replay, Evidence, Repository Registry, Build Registry, Migration Queue, Review Queue, Capability Registry, Employee Execution, Engineering Capacity, Delivery Intelligence, Capability Dependency Graph.
