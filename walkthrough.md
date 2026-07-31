# Walkthrough - TANTRA Gated Bridge Integration

This document summarizes the changes made to integrate the canonical **TANTRA Gated Bridge Runtime** into the **SHAKTI Command Center** dashboard.

---

## Changes Implemented

### 1. New Files Created

- **[types/tantra.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/types/tantra.ts)**: Declares TypeScript interfaces matching the TANTRA Gated Bridge specifications for health responses, telemetry stats, and telemetry summaries.
- **[api/tantraEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/tantraEndpoints.ts)**: Configures a dedicated Axios client with base URL `VITE_TANTRA_BASE_URL` and a high timeout threshold (30,000ms) to withstand Render platform cold starts. Includes an Axios request interceptor attaching the JWT `bridge_signature`. Declares endpoint fetch methods:
  - `GET /health` (`fetchTantraHealth`)
  - `GET /telemetry` (`fetchTantraTelemetry`)
  - `GET /telemetry/summary` (`fetchTantraTelemetrySummary`)
- **[hooks/useTantraQueries.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/hooks/useTantraQueries.ts)**: Implements custom React Query hooks (`useTantraHealth`, `useTantraTelemetry`, and `useTantraTelemetrySummary`) with 10s polling cycles and continuous rendering fallback using `keepPreviousData`.

### 2. Existing Files Modified

- **[.env](file:///c:/Pratik_Bhuwad/shakti-command-center/.env)**: Added `VITE_TANTRA_BASE_URL` and default `VITE_TANTRA_BRIDGE_SIGNATURE` configuration keys.
- **[RuntimeHealthLayout.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/layouts/RuntimeHealthLayout.tsx)**: Invokes `useTantraHealth` and adds a new supplementary row `tantra_gated_bridge` to the system status list, outputting status, version, and uptime fields.
- **[OperationsLayout.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/layouts/OperationsLayout.tsx)**: Fetches TANTRA liveness and summary telemetry to populate a new capability card for `TANTRA Gated Bridge`, rendering status, latency (avg response), total events, and error rate.
- **[ObservabilityLayout.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/layouts/ObservabilityLayout.tsx)**: Integrates `useTantraTelemetry` hook as the 5th priority source in the dashboard's fallback chain. Visualizes TANTRA metric graphs and summaries when higher-priority sources are absent.
- **[EvidenceLayout.tsx](file:///c:/Pratik_Bhuwad/shakti-command-center/src/components/dashboard/layouts/EvidenceLayout.tsx)**: Wrapped all trace, artifact, and signal ID `.slice()` operations in safe optional fallback logic (`(value || "").slice()`) to prevent component crashes when telemetry or audit data feeds carry null/missing identifiers.

---

## Verification & Build Results

The integration was verified by executing a full production build:
```bash
npm run build
```

The command completed successfully with **0 compiler warnings or TypeScript errors**:
- Rolldown bundling succeeded.
- Asset files generated correctly (e.g. `ObservabilityLayout-CZds2bd-.js`, `OperationsLayout-Bi5Qcfwi.js`, `useTantraQueries-Bai32eAR.js`).
