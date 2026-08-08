# SHAKTI SDK P2 Architecture Migration Audit (Read-Only)

This document presents the detailed architectural compatibility audit between the SHAKTI Command Center and the vendored SDK components in preparation for the Phase 2.2 architectural integration.

---

## 1. Provider Compatibility Matrix

| Metric | SHAKTI Context / Provider | SDK Equivalent | Compatibility Status | Adapter Requirement |
|---|---|---|---|---|
| **Branding Config** | `logoIcon: LucideIcon`, names, labels | `logoIcon: ComponentType`, names, labels | **100% Compatible** | None. `LucideIcon` implements `ComponentType`. |
| **Zone Map Schema** | Hardcoded `DashboardZones` containing 19 specific zones | Generic `<TZones>` defaulting to `Record<string, DashboardZoneConfig>` | **100% Compatible** | Pass SHAKTI `DashboardZones` as the generic type parameter. |
| **Feature Flags** | Boolean flags (notifications, clock, etc.) | Boolean flags | **100% Compatible** | None. |
| **Provider Props** | Accepts `config` override; merges with default config | Accepts `defaultConfig` and `overrides` | **Minor Difference** | Thin local adapter is required to pass `defaultDashboardConfig` as a default prop. |
| **Coexistence** | Custom provider | Custom providers | **High** | Safe to wrap SDK provider inside the local provider file to avoid changes across children. |

---

## 2. Layout Compatibility Matrix

| SHAKTI Page/Grid | SDK Grid Engine | Compatibility Status | Risk | Resolution / Mapping |
|---|---|---|---|---|
| **Tailwind Grid Container** | `<GridLayoutEngine>` | **100% Compatible** | **Low** | Maps standard `grid-cols-12 gap-2` exactly under `density="standard"`. |
| **Responsive Column Spans** | `GridLayoutEngine` + default `colSpan` | **100% Compatible** | **Low** | Under `editMode: false`, the default Tailwind responsive classes (e.g. `col-span-12 lg:col-span-6`) are applied. |
| **19 Layout Components** | `LayoutZoneDefinition` component mapping | **100% Compatible** | **Low** | Components are declared inside the zone definition list and instantiated within `LayoutZone`. |
| **Suspense & Error Boundaries** | `LayoutZone` fallback + suspense height | **100% Compatible** | **Low** | The SDK `LayoutZone` incorporates `<ErrorBoundary>` and `<Suspense>` wrapper layers. |

---

## 3. Risk Matrix

| Integration Candidate | Classification | Risk Level | Rationale |
|---|---|---|---|
| **DashboardProvider** | **P2-SAFE** | **Low** | Custom local wrapper transparently delegates to SDK `DashboardProvider` without impacting configuration schemas. |
| **DashboardGrid** | **P2-CONTROLLED** | **Low** | Refactoring `src/pages/Dashboard.tsx` to use the SDK layout engine preserves static grid rendering. |
| **19 Layout Components** | **KEEP LOCAL** | **Minimal** | No logic inside the layouts is modified; data fetching and child components remain intact. |
| **Drag & Resize Interaction** | **KEEP DEACTIVATED** | **Medium** | Interactive elements will remain disabled (`editMode: false`) to avoid changing current operator behavior. |

---

## 4. Proposed Migration Sequence

The proposed migration sequence is designed to be incremental, localized, and easily rollback-able.

### Step 1: Update DashboardProvider
* **File**: [DashboardProvider.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/DashboardProvider.tsx)
* **Description**: Replace local deep-merge and context logic with a thin adapter wrapping the SDK `DashboardProvider`, passing `defaultDashboardConfig` by default.
* **Dependencies**: None.
* **Expected Files Affected**: [DashboardProvider.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/DashboardProvider.tsx).
* **Rollback Strategy**: Revert changes in `DashboardProvider.tsx`.
* **Validation**: Run `npm run test` and `npx tsc --noEmit` to verify type resolution and compile stability.

### Step 2: Refactor Dashboard Page to use SDK Grid
* **File**: [Dashboard.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/pages/Dashboard.tsx)
* **Description**: Define static `LayoutZoneDefinition[]` representing the 19 zones (with lazy-loaded layout components and fallback titles), call `useLayoutEngine`, and render `<DashboardGrid>`. Keep `editMode: false`.
* **Dependencies**: Step 1.
* **Expected Files Affected**: [Dashboard.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/pages/Dashboard.tsx).
* **Rollback Strategy**: Revert changes in `Dashboard.tsx`.
* **Validation**: Run tests and build the project to verify that the static DOM output is identical and compiles cleanly.

---

## 5. Explicit KEEP LOCAL List

The following elements must remain local to SHAKTI:
1. **The 19 Layout Components**: All files under `src/components/dashboard/layouts/` remain unmodified. All React Query logic, API endpoints, hooks, and local state contracts are retained.
2. **Dashboard Configuration**: [dashboard.config.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/config/dashboard.config.ts) is preserved as the single source of truth for base layout visibility and spacing.
3. **Interactive Edit Mode**: No UI controls for toggling `editMode` will be introduced. The layout stays static for operators.

---

## 6. Explicit NON-GOALS

* Enabling runtime drag-and-drop or resize controls for operators.
* Changing React Query or state-management layers in layout files.
* Replacing SHAKTI-specific headers or navigation elements.

---

## 7. Recommendation

**It is safe to proceed to the P2 migration.** The schemas align perfectly, the SDK grid mimics the host grid's structure exactly when static, and local wrappers will protect the 19 layouts from code changes.
