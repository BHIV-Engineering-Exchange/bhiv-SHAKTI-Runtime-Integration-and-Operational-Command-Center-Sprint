# Phase 3 Readiness Report

This report evaluates the readiness of the SHAKTI Command Center to integrate and activate Phase 3 capabilities of the vendored dashboard SDK.

---

## 1. Current P2 Baseline
The P2 architectural migration is complete and fully verified:
* **DashboardProvider**: Refactored to delegate configuration context to the SDK.
* **DashboardGrid**: Successfully orchestrates layout rendering via `@bhiv/dashboard-layout`'s grid container.
* **Static Locking**: The grid is strictly static (`editMode` locked to `false`), persistence is disabled via `noopPersistence`, and no drag/resize handles are rendered.
* **Integrity**: The 19 layout files, query hooks, and microservice APIs remain local and pristine. All 27 tests and production builds pass.

---

## 2. Actual Phase 3 Requirement
Phase 3 focuses on **Layout Customization & Runtime SDK Features**:
1. **Interactive Customization**: Activating `editMode` dynamically, allowing authorized users to drag-to-reorder and resize layout zones.
2. **Layout Persistence**: Enabling `localStoragePersistence` to preserve customized layouts across browser sessions.
3. **Workspace Templates**: Enabling template management (saving and applying layout templates).
4. **Theme & Filter Sync**: Aligning SHAKTI's global header search filters and dark mode switcher with the SDK's `FilterProvider` and `ThemeProvider`.
5. **Widget Registry**: Registering the 19 layout zones as dynamic widgets in the SDK's `WidgetRegistry`.

---

## 3. SDK Capability Mapping
* **Drag-to-Reorder**: **SUPPORTED**. HTML5 drag-and-drop is fully implemented natively inside `DashboardGrid` and `LayoutZone`.
* **Drag-to-Resize**: **SUPPORTED**. Live pointer-event tracking and responsive grid-width recalculation are implemented inside `LayoutZone`.
* **Persistence Adapter**: **SUPPORTED**. `localStoragePersistence` is built into the SDK and manages layout states by `layoutId` keys.
* **Edit Toolbar**: **MISSING / NO-OP**. The SDK's `LayoutEditToolbar` component is a placeholder returning `null`. Control panel UI (toggle edit mode, reset layout) must be implemented on the host side (SHAKTI).
* **Widget Registry**: **SUPPORTED**. The `WidgetRegistry` handles registration, unregistration, and query-by-category.
* **Theme & Filter Providers**: **SUPPORTED**. Context, providers, and hooks (`useTheme`, `useFilters`) exist in `@bhiv/dashboard-sdk`.

---

## 4. Components to Change
* [src/pages/Dashboard.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/pages/Dashboard.tsx):
  - Introduce custom Toolbar UI (since SDK toolbar is no-op).
  - Bind `editMode` to a local state / control.
  - Remove `noopPersistence` and configure default persistence.
* [src/components/layout/Header.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/layout/Header.tsx) / Search inputs:
  - Connect layout filters and theme switches to SDK context hooks (`useFilters`, `useTheme`).
* [src/index.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/index.tsx) or app entry point:
  - Initialize the `WidgetRegistry` by registering the 19 layouts.

---

## 5. Components to KEEP LOCAL
* **Layouts**: The 19 layout components under `src/components/dashboard/layouts/` remain 100% local. Their data fetching, API contracts, local states, and query logic must not be modified.
* **Header & Navigation Structure**: The visual branding and menu paths of the header remain local to SHAKTI.

---

## 6. Risk Matrix

| Risk | Description | Impact | Mitigation |
|---|---|---|---|
| **SDK Toolbar Placeholder** | The SDK's `LayoutEditToolbar` is a no-op. If we rely on it, users cannot toggle customization or reset layouts. | High | Build a custom, minimal edit toolbar on the host side (SHAKTI). |
| **Persistence Overwrite** | Enabling `localStorage` might persist corrupted layouts or hide new zones added in future releases. | Medium | The SDK `useLayoutEngine` automatically appends newly added zones that are missing from the saved local state. |
| **Unauthorized Customization** | Any operator could accidentally scramble the dashboard layout. | High | Gate `editMode` activation using SHAKTI's existing `useAuthorization` check (admin-only access). |

---

## 7. Proposed Migration Steps

1. **Step 1 — Custom Host-Side Toolbar**: Implement a minimal edit control toolbar in SHAKTI (e.g. beside the header or at the top of the grid) to toggle `editMode` on the layout engine and trigger `resetLayout()`.
2. **Step 2 — Enable Persistence**: Remove `noopPersistence` from the layout engine config in `Dashboard.tsx` to activate standard local storage persistence.
3. **Step 3 — Role-Based Gating**: Integrate SHAKTI's `useAuthorization` inside the toolbar controller to ensure only `Admin` roles can enter edit mode.
4. **Step 4 — Filter & Theme Sync**: Replace local filter/theme hook references in the header with the SDK's `useFilters` and `useTheme` hooks.
5. **Step 5 — Widget Registry pilot**: Refactor `Dashboard.tsx` to read widgets from the initialized `globalWidgetRegistry`.

---

## 8. Validation Plan
* **Manual Verification**:
  1. Login as Admin $\to$ verify Edit Toolbar is visible.
  2. Toggle Edit Mode $\to$ verify drag handles and resize indicators appear.
  3. Drag a card $\to$ verify order updates and is saved in `localStorage`.
  4. Reload page $\to$ verify customized order is retained.
  5. Click Reset Layout $\to$ verify positions revert to default config values.
  6. Login as Operator $\to$ verify Edit Toolbar is hidden and layout remains static.
* **Automated Verification**:
  * Run `npx tsc --noEmit -p tsconfig.app.json`
  * Run `npm run test` (all 27 tests must pass).
  * Run `npm run build`

---

## 9. Rollback Plan
To revert Phase 3 changes:
```bash
git checkout feature/sdk-integration -- src/pages/Dashboard.tsx src/components/layout/Header.tsx
```

---

## 10. Recommendation

**READY WITH CONDITIONS**

While the layout customization engine and persistence adapters are fully operational, the integration is blocked from a purely drop-in experience because the SDK's edit toolbar is a placeholder. Implementing Phase 3 is highly recommended and safe, provided that SHAKTI implements its own custom control toolbar to manage the customization state and gates editing using the host's existing role authorizations.
