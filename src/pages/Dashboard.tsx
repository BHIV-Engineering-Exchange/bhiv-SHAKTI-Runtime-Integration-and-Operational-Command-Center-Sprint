import { lazy, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useDashboardConfig } from "@/components/dashboard/DashboardProvider";
import { DashboardGrid, useLayoutEngine, listSavedTemplates, deleteTemplate, localStoragePersistence } from "@bhiv/dashboard-layout";
import type { LayoutZoneDefinition, LayoutTemplate } from "@bhiv/dashboard-layout";
import { globalWidgetRegistry } from "@bhiv/dashboard-sdk";
import { useAuthorization } from "@/hooks/useAuthorization";

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

// ─── Stage 5: Widget Registry Integration ──────────────────────────────────────

const registeredWidgets = [
  { id: "executiveSummary", name: "Executive Layout", category: "executive", component: ExecutiveLayout },
  { id: "operationsGrid", name: "Operations Layout", category: "operations", component: OperationsLayout },
  { id: "liveAlerts", name: "Integrations Layout", category: "integrations", component: IntegrationLayout },
  { id: "riskHeatmap", name: "Intelligence Layout", category: "intelligence", component: DecisionIntelligenceLayout },
  { id: "telemetry", name: "Observability Layout", category: "observability", component: ObservabilityLayout },
  { id: "incidentQueue", name: "Workflows Layout", category: "workflows", component: WorkflowLayout },
  { id: "operationalTimeline", name: "Operator Console Layout", category: "operator-console", component: OperatorConsoleLayout },
  { id: "systemHealth", name: "Health Layout", category: "health", component: RuntimeHealthLayout },
  { id: "runtimeSessions", name: "Replay Layout", category: "replay", component: ReplayLayout },
  { id: "evidencePanel", name: "Evidence Layout", category: "evidence", component: EvidenceLayout },
  { id: "repositoryRegistry", name: "Repository Registry Layout", category: "registry", component: RepositoryRegistryLayout },
  { id: "buildRegistry", name: "Build Registry Layout", category: "registry", component: BuildRegistryLayout },
  { id: "migrationQueue", name: "Migration Queue Layout", category: "queue", component: MigrationQueueLayout },
  { id: "reviewQueue", name: "Review Queue Layout", category: "queue", component: ReviewQueueLayout },
  { id: "capabilityRegistry", name: "Capability Registry Layout", category: "registry", component: CapabilityRegistryLayout },
  { id: "employeeExecution", name: "Employee Execution Layout", category: "execution", component: EmployeeExecutionLayout },
  { id: "engineeringCapacity", name: "Engineering Capacity Layout", category: "capacity", component: EngineeringCapacityLayout },
  { id: "deliveryIntelligence", name: "Delivery Intelligence Layout", category: "intelligence", component: DeliveryIntelligenceLayout },
  { id: "capabilityDependencyGraph", name: "Capability Dependency Graph Layout", category: "graph", component: CapabilityDependencyGraphLayout }
];

registeredWidgets.forEach((w) => {
  if (!globalWidgetRegistry.get(w.id)) {
    globalWidgetRegistry.register(w);
  }
});

const LAYOUT_ID = "shakti-command-center-layout";

function DashboardGridWrapper() {
  const { zones } = useDashboardConfig();
  const { hasRole } = useAuthorization();
  const isAdmin = hasRole("admin");

  const [templateName, setTemplateName] = useState("");
  const [savedTemplates, setSavedTemplates] = useState<LayoutTemplate[]>([]);

  // Construct SDK zone definitions mapping components from the Widget Registry
  const zonesDefinition: LayoutZoneDefinition[] = [
    {
      key: "executiveSummary",
      visible: zones.executiveSummary.visible,
      title: zones.executiveSummary.label,
      colSpan: zones.executiveSummary.colSpan,
      component: globalWidgetRegistry.get("executiveSummary")?.component || ExecutiveLayout,
      skeletonHeight: "h-32",
      fallbackTitle: "Executive Summary Crashed",
      order: 1,
    },
    {
      key: "operationsGrid",
      visible: zones.operationsGrid.visible,
      title: zones.operationsGrid.label,
      colSpan: zones.operationsGrid.colSpan,
      component: globalWidgetRegistry.get("operationsGrid")?.component || OperationsLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Operations Crashed",
      order: 2,
    },
    {
      key: "liveAlerts",
      visible: zones.liveAlerts.visible,
      title: zones.liveAlerts.label,
      colSpan: zones.liveAlerts.colSpan,
      component: globalWidgetRegistry.get("liveAlerts")?.component || IntegrationLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Integrations Crashed",
      order: 3,
    },
    {
      key: "riskHeatmap",
      visible: zones.riskHeatmap.visible,
      title: zones.riskHeatmap.label,
      colSpan: zones.riskHeatmap.colSpan,
      component: globalWidgetRegistry.get("riskHeatmap")?.component || DecisionIntelligenceLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Intelligence Crashed",
      order: 4,
    },
    {
      key: "telemetry",
      visible: zones.telemetry.visible,
      title: zones.telemetry.label,
      colSpan: zones.telemetry.colSpan,
      component: globalWidgetRegistry.get("telemetry")?.component || ObservabilityLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Observability Crashed",
      order: 5,
    },
    {
      key: "incidentQueue",
      visible: zones.incidentQueue.visible,
      title: zones.incidentQueue.label,
      colSpan: zones.incidentQueue.colSpan,
      component: globalWidgetRegistry.get("incidentQueue")?.component || WorkflowLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Workflows Crashed",
      order: 6,
    },
    {
      key: "operationalTimeline",
      visible: zones.operationalTimeline.visible,
      title: zones.operationalTimeline.label,
      colSpan: zones.operationalTimeline.colSpan,
      component: globalWidgetRegistry.get("operationalTimeline")?.component || OperatorConsoleLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Operator Console Crashed",
      order: 7,
    },
    {
      key: "systemHealth",
      visible: zones.systemHealth.visible,
      title: zones.systemHealth.label,
      colSpan: zones.systemHealth.colSpan,
      component: globalWidgetRegistry.get("systemHealth")?.component || RuntimeHealthLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Health Crashed",
      order: 8,
    },
    {
      key: "runtimeSessions",
      visible: zones.runtimeSessions.visible,
      title: zones.runtimeSessions.label,
      colSpan: zones.runtimeSessions.colSpan,
      component: globalWidgetRegistry.get("runtimeSessions")?.component || ReplayLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Replay Crashed",
      order: 9,
    },
    {
      key: "evidencePanel",
      visible: zones.evidencePanel.visible,
      title: zones.evidencePanel.label,
      colSpan: zones.evidencePanel.colSpan,
      component: globalWidgetRegistry.get("evidencePanel")?.component || EvidenceLayout,
      skeletonHeight: "h-48",
      fallbackTitle: "Evidence Crashed",
      order: 10,
    },
    {
      key: "repositoryRegistry",
      visible: !!zones.repositoryRegistry?.visible,
      title: zones.repositoryRegistry?.label,
      colSpan: zones.repositoryRegistry?.colSpan,
      component: globalWidgetRegistry.get("repositoryRegistry")?.component || RepositoryRegistryLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Repository Registry Crashed",
      order: 11,
    },
    {
      key: "buildRegistry",
      visible: !!zones.buildRegistry?.visible,
      title: zones.buildRegistry?.label,
      colSpan: zones.buildRegistry?.colSpan,
      component: globalWidgetRegistry.get("buildRegistry")?.component || BuildRegistryLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Build Registry Crashed",
      order: 12,
    },
    {
      key: "migrationQueue",
      visible: !!zones.migrationQueue?.visible,
      title: zones.migrationQueue?.label,
      colSpan: zones.migrationQueue?.colSpan,
      component: globalWidgetRegistry.get("migrationQueue")?.component || MigrationQueueLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Migration Queue Crashed",
      order: 13,
    },
    {
      key: "reviewQueue",
      visible: !!zones.reviewQueue?.visible,
      title: zones.reviewQueue?.label,
      colSpan: zones.reviewQueue?.colSpan,
      component: globalWidgetRegistry.get("reviewQueue")?.component || ReviewQueueLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Review Queue Crashed",
      order: 14,
    },
    {
      key: "capabilityRegistry",
      visible: !!zones.capabilityRegistry?.visible,
      title: zones.capabilityRegistry?.label,
      colSpan: zones.capabilityRegistry?.colSpan,
      component: globalWidgetRegistry.get("capabilityRegistry")?.component || CapabilityRegistryLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Capability Registry Crashed",
      order: 15,
    },
    {
      key: "employeeExecution",
      visible: !!zones.employeeExecution?.visible,
      title: zones.employeeExecution?.label,
      colSpan: zones.employeeExecution?.colSpan,
      component: globalWidgetRegistry.get("employeeExecution")?.component || EmployeeExecutionLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Employee Execution Crashed",
      order: 16,
    },
    {
      key: "engineeringCapacity",
      visible: !!zones.engineeringCapacity?.visible,
      title: zones.engineeringCapacity?.label,
      colSpan: zones.engineeringCapacity?.colSpan,
      component: globalWidgetRegistry.get("engineeringCapacity")?.component || EngineeringCapacityLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Engineering Capacity Crashed",
      order: 17,
    },
    {
      key: "deliveryIntelligence",
      visible: !!zones.deliveryIntelligence?.visible,
      title: zones.deliveryIntelligence?.label,
      colSpan: zones.deliveryIntelligence?.colSpan,
      component: globalWidgetRegistry.get("deliveryIntelligence")?.component || DeliveryIntelligenceLayout,
      skeletonHeight: "h-64",
      fallbackTitle: "Delivery Intelligence Crashed",
      order: 18,
    },
    {
      key: "capabilityDependencyGraph",
      visible: !!zones.capabilityDependencyGraph?.visible,
      title: zones.capabilityDependencyGraph?.label,
      colSpan: zones.capabilityDependencyGraph?.colSpan,
      component: globalWidgetRegistry.get("capabilityDependencyGraph")?.component || CapabilityDependencyGraphLayout,
      skeletonHeight: "h-96",
      fallbackTitle: "Capability Dependency Graph Crashed",
      order: 19,
    },
  ];

  // ─── Stage 2: Layout Persistence ──────────────────────────────────────────────
  const engine = useLayoutEngine({
    layoutId: LAYOUT_ID,
    zones: zonesDefinition,
    persistence: localStoragePersistence,
  });

  // ─── Stage 3: Workspace Template Management ──────────────────────────────────
  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    engine.saveAsTemplate(templateName.trim());
    setTemplateName("");
    setSavedTemplates(listSavedTemplates(LAYOUT_ID));
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(LAYOUT_ID, id);
    setSavedTemplates(listSavedTemplates(LAYOUT_ID));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stage 1 & 3: Custom Host-Side Layout Customization Toolbar */}
      {isAdmin && (
        <div className="bg-slate-900 border border-slate-700/60 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Layout Customization:</span>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${engine.editMode ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-slate-800 text-slate-400"}`}>
              {engine.editMode ? "Edit Mode Active" : "Locked"}
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={() => engine.setEditMode(!engine.editMode)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors"
            >
              {engine.editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
            <button
              onClick={() => engine.resetLayout()}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold transition-colors"
            >
              Reset to Default
            </button>

            {/* Template Save Interface */}
            <div className="flex items-center gap-1 border-l border-slate-700/60 pl-3 ml-1">
              <input
                type="text"
                placeholder="Workspace name..."
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-white rounded px-2 py-1 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSaveTemplate}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
              >
                Save Workspace
              </button>
            </div>

            {/* Template Load Selection */}
            {savedTemplates.length > 0 && (
              <div className="flex items-center gap-2 border-l border-slate-700/60 pl-3 ml-1">
                <select
                  onChange={(e) => {
                    const t = savedTemplates.find((x) => x.id === e.target.value);
                    if (t) engine.applyTemplate(t);
                  }}
                  defaultValue=""
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="" disabled>Load workspace...</option>
                  {savedTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDeleteTemplate(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                  className="bg-slate-800 border border-slate-700 text-xs text-red-400 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="" disabled>Delete workspace...</option>
                  {savedTemplates.map((t) => (
                    <option key={t.id} value={t.id}>Delete "{t.name}"</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <DashboardGrid
        engine={engine}
        density="standard"
        renderZone={(zone) => {
          const Component = zone.component;
          return Component ? <Component /> : null;
        }}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardGridWrapper />
    </DashboardLayout>
  );
}
