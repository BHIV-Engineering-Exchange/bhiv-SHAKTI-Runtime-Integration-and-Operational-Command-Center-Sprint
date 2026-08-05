# SHAKTI Command Center — Evidence Checklist

> **Instructions:** Capture each screenshot listed below and save it in this `evidence/` folder using the exact filename specified. Use Chrome DevTools device toolbar to set viewport dimensions where indicated. All screenshots should be in PNG format.

---

## 1. Dashboard Startup

| Field | Value |
|---|---|
| **Filename** | `01_dashboard_startup.png` |
| **Navigate to** | `http://localhost:5173` — perform a hard refresh (Ctrl+Shift+R) |
| **How to trigger** | Clear browser cache, then reload. Capture within the first 1–2 seconds before data loads. |
| **Caption** | SHAKTI dashboard cold start — skeleton loading placeholders visible across all zones before live API data arrives. |
| **Mandatory** | ✅ Yes |

---

## 2. Executive Overview

| Field | Value |
|---|---|
| **Filename** | `02_Dashboard_overview-1.png`, `02_Dashboard_overview-2.png`, `02_Dashboard_overview-3.png`, and `02_Dashboard_overview--4.png` |
| **Navigate to** | `http://localhost:5173` — wait for all zones to populate with live data |
| **How to trigger** | Ensure backend is running. Set viewport to standard desktop size. Capture the page section by section. |
| **Caption** | Executive overview screenshots showing all dashboard zones populated with live operational data. |
| **Mandatory** | ✅ Yes |

---

## 3. Executive Summary KPI Row

| Field | Value |
|---|---|
| **Filename** | `03_executive_kpis.png` |
| **Navigate to** | `http://localhost:5173` — focus on the top KPI row (Row 1) |
| **How to trigger** | Zoom or crop to the Executive Summary row showing all KPI cards. |
| **Caption** | Executive Summary KPI cards — metric values with trend indicators and secondary unit suffixes. |
| **Mandatory** | ✅ Yes |

---

## 4. Operations & Compute

| Field | Value |
|---|---|
| **Filename** | `04_operations_compute.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 2, left column |
| **How to trigger** | Capture the Operations & Compute card showing API health tiles and the "Active Operations" list. |
| **Caption** | Operations & Compute zone — API health cards with uptime/latency and active operations list inside scrollable panel. |
| **Mandatory** | ✅ Yes |

---

## 5. Integrations & Alerts

| Field | Value |
|---|---|
| **Filename** | `05_integrations_alerts.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 2, right column |
| **How to trigger** | Capture the integration tile grid and "Live Alert Feed" section below it. |
| **Caption** | Integrations & Alerts — integration tile grid with connection status and live alert feed with severity-coded entries. |
| **Mandatory** | ✅ Yes |

---

## 6. Decision Intelligence

| Field | Value |
|---|---|
| **Filename** | `06_decision_intelligence.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 3, left column |
| **How to trigger** | Capture the Decision Intelligence card showing capability cards and the "Recent Decisions" section. |
| **Caption** | Decision Intelligence — capability engagement indicators and latest decisions sorted descending by timestamp. |
| **Mandatory** | ✅ Yes |

---

## 7. Observability & Live Telemetry

| Field | Value |
|---|---|
| **Filename** | `07_live_telemetry.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 3, right column |
| **How to trigger** | Hover over a data point on the area chart to make the tooltip visible before capturing. |
| **Caption** | Observability & Telemetry — area chart with gradient fills, axis labels, summary metrics, and hover tooltip. |
| **Mandatory** | ✅ Yes |

---

## 8. Active Workflows

| Field | Value |
|---|---|
| **Filename** | `08_workflow_monitoring.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 4, left column |
| **How to trigger** | Capture showing workflows table with ID, workflow name, active step, owner, pipeline steps progress, and priority badges. |
| **Caption** | Active Workflows table — tasks with progress status indicators, owners, and sticky headers. |
| **Mandatory** | ✅ Yes |

---

## 9. Operator Console & Timeline

| Field | Value |
|---|---|
| **Filename** | `9_operator_timeline.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 4, right column |
| **How to trigger** | Capture the Operator Console showing agent cards and the Activity Log timeline below. |
| **Caption** | Operator Console — agent status cards and activity timeline logs. |
| **Mandatory** | ✅ Yes |

---

## 10. Runtime Health

| Field | Value |
|---|---|
| **Filename** | `10_runtime_health.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 5, left column |
| **How to trigger** | Stop one or more backend services (like SANSKAR, KESHAV, or RAJYA). Capture the Runtime Health card showing the offline components correctly marked as **Offline** (red dot) with **Connection failed** details, alongside the health progress bar, KPI strip, and active component list. |
| **Caption** | Runtime Health — health score progress bar, summary KPIs, and component statuses reflecting true backend network states. |
| **Mandatory** | ✅ Yes |

---

## 11. Simulation & Replay

| Field | Value |
|---|---|
| **Filename** | `11_replay_view.png` |
| **Navigate to** | `http://localhost:5173` — focus on Row 5, right column |
| **How to trigger** | Capture the Simulation & Replay card showing active session rows with progress bars and session parameters. |
| **Caption** | Simulation & Replay — sessions with status icons, operation names, and progress bars. |
| **Mandatory** | ✅ Yes |

---

## 12. Evidence & Intelligence

| Field | Value |
|---|---|
| **Filename** | `12_evidence_intelligence.png` |
| **Navigate to** | `http://localhost:5173` — scroll to Row 6 (bottom of page) |
| **How to trigger** | Capture the full-width Evidence & Intelligence section. |
| **Caption** | Evidence & Intelligence — full-width evidence cards with category icons, confidence scores, and operational intelligence data. |
| **Mandatory** | ✅ Yes |

---

## 13. Desktop 1920×1080

| Field | Value |
|---|---|
| **Filename** | `13_desktop_1920x1080.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Set DevTools device toolbar to exactly 1920×1080. Capture the viewport. |
| **Caption** | Desktop viewport at 1920×1080 — primary target resolution showing the dashboard layout. |
| **Mandatory** | ✅ Yes |

---

## 14. Tablet 768×1024

| Field | Value |
|---|---|
| **Filename** | `14_tablet_768x1024.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Set DevTools device toolbar to 768×1024 (iPad portrait). Capture the visible viewport. |
| **Caption** | Tablet viewport at 768×1024 — zones reflowing stack grid. |
| **Mandatory** | ✅ Yes |

---

## 15. Tablet 768×1024 (Alt)

| Field | Value |
|---|---|
| **Filename** | `15_tablet_768x1024.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Set DevTools device toolbar to 768×1024 (iPad portrait). Capture alternative viewport layout. |
| **Caption** | Tablet alternate viewport showing responsive layout reflows. |
| **Mandatory** | ✅ Yes |

---

## 16. Mobile 375×667

| Field | Value |
|---|---|
| **Filename** | `16_mobile_375x667.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Set DevTools device toolbar to 375×667 (iPhone SE). Capture the visible viewport. |
| **Caption** | Mobile viewport at 375×667 — all zones stack to single column, header elements collapse, no horizontal overflow. |
| **Mandatory** | ✅ Yes |

---

## 17. Loading State

| Field | Value |
|---|---|
| **Filename** | `17_loading_state.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Capture during the brief startup loading skeleton window. |
| **Caption** | Loading state — DashboardCard skeleton placeholders displayed while API data is loading. |
| **Mandatory** | ✅ Yes |

---

## 18. Empty State

| Field | Value |
|---|---|
| **Filename** | `18_empty_state.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Verify fallback message (e.g. "No active workflows") display when backend lists are empty. |
| **Caption** | Empty state — informational message displayed inside a card when the backend returns zero items. |
| **Mandatory** | ✅ Yes |

---

## 19. Error State & Recovery

| Field | Value |
|---|---|
| **Filename** | `19_error_recovery.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Block a dashboard API request in Network tab. Capture when the card shows the red error panel with "Retry" button. |
| **Caption** | Error state — red "Failed to load data" panel with Retry button; other zones continue displaying live data. |
| **Mandatory** | ✅ Yes |

---

## 20. Offline Banner

| Field | Value |
|---|---|
| **Filename** | `20_offline_banner.png` |
| **Navigate to** | `http://localhost:5173` — let data load first |
| **How to trigger** | Set network throttling to offline in DevTools. Capture the warning banner. |
| **Caption** | Offline detection — yellow warning cached banner, dashboard retains last cached data below. |
| **Mandatory** | ✅ Yes |

---

## 21. Zone Crash & ErrorBoundary

| Field | Value |
|---|---|
| **Filename** | `21_zone_crash.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Trigger a react render crash. Capture the ErrorBoundary zone crash panel while others render fine. |
| **Caption** | Zone-isolated crash — ErrorBoundary contains the failure to one zone. |
| **Mandatory** | ✅ Yes |

---

## 22. API Success (DevTools)

| Field | Value |
|---|---|
| **Filename** | `22_api_success.png` |
| **Navigate to** | `http://localhost:5173` — open DevTools → Network tab |
| **How to trigger** | Capture XHR requests resolving to 200 OK responses. |
| **Caption** | API integration — Chrome DevTools Network tab showing successful 200 responses. |
| **Mandatory** | ✅ Yes |

---

## 23. Authentication Surface

| Field | Value |
|---|---|
| **Filename** | `23_authentication.png` |
| **Navigate to** | `http://localhost:5173` — focus on header, top-right area |
| **How to trigger** | Capture the user avatar badge and control role in the header. |
| **Caption** | Authentication surface — operator identity badge in header. |
| **Mandatory** | ⚠️ Applicable only |

---

## 24. Dark Theme (Default)

| Field | Value |
|---|---|
| **Filename** | `24_dark_theme.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Capture full viewport showing the slate high-contrast dark theme colors. |
| **Caption** | Dark theme — the standard and only implemented theme variant. |
| **Mandatory** | ✅ Yes |

---

## 25. Light Theme

| Field | Value |
|---|---|
| **Filename** | `25_light_theme.png` |
| **Navigate to** | N/A |
| **How to trigger** | N/A — light theme is not implemented. |
| **Caption** | Light theme is not available. Only dark mode is supported. |
| **Mandatory** | ⚠️ Not applicable |

---

## 26. Typography Hierarchy

| Field | Value |
|---|---|
| **Filename** | `26_typography_hierarchy.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Crop or annotate the screenshot showing 7-level typography scales. |
| **Caption** | Typography hierarchy — 7-level type scale for consistent visual scanning. |
| **Mandatory** | ✅ Yes |

---

## 27. Lighthouse Audit Report

| Field | Value |
|---|---|
| **Filename** | `27_lighthouse_report.png` |
| **Navigate to** | `http://localhost:5173` |
| **How to trigger** | Run Lighthouse audit in Chrome DevTools. Capture the final audit score dials. |
| **Caption** | Lighthouse audit report — scores showing accessibility, SEO, and best practices parameters. |
| **Mandatory** | ✅ Yes |

---

## Summary Table

| # | Filename | Category | Mandatory |
|---|---|---|---|
| 1 | `01_dashboard_startup.png` | Startup | ✅ |
| 2 | `02_Dashboard_overview-1.png` / `02_Dashboard_overview-2.png` / `02_Dashboard_overview-3.png` / `02_Dashboard_overview--4.png` | Executive Overview | ✅ |
| 3 | `03_executive_kpis.png` | KPI Cards | ✅ |
| 4 | `04_operations_compute.png` | Operations | ✅ |
| 5 | `05_integrations_alerts.png` | Integrations | ✅ |
| 6 | `06_decision_intelligence.png` | Decision Intelligence | ✅ |
| 7 | `07_live_telemetry.png` | Telemetry Chart | ✅ |
| 8 | `08_workflow_monitoring.png` | Workflow Table | ✅ |
| 9 | `9_operator_timeline.png` | Operator Console | ✅ |
| 10 | `10_runtime_health.png` | Runtime Health | ✅ |
| 11 | `11_replay_view.png` | Simulation & Replay | ✅ |
| 12 | `12_evidence_intelligence.png` | Evidence | ✅ |
| 13 | `13_desktop_1920x1080.png` | Responsive — Desktop | ✅ |
| 14 | `14_tablet_768x1024.png` | Responsive — Tablet | ✅ |
| 15 | `15_tablet_768x1024.png` | Responsive — Tablet Alt | ✅ |
| 16 | `16_mobile_375x667.png` | Responsive — Mobile | ✅ |
| 17 | `17_loading_state.png` | Loading State | ✅ |
| 18 | `18_empty_state.png` | Empty State | ✅ |
| 19 | `19_error_recovery.png` | Error Recovery | ✅ |
| 20 | `20_offline_banner.png` | Offline Detection | ✅ |
| 21 | `21_zone_crash.png` | ErrorBoundary | ✅ |
| 22 | `22_api_success.png` | API Integration | ✅ |
| 23 | `23_authentication.png` | Authentication | ⚠️ If applicable |
| 24 | `24_dark_theme.png` | Dark Theme | ✅ |
| 25 | `25_light_theme.png` | Light Theme | ⚠️ Not implemented |
| 26 | `26_typography_hierarchy.png` | Typography | ✅ |
| 27 | `27_lighthouse_report.png` | Lighthouse Audit | ✅ |

**Total: 27 items (24 mandatory, 2 conditional, 1 not applicable)**
