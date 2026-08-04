# REVIEW PACKET

SHAKTI Command Center Operational Dashboard Front-End review package.

---

## 1. Executive Summary
This project implements the frontend dashboard for the **SHAKTI Operational Command Center**, designed with a dynamic 19-zone CSS grid, layout error boundaries, universal loading states, and offline cached-data displays.

During these sprints, we successfully improved visual balance and page stability:
- Aligned Executive Summary card columns to exactly 6 columns, rendering 12 service cards in 2 equal rows.
- Converted all variable-length data lists and tables to use **internal vertical scrolling** with custom max-height boundaries, locking default heights.
- Removed all "View All / Show Less" toggle button states from layouts.
- Cleaned up environment variable default fallbacks to default to `""`, forcing reliance on `.env`.
- Added custom headers to Setu API clients to bypass ngrok browser warning pages.
- Standardized UI component health parsing statuses.

---

## 2. Architecture Overview
The frontend is built using **React 19**, **Vite 8**, **TypeScript 6**, **Tailwind CSS 4**, and **TanStack Query 5**.

### Subfolder Structure
All documentation for reviewer review is organized inside the [`review_packets/`](file:///c:/Pratik_Bhuwad/shakti-command-center/review_packets/) directory:
```
review_packets/
├── REVIEW_PACKET.md                      # Master reviewer packet summary
├── demo/
│   └── demo recording.mp4                # Video recording of dashboard functionalities
└── code_packet/
    ├── architecture_overview.md          # Guide to components, directories, and data integration
    ├── changed_files.md                  # Summary of layout and test changes
    ├── runtime_validation.md             # Summary of scroll limits and state validation
    ├── deployment_guide.md               # Guide to compile, run, and preview
    ├── dashboard_walkthrough.md          # Layout walkthrough of the 19 grid zones
    ├── Reviewer_Feedback_Resolution.md   # Resolution checklist tracker
    ├── Evidence_Guide.md                 # Mapping of screenshot files to requirements
    ├── api_samples/
    │   └── README.md                     # Backend API endpoint descriptions
    ├── browser_network/
    │   └── README.md                     # Browser dev tools network checks
    ├── runtime_screenshots/
    │   └── README.md                     # Pointers to UI screenshots in evidence/
    └── deployment_screenshots/
        └── README.md                     # Description of build step captures
```

---

## 3. Frontend Runtime Integration Summary
- **Universal DashboardCard wrapper**: Controls skeleton loaders, error blocks, offline alerts, and caching details uniformly.
- **Scroll Constraints**: Custom max-height bounds limit the layout boxes (e.g. `max-h-[250px]` for Recent Decisions) to prevent dashboard resizing.
- **Sticky Table Headers**: Sticky `thead` elements with solid backgrounds ensure header labels remain fixed at the top of lists during internal scrolls.
- **NGROK Bypass**: Setu and InsightFlow Axios clients pass bypass headers to ensure seamless pre-flight requests when connected to ngrok endpoints.

---

## 4. API Integration Summary
Endpoints are queried across 12 distinct Axios clients configured to point directly to backend services (Control Plane, Karma, Keshav, Setu, Niyantran, Prana, Replay, Bucket, InsightFlow, Rajya, Tantra, Sanskar).

---

## 5. Automated Tests
- **Vitest Unit Suite:** Run with `npm run test` (asserts card state mapping, boundaries, and reset handlers).
- **Playwright E2E Suite:** Run with `npm run test:e2e` (validates layout responsiveness and element presence).
