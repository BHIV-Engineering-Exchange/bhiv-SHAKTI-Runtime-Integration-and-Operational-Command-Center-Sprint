# Component Inventory

This document is the authoritative inventory of all React components in the SHAKTI Operational Command Center. It defines each component's responsibility, props, data source, state behavior, dependencies, and folder location — as implemented in the production codebase.

---

## 1. Folder Organization

```
src/
├── api/                             # Axios clients + endpoint configurations
│   ├── client.ts                    # Control Plane axios base client
│   ├── bucketEndpoints.ts           # Bucket service endpoints
│   ├── insightflowEndpoints.ts      # InsightFlow service endpoints
│   ├── karmaEndpoints.ts            # Karma service endpoints
│   ├── keshavEndpoints.ts           # Keshav service endpoints
│   ├── niyantranEndpoints.ts        # Niyantran service endpoints
│   ├── pranaEndpoints.ts            # Prana service endpoints
│   ├── rajyaEndpoints.ts            # Rajya service endpoints
│   ├── sanskarEndpoints.ts          # Sanskar service endpoints
│   ├── setuEndpoints.ts             # Setu PMC service endpoints
│   ├── tantraEndpoints.ts           # Tantra bridge endpoints
│   └── endpoints.ts                 # Control Plane endpoints fallback
├── components/
│   ├── dashboard/
│   │   ├── DashboardCard.tsx        # Card shell managing loading/error states
│   │   ├── DashboardProvider.tsx    # Dashboard configuration context provider
│   │   ├── layouts/                 # 19 layout modules
│   │   └── primitives/              # 16 reusable primitive components
│   ├── layout/
│   │   └── Header.tsx               # Global dashboard header
│   └── ui/
│       └── skeleton.tsx             # Loading skeleton utility
├── config/
│   └── dashboard.config.ts          # Default SHAKTI layout configuration
├── hooks/                           # TanStack hooks per service
├── layouts/
│   └── DashboardLayout.tsx          # Root layout with offline warning banner
├── pages/
│   └── Dashboard.tsx                # Main dashboard grid page composing layouts
├── types/                           # TypeScript interfaces
└── utils/                           # Format helpers + logger
```

---

## 2. Reusable Layout Components (`src/components/dashboard/layouts/`)

These smart layouts manage TanStack query fetches and orchestrate dumb presentation primitives:

1. **`ExecutiveLayout.tsx`**: Compiles status states for all 12 backend services into a 6-column grid. Uses `useSystemStatus`, `useSetuProjects`, etc.
2. **`OperationsLayout.tsx`**: Displays BHIV Ecosystem Capabilities and active Control Plane operations. Uses `useOperationsDashboard`, `useSystemStatus`, `useBucketStorageStats`, etc.
3. **`IntegrationLayout.tsx`**: Orchestrates integration connection status tiles and the Live Alert Feed list. Uses `useAlertsDashboard`, etc.
4. **`DecisionIntelligenceLayout.tsx`**: Monitors AI capabilities (Predictive Scaling, Load Shedding) and recent decisions. Uses `useSanskarRanking`, `useKarmaConfidence`, etc.
5. **`ObservabilityLayout.tsx`**: Connects system telemetry metrics and Karma live stats. Uses `useTelemetryDashboard` and `useKarmaLiveMetrics`.
6. **`WorkflowLayout.tsx`**: Renders a sticky table of active projects and milestones. Uses `useSetuProjects`.
7. **`OperatorConsoleLayout.tsx`**: Renders active operators and timeline event activity logs. Uses `useAlertsDashboard`.
8. **`RuntimeHealthLayout.tsx`**: Displays a system health score and component status table. Uses `useSystemStatus` and specific health checkers.
9. **`ReplayLayout.tsx`**: Coordinates Simulation and Replay explorer lists. Uses `useRuntimeDashboard`.
10. **`EvidenceLayout.tsx`**: Displays compliance evidence signals and code blueprint details. Uses `useBucketArtifacts`.
11. **`RepositoryRegistryLayout.tsx`**: Shows repository registry entries (Placeholder).
12. **`BuildRegistryLayout.tsx`**: Shows build registry stats (Placeholder).
13. **`MigrationQueueLayout.tsx`**: Shows database schema migration queue status (Placeholder).
14. **`ReviewQueueLayout.tsx`**: Tracks pending code review queues (Placeholder).
15. **`CapabilityRegistryLayout.tsx`**: Renders active capabilities registry list (Placeholder).
16. **`EmployeeExecutionLayout.tsx`**: Displays live employee execution maps from Niyantran. Uses `useNiyantranExecutionHistory`.
17. **`EngineeringCapacityLayout.tsx`**: Tracks engineering availability metrics from Niyantran. Uses `useNiyantranStats`.
18. **`DeliveryIntelligenceLayout.tsx`**: Renders active sprints and milestone progress. Uses `useNiyantranAims`.
19. **`CapabilityDependencyGraphLayout.tsx`**: Visualizes interactive Karma lineage charts. Uses `useKarmaLineage`.

---

## 3. Stateless Primitive Components (`src/components/dashboard/primitives/`)

Stateless presentation components:

1. **`ExecutiveMetricCard.tsx`**: KPI display with trend and unit label.
2. **`AlertCard.tsx`**: Severity-coded alert with source badge and timestamp.
3. **`StatusCard.tsx`**: Progress bar with priority dot and secondary text.
4. **`DecisionCard.tsx`**: Decision action with execution status badge.
5. **`CapabilityCard.tsx`**: Capability with engaged/idle indicator.
6. **`OperatorCard.tsx`**: Agent profile with status dot and task count.
7. **`TelemetryCard.tsx`**: Recharts area chart with summary metrics and legend.
8. **`IntegrationCard.tsx`**: Connection tile with status and latency.
9. **`TimelineCard.tsx`**: Timeline event with severity connector line.
10. **`APIHealthCard.tsx`**: Endpoint health with uptime, errors, latency, RPM.
11. **`EvidenceCard.tsx`**: Evidence item with category and confidence score.
12. **`RuntimeCard.tsx`**: Runtime component status display.
13. **`ReplayCard.tsx`**: Replay session with progress indicator.
14. **`WorkflowCard.tsx`**: Multi-step workflow pipeline.
15. **`HealthIndicator.tsx`**: Simple health status dot.
16. **`CapabilityGraphVisualizer.tsx`**: SVG-based dependency node flowchart visualizer.
