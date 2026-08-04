# Component Library

The SHAKTI Dashboard Capability relies on a strict library of standardized UI primitives and smart layouts.

## 1. Primitive Components (`src/components/dashboard/primitives/`)
These primitives are stateless, memoized, and highly reusable presentation components.

### 1.1 Executive Primitives
- **`ExecutiveMetricCard`**: Displays top-level KPIs with a large value, trend indicator (up/down/stable), and an icon. Supports `primary` and `compact` variants.
- **`StatusCard`**: Displays system health statuses with pulsing indicator dots.

### 1.2 Operational Primitives
- **`RuntimeCard`**: Shows infrastructure node health, latency, region, and capability dependencies.
- **`AlertCard`**: Renders high-priority, actionable alerts with severity-based color coding (Critical, High, Medium, Low).
- **`TimelineCard`**: A chronological list item for the Operator Console activity log.
- **`OperatorCard`**: Displays personnel status, role, and current active assignment.
- **`APIHealthCard`**: Visualizes specific API endpoint health with uptime, latency, error rates, and RPM.
- **`ReplayCard`**: Displays Simulation Replay sessions with a status icon and progress bar.

### 1.3 Intelligence Primitives
- **`DecisionCard`**: Showcases automated AI decisions, the actor, the rationale, and the current execution status.
- **`CapabilityCard`**: Toggles displaying high-level system capabilities like "Predictive Scaling" and whether they are currently engaged.
- **`EvidenceCard`**: Used for compliance and security auditing, showing confidence scores and source metrics.
- **`CapabilityGraphVisualizer`**: Renders SVG-based interactive capability dependency graphs.

### 1.4 Workflow & Telemetry Primitives
- **`WorkflowCard`**: Renders active CI/CD or data pipeline workflows with an integrated progress bar and step indicators.
- **`IntegrationCard`**: Shows third-party integrations (e.g. Datadog, AWS, SAP) with their current sync status and latency.
- **`TelemetryCard`**: Renders dynamic monotone AreaCharts with Cartesian grids and legend placements inside the chart.
- **`HealthIndicator`**: A micro-primitive used inline to show a colored dot based on status.

---

## 2. Reusable Layout Components (`src/components/dashboard/layouts/`)
Smart components that integrate React Query hooks and orchestrate primitives inside a `DashboardCard`.

1. **`ExecutiveLayout.tsx`**: Compiles status indicators for all 12 backend services into a 6-column grid.
2. **`OperationsLayout.tsx`**: Visualizes BHIV Ecosystem Capabilities and active Control Plane operations.
3. **`IntegrationLayout.tsx`**: Orchestrates integration status cards and the live alert feed.
4. **`DecisionIntelligenceLayout.tsx`**: Monitors predictive scaling/load shedding capabilities and recent decisions.
5. **`ObservabilityLayout.tsx`**: Connects system telemetry metrics and Karma live stats.
6. **`WorkflowLayout.tsx`**: Renders a sticky table of active projects and milestones.
7. **`OperatorConsoleLayout.tsx`**: Renders active operators and timeline event activity logs.
8. **`RuntimeHealthLayout.tsx`**: Displays a system health score and component status table.
9. **`ReplayLayout.tsx`**: Coordinates Simulation and Replay explorer lists.
10. **`EvidenceLayout.tsx`**: Displays compliance evidence signals and code blueprint details.
11. **`RepositoryRegistryLayout.tsx`**: Shows BHEX repository registry entries (Placeholder).
12. **`BuildRegistryLayout.tsx`**: Shows BHEX build registry stats (Placeholder).
13. **`MigrationQueueLayout.tsx`**: Shows database schema migration queue status (Placeholder).
14. **`ReviewQueueLayout.tsx`**: Tracks pending code review queues (Placeholder).
15. **`CapabilityRegistryLayout.tsx`**: Renders active capabilities registry list (Placeholder).
16. **`EmployeeExecutionLayout.tsx`**: Displays live employee execution maps from Niyantran.
17. **`EngineeringCapacityLayout.tsx`**: Tracks engineering availability metrics from Niyantran.
18. **`DeliveryIntelligenceLayout.tsx`**: Renders active sprints and milestone progress.
19. **`CapabilityDependencyGraphLayout.tsx`**: Visualizes interactive Karma lineage charts.

---

## Rules of Engagement
- **Never fetch data inside a primitive.**
- **Never define margins inside a primitive** (they should fill their container).
- **Always support Dark Mode** (the app is Dark Mode by default, rely on Tailwind `slate-800/900` tokens).
