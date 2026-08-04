# Dashboard Capability Documentation

## The `DashboardProvider` Model
The dashboard is no longer a static hardcoded grid. It is a configuration-driven capability.

### Configuration Schema
Located in `src/components/dashboard/DashboardProvider.tsx`, the system uses a Context Provider to distribute a JSON-based configuration object describing the layout of the dashboard.

```typescript
export interface DashboardConfig {
  branding: {
    systemName: string;
    subtitle: string;
    logoIcon: React.ComponentType;
    operatorLabel: string;
    roleLabel: string;
    operatorInitials: string;
  };
  zones: {
    executiveSummary: ZoneConfig;
    operationsGrid: ZoneConfig;
    liveAlerts: ZoneConfig;
    riskHeatmap: ZoneConfig;
    telemetry: ZoneConfig;
    incidentQueue: ZoneConfig;
    operationalTimeline: ZoneConfig;
    systemHealth: ZoneConfig;
    runtimeSessions: ZoneConfig;
    evidencePanel: ZoneConfig;
    repositoryRegistry: ZoneConfig;
    buildRegistry: ZoneConfig;
    migrationQueue: ZoneConfig;
    reviewQueue: ZoneConfig;
    capabilityRegistry: ZoneConfig;
    employeeExecution: ZoneConfig;
    engineeringCapacity: ZoneConfig;
    deliveryIntelligence: ZoneConfig;
    capabilityDependencyGraph: ZoneConfig;
  };
  features: {
    notifications: boolean;
    liveBadge: boolean;
    userMenu: boolean;
    clock: boolean;
  };
}

export interface ZoneConfig {
  visible: boolean;
  label: string;
  colSpan: string;
}
```

### Extending the Capability
To create a new view (e.g., a "Security Only" dashboard vs an "Executive Only" dashboard), you do not write new pages.
Instead, you pass a `config` prop to `DashboardProvider` (defined in `src/components/dashboard/DashboardProvider.tsx`):

```tsx
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";
import Dashboard from "@/pages/Dashboard";

export default function CustomDashboardPage() {
  return (
    <DashboardProvider config={{
      branding: {
        systemName: "SEC-GRID",
        subtitle: "Security Operations Command",
      },
      zones: {
        executiveSummary: { visible: false, colSpan: "col-span-12" },
        systemHealth: { visible: true, colSpan: "col-span-12" },
        evidencePanel: { visible: true, colSpan: "col-span-12" },
      }
    }}>
      <Dashboard />
    </DashboardProvider>
  );
}
```

The deep-merge utility in `DashboardProvider` automatically resolves your overrides against the default configuration, allowing you to hide/show and resize layouts dynamically.
