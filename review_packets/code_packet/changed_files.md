# Changed Files

Summary of all frontend files changed in the `shakti-command-center/` repository during these sprints.

## Components & Layouts

1.  **[`ExecutiveLayout.tsx`](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/layouts/ExecutiveLayout.tsx)**
    *   *Updates*: Re-arranged card cols mapping to `grid-cols-2 md:grid-cols-6` to distribute 12 status cards symmetrically into exactly 2 rows on desktop.
2.  **[`RuntimeHealthLayout.tsx`](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/layouts/RuntimeHealthLayout.tsx)**
    *   *Updates*: Fixed status parser mapping logic to translate service status values correctly.
3.  **Other Layouts**
    *   *Updates*: Applied fixed max-height constraints and internal scrolls on Workflow, Decision Intelligence, Integration, Operator Console, Replay, and Evidence layouts.

## API Clients

1.  **[`setuEndpoints.ts`](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/setuEndpoints.ts)**
    *   *Updates*: Added `ngrok-skip-browser-warning: true` header to bypass browser warnings.
2.  **[`keshavEndpoints.ts`](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/keshavEndpoints.ts)**
    *   *Updates*: Included try/catch fallbacks to prevent CORS exceptions.
3.  **Environment Cleanup**
    *   *Updates*: Modified all API endpoint files (e.g. `insightflowEndpoints.ts`, `rajyaEndpoints.ts`, etc.) to default to empty string fallback (`|| ""`) instead of hardcoded hostnames, forcing config from `.env`.

## Automated Tests

1.  **[`DecisionIntelligenceLayout.test.tsx`](file:///c:/Pratik_Bhuwad/shakti-command-center/src/test/DecisionIntelligenceLayout.test.tsx)**
    *   *Role*: Added specs for verifying mock hook orchestration and details of the decision intelligence logs list.
2.  **[`integration.test.tsx`](file:///c:/Pratik_Bhuwad/shakti-command-center/src/test/integration.test.tsx)**
    *   *Role*: Added integration verification for dashboard context and routing states.
