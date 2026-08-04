# Reviewer Feedback Resolution

The table below logs the resolution and status of all reviewer feedback tickets for the SHAKTI Command Center dashboard:

| Reviewer Feedback | Resolution Status | Evidence | Notes |
|---|---|---|---|
| Recent Decisions list display makes card excessively tall and pushes operational panels below the fold. | **Completed** | Sorted by `started_at` descending; set max decisions list scroll height to `250px` inside `DecisionIntelligenceLayout.tsx`. | Decisions scroll internally. |
| Improve the Observability & Telemetry card with smooth curves, legends inside chart, and hover tooltip. | **Completed** | Mapped monotone curves, Cartesian grids, inside-right legends, and trace ID tooltip hovers in `TelemetryCard.tsx`. | Enhanced telemetry readability. |
| Convert all data-heavy dashboard cards to use fixed-height containers with internal scrolling instead of expanding layout. | **Completed** | Set height constraints (`max-h-[...]` classes) and `overflow-y-auto` on all layout tables and lists. | Dashboard remains visually stable. |
| Integrations & Alerts cards layout spacing should allow at least 2 rows of components to be properly visible. | **Completed** | Set integrations components grid wrapper max-height to `140px` inside `IntegrationLayout.tsx`. | Both rows are visible without clipping. |
| Symmetrical Executive Layout Card Grid: Distribute 12 command center cards symmetrically into exactly 2 rows of 6 cards each on desktop view. | **Completed** | Configured Executive Layout column span to `grid-cols-2 md:grid-cols-6` in `ExecutiveLayout.tsx` | Cleaned up row arrangement. |
| Clean up environment variables configuration across endpoint handlers to enforce reliance on environment values. | **Completed** | Swapped default fallback addresses to empty strings (`|| ""`) in endpoint configuration modules. | Environment is now single source of truth. |
| Setu API CORS pre-flight blockages when accessing ngrok backend addresses. | **Completed** | Configured `ngrok-skip-browser-warning: true` bypass headers in `setuEndpoints.ts`. | Resolves preflight response blockages. |
