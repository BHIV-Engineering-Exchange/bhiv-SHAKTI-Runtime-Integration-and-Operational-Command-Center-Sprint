# SHAKTI SDK Integration Baseline

This document establishes the baseline state of the SHAKTI Command Center repository before integrating the vendored `@bhiv/*` packages.

## 1. Current SHAKTI Setup

* **React Version**: `^19.2.7` (both `react` and `react-dom`)
* **Vite Version**: `^8.1.1`
* **TypeScript Version**: `~6.0.2`
* **lucide-react Version**: `^1.23.0`
* **recharts**: Installed (`^3.9.2`)
* **clsx**: Installed (`^2.1.1`)
* **tailwind-merge**: Installed (`^3.6.0`)
* **Existing Path Aliases**: 
  * `@` maps to `./src` in `vite.config.ts`
  * `@/*` maps to `src/*` in `tsconfig.app.json`
* **Existing DashboardProvider**:
  * Located at: [DashboardProvider.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/DashboardProvider.tsx)
  * Logic: Combines `defaultDashboardConfig` (from `src/config/dashboard.config.ts`) and optional overrides via a React Context.
* **Existing Layout/Grid System**:
  * Simple 12-column grid layout configured statically via CSS class names (`grid grid-cols-12`).
  * Card wrapping is managed by [DashboardCard.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/DashboardCard.tsx).

---

## 2. SDK Package Locations (Subtree at `vendor/sdk/`)

The SDK is included as a Git subtree and contains the following packages:
* **`@bhiv/utils`**: `vendor/sdk/packages/utils/src/index.ts`
* **`@bhiv/ui`**: `vendor/sdk/packages/ui/src/index.ts`
* **`@bhiv/dashboard-sdk`**: `vendor/sdk/packages/dashboard-sdk/src/index.ts`
* **`@bhiv/dashboard-layout`**: `vendor/sdk/packages/dashboard-layout/src/index.ts`

---

## 3. Detected Compatibility

* **React / React DOM**: **Perfect match** (`^19.2.7`).
* **Tailwind CSS**: **Compatible**. SHAKTI uses Tailwind v4 (`@tailwindcss/vite` + `@layer base` in `src/index.css`), which automatically scans all files in the Vite build graph for utility classes. No explicit `content` path scanning configuration is necessary.
* **CSS Variable Namespace**: **Compatible**. The SDK theme engine injects `--platform-*` variables at runtime, which do not conflict with SHAKTI's local shadcn variables (`--background`, `--border`, etc.).
* **Dependencies**: **High Compatibility**. The required packages match except for `lucide-react`, where the SDK's `@bhiv/dashboard-layout` requests `^1.27.0` and SHAKTI uses `^1.23.0`.

---

## 4. Files that Need Modification

* [package.json](file:///c:/Pratik_Bhuwad/shakti-command-center/package.json): Upgrade `lucide-react` to `^1.27.0` to ensure compatibility with `@bhiv/dashboard-layout` (which uses `GripVertical`).
* [vite.config.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/vite.config.ts): Add path aliases resolving `@bhiv/*` to raw source paths.
* [tsconfig.app.json](file:///c:/Pratik_Bhuwad/shakti-command-center/tsconfig.app.json): Add compiler paths for `@bhiv/*` packages.

---

## 5. Potential Naming Conflicts & Risks

* **Naming Collision (DashboardProvider)**: Both SHAKTI and `@bhiv/dashboard-sdk` define a `DashboardProvider` component and a `useDashboardConfig` hook. During the initial integration, they must coexist. The SHAKTI code must continue using the local provider, or the local provider must be explicitly renamed or migrated in a controlled fashion.
* **Naming Collision (ErrorBoundary)**: Both define an `ErrorBoundary` component. Since they are structurally almost identical, care must be taken to only swap them when ready.
* **Source-first build risk**: The SDK has no pre-built `dist/` outputs. Vite must compile raw TypeScript from `vendor/sdk/`. If Vite skips compilation of files outside the project `src/` folder, the build will break.
