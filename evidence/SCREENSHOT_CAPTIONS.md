# SHAKTI Command Center — Screenshot Captions

This document lists the official captions for the screenshots demonstrating compliance with the SHAKTI Operational Command Center system specifications.

---

### `01_dashboard_startup.png`
* **Caption:** Demonstrates the application's initial cold-start phase with layout skeleton placeholders displaying in all zones. This verifies that layout components mount and load gracefully before the async API requests complete.

### `02_Dashboard_overview-1.png`
* **Caption:** Demonstrates the first section of the dashboard grid layout running in a standard desktop viewport. This satisfies the core design requirement of fitting primary executive metrics on a single screen.

### `02_Dashboard_overview-2.png`
* **Caption:** Demonstrates the second section of the dashboard grid layout running in a standard desktop viewport, showing the middle panels.

### `02_Dashboard_overview-3.png`
* **Caption:** Demonstrates the third section of the dashboard grid layout running in a standard desktop viewport, showing details of compute and operations.

### `02_Dashboard_overview--4.png`
* **Caption:** Demonstrates the fourth section of the dashboard grid layout running in a standard desktop viewport, showing the remaining widgets and lower layouts.

### `03_executive_kpis.png`
* **Caption:** Displays the top-row Executive Summary row containing prominently styled KPI cards. This satisfies the hierarchy requirement by emphasizing 30px key metric values alongside secondary unit labels and color-coded trend indicators.

### `04_operations_compute.png`
* **Caption:** Highlights the Operations & Compute zone rendering the API endpoint health tiles and the active operations queue. This verifies that the operational list correctly displays active compute metrics inside a stable container.

### `05_integrations_alerts.png`
* **Caption:** Showcases the Integrations grid and the Live Alert Feed container. This demonstrates the data-dense integration card tiles layout and a prioritized alert queue with highlighted severity tags.

### `06_decision_intelligence.png`
* **Caption:** Focuses on the Decision Intelligence card showing current AI capabilities alongside the recent decisions. This verifies the layout density requirement by sorting decisions descending by timestamp.

### `07_live_telemetry.png`
* **Caption:** Highlights the Live Telemetry area chart with an active hover tooltip overlay displaying data values. This demonstrates that chart axes, legends, and interactive tooltips are formatted to the specified typography sizes for readability.

### `08_workflow_monitoring.png`
* **Caption:** Captures the Active Workflows table displaying the default view of tasks. This demonstrates the space-efficient row layout, 4-step pipeline status indicators, and the sticky table header layout.

### `9_operator_timeline.png`
* **Caption:** Focuses on the Operator Console showing active operator cards and the activity log timeline feed. This satisfies the requirement of maintaining an activity timeline to eliminate visual empty space.

### `10_runtime_health.png`
* **Caption:** Captures the Runtime Health card showing the health score progress bar, telemetry summary, and component list. It verifies that offline backend services are correctly reported as **Offline** with a `"Connection failed"` detail rather than showing as operational, ensuring accurate integration with all backend status endpoints.

### `11_replay_view.png`
* **Caption:** Shows the Simulation & Replay table with active sessions, inline operation indicators, and progress bars. This demonstrates high information density by replacing repetitive simulation cards with a compact, tabular view.

### `12_evidence_intelligence.png`
* **Caption:** Displays the Evidence & Intelligence section located at the bottom of the dashboard page. This validates that evidence cards containing confidence ratings and categorization icons span the layout.

### `13_desktop_1920x1080.png`
* **Caption:** Shows the complete system dashboard styled for 1920×1080 screen viewports. This confirms the page structure scales properly to maintain a clean layout balance without clipping content.

### `14_tablet_768x1024.png`
* **Caption:** Shows the dashboard reflowing to a tablet viewport layout at 768×1024. This confirms the responsive grid successfully shifts columns and wraps elements when horizontal space is limited.

### `15_tablet_768x1024.png`
* **Caption:** Alternate tablet viewport showing the dashboard reflowing to a tablet viewport layout.

### `16_mobile_375x667.png`
* **Caption:** Demonstrates the mobile view layout at 375×667 resolution. This validates that all dashboard zones collapse into a single-column layout with vertical scrolling, and integration tiles wrap to a single column.

### `17_loading_state.png`
* **Caption:** Shows a layout card during its query refresh state, displaying loading skeletons. This proves the universal `DashboardCard` wrapper handles asynchronous state transitions gracefully.

### `18_empty_state.png`
* **Caption:** Shows the empty state fallback screen inside a dashboard card when no data is returned from an endpoint. This verifies the layout handles empty response payloads without throwing script errors or displaying broken empty boxes.

### `19_error_recovery.png`
* **Caption:** Shows the red error recovery state card containing a retry action button when an API call fails. This demonstrates that individual zone network issues are contained locally to prevent whole-page failures.

### `20_offline_banner.png`
* **Caption:** Shows the red banner dropping from the header to announce that the client is offline. This verifies the integration of the browser network state listener and the caching behavior that preserves existing data.

### `21_zone_crash.png`
* **Caption:** Displays a zone crash fallback component inside a single layout card, while other panels render normally. This demonstrates that `<ErrorBoundary>` wrappers successfully isolate rendering runtime crashes to their specific card zone.

### `22_api_success.png`
* **Caption:** Displays the Chrome DevTools Network panel showing successful 200 HTTP responses for all 8 backend endpoints. This verifies complete integration and connection between the TanStack query hooks and the FastAPI backend.

### `23_authentication.png`
* **Caption:** Captures the header user menu component showing operator details and current control role. This documents the structural integration points prepared for future authentication provider middleware.

### `24_dark_theme.png`
* **Caption:** Displays the dashboard rendering in its default high-contrast dark color palette. This documents the dark theme design that meets standard operations command room requirements.

### `25_light_theme.png`
* **Caption:** Documents that light theme support is not currently implemented in the command center. Only dark mode is active to minimize eye strain in low-light NOC environments.

### `26_typography_hierarchy.png`
* **Caption:** Highlights the unified 7-level type hierarchy applied across all dashboard views. This confirms the typography pass has been successfully executed, standardizing font sizes from the 21px title down to 11px metadata.

### `27_lighthouse_report.png`
* **Caption:** Displays the Lighthouse audit report score breakdown. This shows a high level of compliance for Best Practices, SEO optimization, and accessibility.
