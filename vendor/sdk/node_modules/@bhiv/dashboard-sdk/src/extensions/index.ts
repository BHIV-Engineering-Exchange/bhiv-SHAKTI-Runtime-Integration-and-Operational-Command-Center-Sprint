// ─── Extension Points ──────────────────────────────────────────────────────────
// Registries and building-block "framework" components that let consuming
// apps extend the dashboard platform at runtime: register custom widgets,
// page templates, and nav items, or compose new zone/widget UI on top of
// the same primitives the built-in frameworks use.

export { WidgetRegistry, globalWidgetRegistry } from "../widget/WidgetRegistry";
export type { RegisteredWidget } from "../widget/WidgetRegistry";

export { TemplateRegistry, globalTemplateRegistry } from "../templates/TemplateRegistry";
export type { RegisteredTemplate } from "../templates/TemplateRegistry";

export { NavigationEngine, globalNavigationEngine } from "../navigation/NavigationEngine";

export { BaseCard, MetricCardFramework } from "../frameworks/card/BaseCard";
export type { BaseCardProps, MetricCardFrameworkProps } from "../frameworks/card/BaseCard";

export { BaseTableFramework } from "../frameworks/table/BaseTableFramework";
export type { ColumnDef, BaseTableFrameworkProps } from "../frameworks/table/BaseTableFramework";

export { GraphFramework } from "../frameworks/graph/GraphFramework";
export type { GraphDataPoint, GraphFrameworkProps } from "../frameworks/graph/GraphFramework";

export { TimelineFramework } from "../frameworks/timeline/TimelineFramework";
export type { TimelineEvent, TimelineFrameworkProps } from "../frameworks/timeline/TimelineFramework";

export { LayoutEngine } from "../layout/LayoutEngine";
export { ZoneLayoutEngine } from "../layout/ZoneLayoutEngine";
export type { ZoneConfig, LayoutEngineProps, DensityMode } from "../layout/types";
