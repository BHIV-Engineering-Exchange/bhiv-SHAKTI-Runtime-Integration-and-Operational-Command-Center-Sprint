# Dashboard Walkthrough

Functional walkthrough of all 19 layouts inside the SHAKTI Command Center dashboard.

---

## 1. Executive Summary (`ExecutiveLayout.tsx`)
- **Description**: Displays 12 status cards corresponding to all backend microservices, arranged in 2 rows of 6 cards.
- **Backend Data Source**: Queries `/system/status`, `/projects`, and `/health`.

## 2. Operations (`OperationsLayout.tsx`)
- **Description**: Shows BHIV capabilities grid and active operations list.
- **Backend Data Source**: Queries `GET /dashboard/operations`.

## 3. Alerts (`IntegrationLayout.tsx` - Alerts Feed)
- **Description**: Displays a chronological timeline of alerts.
- **Backend Data Source**: Queries `GET /dashboard/alerts`.

## 4. Decision Intelligence (`DecisionIntelligenceLayout.tsx`)
- **Description**: Monitors predictive scaling/load shedding capabilities and recent decisions.
- **Backend Data Source**: Queries `GET /ranking`.

## 5. Telemetry (`ObservabilityLayout.tsx`)
- **Description**: Renders a dynamic monotone AreaChart representing system telemetry success rates and latency.
- **Backend Data Source**: Queries `GET /dashboard/telemetry` and Karma live stats.

## 6. Workflow Monitoring (`WorkflowLayout.tsx`)
- **Description**: A table listing active projects and milestones.
- **Backend Data Source**: Queries `GET /projects`.

## 7. Runtime Health (`RuntimeHealthLayout.tsx`)
- **Description**: Displays uptime, errors, latency, and RPM alongside component statuses.
- **Backend Data Source**: Queries `GET /system/status` and `/health` checkers.

## 8. Replay (`ReplayLayout.tsx`)
- **Description**: Simulation replay dashboard including sessions list table.
- **Backend Data Source**: Queries `GET /dashboard/runtime`.

## 9. Evidence (`EvidenceLayout.tsx`)
- **Description**: Displays compliance evidence signals and code blueprint details.
- **Backend Data Source**: Queries `GET /bucket/artifacts`.

## 10. Operator Console (`OperatorConsoleLayout.tsx`)
- **Description**: Displays profiles of active operators and assignments alongside timeline activity logs.
- **Backend Data Source**: Queries `GET /dashboard/alerts`.

## 11. Registries & Queues (`RepositoryRegistryLayout.tsx`, `BuildRegistryLayout.tsx`, `MigrationQueueLayout.tsx`, `ReviewQueueLayout.tsx`, `CapabilityRegistryLayout.tsx`)
- **Description**: Showcases BHEX registry lists and database migration/code review queues (Placeholders).

## 12. Employee & Sprints (`EmployeeExecutionLayout.tsx`, `EngineeringCapacityLayout.tsx`, `DeliveryIntelligenceLayout.tsx`)
- **Description**: Displays live employee execution maps, capacity availability charts, and aims milestone checklists.
- **Backend Data Source**: Queries Niyantran stats, leaderboard, history, and aims.

## 13. Dependency Graph (`CapabilityDependencyGraphLayout.tsx`)
- **Description**: Renders Karma lineage node connections in SVG.
- **Backend Data Source**: Queries `GET /intelligence/lineage`.
