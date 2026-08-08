# SHAKTI SDK P1 Migration Audit

This document audits the P1 components of the SHAKTI Command Center and details their compatibility mapping against the SDK packages.

---

## 1. P1 Component Migration Matrix

| Component | Current Props | SDK Props | Compatibility | Adapter Needed | Usage Count | Risk | Recommendation |
|---|---|---|---|---|---|---|---|
| **ExecutiveMetricCard** | `title`, `value`, `unit`, `trend`, `trendValue`, `status`, `icon`, `variant` | `label`, `value`, `unit`, `change`, `trend`, `className` | **HIGH** | YES (Local wrapper) | 0 | **LOW** | **SAFE**: Implement compatibility wrapper in local component. |
| **HealthIndicator** | `name`, `status`, `responseTime`, `detail`, `noBorder` | `label`, `tone`, `statusText`, `metrics`, `pulse`, `noBorder`, `className` | **HIGH** | YES (Local wrapper) | 0 | **LOW** | **SAFE**: Implement compatibility wrapper in local component. |
| **StatusCard** | `label`, `severity`, `progress`, `statusTheme`, `secondaryText` | `label`, `progress`, `tone`, `barTone`, `trailingText`, `noBorder`, `className` | **HIGH** | YES (Local wrapper) | 1 | **LOW** | **SAFE**: Implement compatibility wrapper in local component. |
| **DashboardCard** | Flat metadata props (`timestamp`, `isFetching`, `isStale`, `traceId`, `dataSource`) | Grouped `metadata` prop object | **HIGH** | YES (Local wrapper) | 19 | **LOW** | **SAFE**: Implement compatibility wrapper in local component to avoid modifying all 19 layouts. |

---

## 2. Compatibility Analysis & Prop Mapping

### A. ExecutiveMetricCard → MetricCardFramework
* **Mapping**:
  * `title` $\to$ `label`
  * `value` $\to$ `value`
  * `unit` $\to$ `unit`
  * `trendValue` $\to$ `change`
  * `trend` ("up" | "down" | "stable") $\to$ `trend` ("up" | "down" | "neutral")
* **Omissions**: SDK does not support `icon`, `status`, or `variant`. Since the component is unused, the adapter will simply ignore these or render a fallback container if needed.

### B. HealthIndicator → StatusIndicatorRow
* **Mapping**:
  * `name` $\to$ `label`
  * `status` $\to$ `statusText`
  * `status` ("online" | "offline" | "warning" | "degraded") $\to$ `tone` ("success" | "danger" | "caution" | "caution")
  * `responseTime` + `detail` $\to$ `metrics` array
  * `noBorder` $\to$ `noBorder`

### C. StatusCard → ProgressStatusRow
* **Mapping**:
  * `label` $\to$ `label`
  * `progress` $\to$ `progress`
  * `severity` $\to$ `tone` ("critical" $\to$ "danger", "high"/"medium" $\to$ "caution", "low" $\to$ "success", "info" $\to$ "info")
  * `statusTheme` $\to$ `barTone`
  * `secondaryText` (or `severity`) $\to$ `trailingText`

### D. DashboardCard → WidgetContainer
* **Mapping**:
  * All common props (`title`, `ariaLabel`, `headerRight`, `isLoading`, `isError`, `hasData`, `onRetry`, `errorMessage`, `errorTitle`, `isEmpty`, `emptyMessage`, `skeletonCount`, `skeletonHeight`, `className`, `children`) map exactly.
  * Flat metadata props map to:
    ```typescript
    metadata: {
      timestamp,
      isFetching,
      isStale,
      traceId,
      dataSource
    }
    ```

---

## 3. Files Affected

* [src/components/dashboard/primitives/ExecutiveMetricCard.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/primitives/ExecutiveMetricCard.tsx)
* [src/components/dashboard/primitives/HealthIndicator.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/primitives/HealthIndicator.tsx)
* [src/components/dashboard/primitives/StatusCard.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/primitives/StatusCard.tsx)
* [src/components/dashboard/DashboardCard.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/DashboardCard.tsx)
