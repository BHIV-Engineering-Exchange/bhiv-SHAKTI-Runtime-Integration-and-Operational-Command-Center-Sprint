# SHAKTI Command Center — Manual Test Checklist

> **Tester Instructions:** Execute each test case in order. Mark PASS/FAIL in the Result column. Record any observations in the Notes column. All tests assume the active backends are running locally or connected via ngrok/Render tunnels.

---

## 1. Application Startup

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|---|---|---|---|---|
| 1.1 | Cold start | Run `npm run dev`, open `http://localhost:5173` | Dashboard loads with skeleton states, then populates with live data | | |
| 1.2 | TypeScript compilation | Run `npx tsc --noEmit` | Zero compilation errors | | |
| 1.3 | Production build | Run `npm run build` | Build completes successfully in < 1s | | |
| 1.4 | Production preview | Run `npm run preview` after build | Dashboard renders identically to dev mode | | |

---

## 2. Executive Summary (Row 1)

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|---|---|---|---|---|
| 2.1 | Service cards render | Inspect the Executive Summary row | 12 service status cards visible (Sanskar, Setu, Niyantran, Control Plane, Karma, Keshav, Rajya, Tantra, Bucket, Prana, InsightFlow, Rajya) | | |
| 2.2 | Grid alignment | Verify grid arrangement on desktop | 12 cards align symmetrically into exactly 2 rows of 6 cards each | | |
| 2.3 | Status mapping colors | Check active mapping colors | online/healthy is green; warning is yellow; degraded/offline/failed is amber/red | | |

---

## 3. BHIV Operations & Ecosystem (Row 2, Left)

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|---|---|---|---|---|
| 3.1 | Capabilities grid | Inspect the capabilities grid | Renders a scrollable grid list of BHIV Ecosystem capabilities (Bucket, Replay, PRANA, KARMA, etc.) | | |
| 3.2 | Active operations list | Count visible active operations | Renders active operations list with severity colors and progress bars. Scrollable if items overflow. | | |
| 3.3 | Title and metadata | Verify source badge | Card is titled "BHIV Operations & Ecosystem Capabilities", source shows "Control Plane" | | |

---

## 4. Integrations & Alerts (Row 2, Right)

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|---|---|---|---|---|
| 4.1 | Integration tiles | Inspect the tile grid | Integration tiles render in 3-column grid on desktop, scaling to 2 cols on laptop, 1 col on mobile | | |
| 4.2 | Alert feed | Inspect the "Live Alert Feed" section | Alerts render with severity icons, source badges, and timestamps inside a `max-h-[200px]` scroll wrapper | | |

---

## 5. Decision Intelligence (Row 3, Left)

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|---|---|---|---|---|
| 5.1 | Capability cards | Inspect the capabilities section | 2 capability cards with status indicators (Predictive Scaling, Load Shedding) | | |
| 5.2 | Recent decisions | Scroll the decisions list | Decision cards show action, actor, reason, and status. Entire list is scrollable within a `max-h-[250px]` container. | | |
| 5.3 | Trajectory analysis | Check KARMA enrichment details | Bottom container renders KARMA Trajectory Analysis (Confidence score & explanation) if data is active | | |

---

## 6. Observability & Telemetry (Row 3, Right)

| # | Test Case | Steps | Expected Result | Result | Notes |
| 6.1 | Telemetry chart | Inspect the area chart | Chart renders with monotone curve lines and Cartesian grids | | |
| 6.2 | Tooltip hover | Hover over chart data points | Custom tooltip appears at 12.5px showing timestamp, event rates, response latency, and `traceId` | | |

---

## 7. Active Workflows (Row 4, Left)

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|---|---|---|---|---|
| 7.1 | Sticky headers | Scroll the table internally | Table headers (`Project ID`, `Project`, `Milestone`, `Status`, `Created Time`) remain sticky at top | | |
| 7.2 | Internal scrolling | Count visible rows | Renders active projects list inside a scrollable `max-h-[280px]` container | | |

---

## 8. Operator Console (Row 4, Right)

| # | Test Case | Steps | Expected Result | Result | Notes |
| 8.1 | Console timeline logs | Scroll the timeline log | Log feed scrolls within a fixed `max-h-[200px]` container | | |

---

## 9. Runtime Health (Row 5, Left)

| # | Test Case | Steps | Expected Result | Result | Notes |
| 9.1 | Component rows | Scroll status table | Sticky headers stay pinned; rows scroll internally in a `max-h-[200px]` container | | |

---

## 10. Simulation & Replay (Row 5, Right)

| # | Test Case | Steps | Expected Result | Result | Notes |
| 10.1 | Sessions list | Scroll the sessions table | Table scrolls within a fixed `max-h-[220px]` container | | |

---

## 11. Evidence & Intelligence (Row 6)

| # | Test Case | Steps | Expected Result | Result | Notes |
| 11.1 | Blueprint and artifacts | Verify layout columns | evidence list and artifact blueprint instructions render in side-by-side columns spanning full width | | |

---

## 12. BHEX Surface Surfaces (Rows 7-12)

| # | Test Case | Steps | Expected Result | Result | Notes |
| 12.1 | Registry layouts | Check registries (Repository, Build, Capability) | Renders placeholder details and total counts | | |
| 12.2 | Queues layouts | Check queues (Migration, Review) | Renders active queue stats placeholders | | |
| 12.3 | Employee execution | Check employee maps | Renders AIMS employee execution panels from Niyantran | | |
| 12.4 | Engineering capacity | Check capacity charts | Renders developer availability states from Niyantran | | |
| 12.5 | Delivery intelligence | Check aims checklist | Renders Sprint Aims milestone trackers from Niyantran | | |
| 12.6 | Dependency graph | Check interactive SVG graph | Renders Karma lineage node connections in SVG | | |
