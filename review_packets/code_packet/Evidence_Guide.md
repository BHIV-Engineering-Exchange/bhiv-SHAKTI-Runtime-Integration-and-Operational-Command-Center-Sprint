# Evidence Guide

This document maps the screenshots stored in the repository's `evidence/` directory to their corresponding visual validation checks.

## Visual Evidences Registry

### 1. Operations & Compute Layout
*   **Filename**: `04_operations_compute.png`
*   **Purpose**: Verify BHIV capabilities and active operations list.
*   **What it proves**: Proves that capabilities statuses are visible, and active operations render inside a stable container.

### 2. Integrations & Alerts Layout
*   **Filename**: `05_integrations_alerts.png`
*   **Purpose**: Verify integrations component tiles and Live Alert Feed lists.
*   **What it proves**: Proves that at least 2 full rows of integration tiles render cleanly without cutoffs and alerts list handles variable rows internally.

### 3. Decision Intelligence Layout
*   **Filename**: `06_decision_intelligence.png`
*   **Purpose**: Verify AI engagement cards and the Recent Decisions feed layout.
*   **What it proves**: Proves that capability tiles are displayed and recent decisions render in order.

### 4. Observability & Telemetry Chart
*   **Filename**: `07_live_telemetry.png`
*   **Purpose**: Verify monotone curve AreaChart plotting telemetry response times.
*   **What it proves**: Proves that the chart renders smooth curves with subtle area fills, matching styling guidelines.

### 5. Workflow Monitoring Table
*   **Filename**: `08_workflow_monitoring.png`
*   **Purpose**: Verify active workflow step tables.
*   **What it proves**: Proves that workflow progress pipelines display correctly and table rows are clearly visible.

### 6. Operator Console Feed
*   **Filename**: `9_operator_timeline.png`
*   **Purpose**: Verify active operator cards and console logs timelines.
*   **What it proves**: Proves that operator statuses are visible and console timelines scroll.

### 7. Runtime Health Table
*   **Filename**: `10_runtime_health.png`
*   **Purpose**: Verify registry components statuses and response latencies.
*   **What it proves**: Proves that score metrics, telemetry summaries, and status grids render properly.

### 8. Simulation & Replay Explorer
*   **Filename**: `11_replay_view.png`
*   **Purpose**: Verify simulation sessions and validation verification handlers.
*   **What it proves**: Proves that replay lists are selectable and verification logs render correctly.

### 9. Evidence & Intelligence Panels
*   **Filename**: `12_evidence_intelligence.png`
*   **Purpose**: Verify Bucket Evidence metrics and execution chain artifact details.
*   **What it proves**: Proves that telemetry logs and blueprint instructions render in side-by-side columns.

### 10. Universal Loading State Skeletons
*   **Filename**: `17_loading_state.png`
*   **Purpose**: Verify dashboard rendering during data fetch.
*   **What it proves**: Proves that cards display Tailwind CSS animate-pulse skeletons uniformly during loading phases.

### 11. Empty State Fallbacks
*   **Filename**: `18_empty_state.png`
*   **Purpose**: Verify empty dashboard handling.
*   **What it proves**: Proves that cards display custom "No Runtime Data Available" messages when backend queries return empty sets.

### 12. Error Recovery Blockers
*   **Filename**: `19_error_recovery.png`
*   **Purpose**: Verify card display when fetches fail.
*   **What it proves**: Proves that cards catch errors cleanly, display descriptive fail logs, and offer manual query retry buttons.

### 13. Offline Caching Warning Banners
*   **Filename**: `20_offline_banner.png`
*   **Purpose**: Verify network connection lost banner alerts.
*   **What it proves**: Proves that connection loss triggers yellow cached warning banners without blanking out layout panels.

### 14. Lighthouse Audit Report
*   **Filename**: `27_lighthouse_report.png`
*   **Purpose**: Verify page performance, accessibility, Best Practices, and SEO optimization.
*   **What it proves**: Proves high scores and design compliance with Lighthouse standards.
