import { lazy, useMemo } from "react";
import type { ComponentType } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useDashboardConfig } from "@bhiv/dashboard-sdk";
import { DashboardGrid, LayoutEditToolbar, useLayoutEngine } from "@bhiv/dashboard-layout";
import type { LayoutZoneDefinition } from "@bhiv/dashboard-layout";
import type { DashboardZones } from "@/types/dashboard.types";

const ExecutiveLayout = lazy(() => import("@/components/dashboard/layouts/ExecutiveLayout"));
const OperationsLayout = lazy(() => import("@/components/dashboard/layouts/OperationsLayout"));
const IntegrationLayout = lazy(() => import("@/components/dashboard/layouts/IntegrationLayout"));
const DecisionIntelligenceLayout = lazy(() => import("@/components/dashboard/layouts/DecisionIntelligenceLayout"));
const ObservabilityLayout = lazy(() => import("@/components/dashboard/layouts/ObservabilityLayout"));
const WorkflowLayout = lazy(() => import("@/components/dashboard/layouts/WorkflowLayout"));
const OperatorConsoleLayout = lazy(() => import("@/components/dashboard/layouts/OperatorConsoleLayout"));
const RuntimeHealthLayout = lazy(() => import("@/components/dashboard/layouts/RuntimeHealthLayout"));
const ReplayLayout = lazy(() => import("@/components/dashboard/layouts/ReplayLayout"));
const EvidenceLayout = lazy(() => import("@/components/dashboard/layouts/EvidenceLayout"));
const RepositoryRegistryLayout = lazy(() => import("@/components/dashboard/layouts/RepositoryRegistryLayout"));
const BuildRegistryLayout = lazy(() => import("@/components/dashboard/layouts/BuildRegistryLayout"));
const MigrationQueueLayout = lazy(() => import("@/components/dashboard/layouts/MigrationQueueLayout"));
const ReviewQueueLayout = lazy(() => import("@/components/dashboard/layouts/ReviewQueueLayout"));
const CapabilityRegistryLayout = lazy(() => import("@/components/dashboard/layouts/CapabilityRegistryLayout"));
const EmployeeExecutionLayout = lazy(() => import("@/components/dashboard/layouts/EmployeeExecutionLayout"));
const EngineeringCapacityLayout = lazy(() => import("@/components/dashboard/layouts/EngineeringCapacityLayout"));
const DeliveryIntelligenceLayout = lazy(() => import("@/components/dashboard/layouts/DeliveryIntelligenceLayout"));
const CapabilityDependencyGraphLayout = lazy(() => import("@/components/dashboard/layouts/CapabilityDependencyGraphLayout"));

// Same ordered zone list as before — this array's order IS the default
// layout order. `useLayoutEngine` only deviates from it once a user has
// actually dragged or resized a zone (persisted per-browser), so the
// dashboard renders identically to the previous hardcoded grid until then.
const ZONE_ORDER: {
  key: keyof DashboardZones;
  fallbackTitle: string;
  skeletonHeight: string;
  Component: ComponentType;
}[] = [
  { key: "executiveSummary", fallbackTitle: "Executive Summary Crashed", skeletonHeight: "h-32", Component: ExecutiveLayout },
  { key: "operationsGrid", fallbackTitle: "Operations Crashed", skeletonHeight: "h-64", Component: OperationsLayout },
  { key: "liveAlerts", fallbackTitle: "Integrations Crashed", skeletonHeight: "h-64", Component: IntegrationLayout },
  { key: "riskHeatmap", fallbackTitle: "Intelligence Crashed", skeletonHeight: "h-64", Component: DecisionIntelligenceLayout },
  { key: "telemetry", fallbackTitle: "Observability Crashed", skeletonHeight: "h-64", Component: ObservabilityLayout },
  { key: "incidentQueue", fallbackTitle: "Workflows Crashed", skeletonHeight: "h-64", Component: WorkflowLayout },
  { key: "operationalTimeline", fallbackTitle: "Operator Console Crashed", skeletonHeight: "h-64", Component: OperatorConsoleLayout },
  { key: "systemHealth", fallbackTitle: "Health Crashed", skeletonHeight: "h-64", Component: RuntimeHealthLayout },
  { key: "runtimeSessions", fallbackTitle: "Replay Crashed", skeletonHeight: "h-64", Component: ReplayLayout },
  { key: "evidencePanel", fallbackTitle: "Evidence Crashed", skeletonHeight: "h-48", Component: EvidenceLayout },
  { key: "repositoryRegistry", fallbackTitle: "Repository Registry Crashed", skeletonHeight: "h-64", Component: RepositoryRegistryLayout },
  { key: "buildRegistry", fallbackTitle: "Build Registry Crashed", skeletonHeight: "h-64", Component: BuildRegistryLayout },
  { key: "migrationQueue", fallbackTitle: "Migration Queue Crashed", skeletonHeight: "h-64", Component: MigrationQueueLayout },
  { key: "reviewQueue", fallbackTitle: "Review Queue Crashed", skeletonHeight: "h-64", Component: ReviewQueueLayout },
  { key: "capabilityRegistry", fallbackTitle: "Capability Registry Crashed", skeletonHeight: "h-64", Component: CapabilityRegistryLayout },
  { key: "employeeExecution", fallbackTitle: "Employee Execution Crashed", skeletonHeight: "h-64", Component: EmployeeExecutionLayout },
  { key: "engineeringCapacity", fallbackTitle: "Engineering Capacity Crashed", skeletonHeight: "h-64", Component: EngineeringCapacityLayout },
  { key: "deliveryIntelligence", fallbackTitle: "Delivery Intelligence Crashed", skeletonHeight: "h-64", Component: DeliveryIntelligenceLayout },
  { key: "capabilityDependencyGraph", fallbackTitle: "Capability Dependency Graph Crashed", skeletonHeight: "h-96", Component: CapabilityDependencyGraphLayout },
];

function DashboardGridContainer() {
  const { zones } = useDashboardConfig<DashboardZones>();

  const zoneDefinitions = useMemo<LayoutZoneDefinition[]>(
    () =>
      ZONE_ORDER.map(({ key, fallbackTitle, skeletonHeight, Component }, index) => {
        const zoneConfig = zones[key];
        return {
          key,
          visible: Boolean(zoneConfig?.visible),
          colSpan: zoneConfig?.colSpan,
          title: zoneConfig?.label,
          fallbackTitle,
          skeletonHeight,
          component: Component,
          order: index,
        };
      }),
    [zones]
  );

  // `layoutId` scopes persistence/templates to this dashboard. Bump
  // `version` if SHAKTI's zone set ever changes shape in a way that should
  // invalidate previously-saved custom layouts.
  const engine = useLayoutEngine({ layoutId: "shakti-command-center", zones: zoneDefinitions, version: 1 });

  return (
    <>
      <LayoutEditToolbar engine={engine} className="mb-3" />
      <DashboardGrid
        engine={engine}
        renderZone={(zone) => {
          const Component = zone.component;
          return Component ? <Component /> : null;
        }}
      />
    </>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardGridContainer />
    </DashboardLayout>
  );
}
