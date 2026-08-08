import { lazy } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useDashboardConfig } from "@/components/dashboard/DashboardProvider";
import { DashboardGrid, useLayoutEngine } from "@bhiv/dashboard-layout";
import type { LayoutZoneDefinition } from "@bhiv/dashboard-layout";

const ExecutiveLayout = lazy(() => import("@/components/dashboard/layouts/ExecutiveLayout"));
const OperationsLayout = lazy(() => import("@/components/dashboard/layouts/OperationsLayout"));
const IntegrationLayout = lazy(() => import("@/components/dashboard/layouts/IntegrationLayout"));
const DecisionIntelligenceLayout = lazy(() => import("@/components/dashboard/layouts/DecisionIntelligenceLayout"));
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
const ObservabilityLayout = lazy(() => import("@/components/dashboard/layouts/ObservabilityLayout"));

// Mock persistence adapter to completely de-activate local storage persistence for safety
const noopPersistence = {
  load: () => null,
  save: () => {},
  clear: () => {},
};

function DashboardGridWrapper() {
  const { zones } = useDashboardConfig();

  // Construct SDK zone definitions mapping directly from SHAKTI configuration
  const zonesDefinition: LayoutZoneDefinition[] = [
    {
      key: "executiveSummary",
      visible: zones.executiveSummary.visible,
      title: zones.executiveSummary.label,
      colSpan: zones.executiveSummary.colSpan,
      component: ExecutiveLayout,
      skeletonHeight: "h-32",
      fallbackTitle: "Executive Summary Crashed",
      order: 1,
    },
    {
      key: "operationsGrid",
      visible: zones.operationsGrid.visible,
      title: zones.operationsGrid.label,
      colSpan: zones.operationsGrid.colSpan,
      component: OperationsLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Operations Crashed",
      order: 2,
    },
    {
      key: "liveAlerts",
      visible: zones.liveAlerts.visible,
      title: zones.liveAlerts.label,
      colSpan: zones.liveAlerts.colSpan,
      component: IntegrationLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Integrations Crashed",
      order: 3,
    },
    {
      key: "riskHeatmap",
      visible: zones.riskHeatmap.visible,
      title: zones.riskHeatmap.label,
      colSpan: zones.riskHeatmap.colSpan,
      component: DecisionIntelligenceLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Intelligence Crashed",
      order: 4,
    },
    {
      key: "telemetry",
      visible: zones.telemetry.visible,
      title: zones.telemetry.label,
      colSpan: zones.telemetry.colSpan,
      component: ObservabilityLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Observability Crashed",
      order: 5,
    },
    {
      key: "incidentQueue",
      visible: zones.incidentQueue.visible,
      title: zones.incidentQueue.label,
      colSpan: zones.incidentQueue.colSpan,
      component: WorkflowLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Workflows Crashed",
      order: 6,
    },
    {
      key: "operationalTimeline",
      visible: zones.operationalTimeline.visible,
      title: zones.operationalTimeline.label,
      colSpan: zones.operationalTimeline.colSpan,
      component: OperatorConsoleLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Operator Console Crashed",
      order: 7,
    },
    {
      key: "systemHealth",
      visible: zones.systemHealth.visible,
      title: zones.systemHealth.label,
      colSpan: zones.systemHealth.colSpan,
      component: RuntimeHealthLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Health Crashed",
      order: 8,
    },
    {
      key: "runtimeSessions",
      visible: zones.runtimeSessions.visible,
      title: zones.runtimeSessions.label,
      colSpan: zones.runtimeSessions.colSpan,
      component: ReplayLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Replay Crashed",
      order: 9,
    },
    {
      key: "evidencePanel",
      visible: zones.evidencePanel.visible,
      title: zones.evidencePanel.label,
      colSpan: zones.evidencePanel.colSpan,
      component: EvidenceLayout,
      skeletonHeight: "h-48",
      fallbackTitle: "Evidence Crashed",
      order: 10,
    },
    {
      key: "repositoryRegistry",
      visible: !!zones.repositoryRegistry?.visible,
      title: zones.repositoryRegistry?.label,
      colSpan: zones.repositoryRegistry?.colSpan,
      component: RepositoryRegistryLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Repository Registry Crashed",
      order: 11,
    },
    {
      key: "buildRegistry",
      visible: !!zones.buildRegistry?.visible,
      title: zones.buildRegistry?.label,
      colSpan: zones.buildRegistry?.colSpan,
      component: BuildRegistryLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Build Registry Crashed",
      order: 12,
    },
    {
      key: "migrationQueue",
      visible: !!zones.migrationQueue?.visible,
      title: zones.migrationQueue?.label,
      colSpan: zones.migrationQueue?.colSpan,
      component: MigrationQueueLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Migration Queue Crashed",
      order: 13,
    },
    {
      key: "reviewQueue",
      visible: !!zones.reviewQueue?.visible,
      title: zones.reviewQueue?.label,
      colSpan: zones.reviewQueue?.colSpan,
      component: ReviewQueueLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Review Queue Crashed",
      order: 14,
    },
    {
      key: "capabilityRegistry",
      visible: !!zones.capabilityRegistry?.visible,
      title: zones.capabilityRegistry?.label,
      colSpan: zones.capabilityRegistry?.colSpan,
      component: CapabilityRegistryLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Capability Registry Crashed",
      order: 15,
    },
    {
      key: "employeeExecution",
      visible: !!zones.employeeExecution?.visible,
      title: zones.employeeExecution?.label,
      colSpan: zones.employeeExecution?.colSpan,
      component: EmployeeExecutionLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Employee Execution Crashed",
      order: 16,
    },
    {
      key: "engineeringCapacity",
      visible: !!zones.engineeringCapacity?.visible,
      title: zones.engineeringCapacity?.label,
      colSpan: zones.engineeringCapacity?.colSpan,
      component: EngineeringCapacityLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Engineering Capacity Crashed",
      order: 17,
    },
    {
      key: "deliveryIntelligence",
      visible: !!zones.deliveryIntelligence?.visible,
      title: zones.deliveryIntelligence?.label,
      colSpan: zones.deliveryIntelligence?.colSpan,
      component: DeliveryIntelligenceLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Delivery Intelligence Crashed",
      order: 18,
    },
    {
      key: "capabilityDependencyGraph",
      visible: !!zones.capabilityDependencyGraph?.visible,
      title: zones.capabilityDependencyGraph?.label,
      colSpan: zones.capabilityDependencyGraph?.colSpan,
      component: CapabilityDependencyGraphLayout,
      skeletonHeight: "h-96",
      fallbackTitle: "Capability Dependency Graph Crashed",
      order: 19,
    },
  ];

  const engine = useLayoutEngine({
    layoutId: "shakti-command-center-layout",
    zones: zonesDefinition,
    persistence: noopPersistence,
  });

  return (
    <DashboardGrid
      engine={engine}
      density="standard"
      renderZone={(zone) => {
        const Component = zone.component;
        return Component ? <Component /> : null;
      }}
    />
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardGridWrapper />
    </DashboardLayout>
  );
}
