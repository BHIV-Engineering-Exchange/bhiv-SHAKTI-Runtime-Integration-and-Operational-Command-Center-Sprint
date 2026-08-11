# Environment Configuration Audit

This document inventories the environment variables consumed by the SHAKTI Command Center frontend, mapping them to their respective backend services and files.

> [!WARNING]
> Production authentication keys, execution secrets, and signatures have been completely sanitized from this audit to comply with security requirements.

---

## Environment Variables Mapping Matrix

| Variable Name | Backend Service | Primary Purpose | Used? | Consumption File / Location |
|---|---|---|---|---|
| **VITE_CONTROL_PLANE_URL** | Control Plane | Base URL for system status, telemetry, metrics, and operations dashboard. | **Yes** | [src/api/client.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/client.ts#L4) |
| **VITE_BUCKET_SERVICE_URL** | BHIV Bucket | Base URL for fetching artifacts, Merkle chain states, and audit trails. | **Yes** | [src/api/bucketEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/bucketEndpoints.ts#L14) |
| **VITE_PRANA_SERVICE_URL** | BHIV Prana | Base URL for replication telemetry and node propagation logging. | **Yes** | [src/api/pranaEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/pranaEndpoints.ts#L8) |
| **VITE_NIYANTRAN_URL** | Niyantran | Base URL for Active Engineers capacity, aims, task statistics, and locations. | **Yes** | [src/api/niyantranEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/niyantranEndpoints.ts#L22) |
| **VITE_NIYANTRAN_EXECUTION_KEY** | Niyantran | Cryptographic execution token attached to requests as `x-execution-key` header. | **Yes** | [src/api/niyantranEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/niyantranEndpoints.ts#L25) |
| **VITE_NIYANTRAN_AUTH_TOKEN** | Niyantran | Administrator session authentication token attached as `x-auth-token` header. | **Yes** | [src/api/niyantranEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/niyantranEndpoints.ts#L38) |
| **VITE_INSIGHTFLOW_URL** | InsightFlow | Base URL for tracking write queues, sync statistics, and stage metrics. | **Yes** | [src/api/insightflowEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/insightflowEndpoints.ts#L9) |
| **VITE_TANTRA_BASE_URL** | Tantra | Base URL for elevated timeout telemetry. | **Yes** | [src/api/tantraEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/tantraEndpoints.ts#L9) |
| **VITE_TANTRA_BRIDGE_SIGNATURE** | Tantra | Cryptographic authorization header signature attached as Bearer token. | **Yes** | [src/api/tantraEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/tantraEndpoints.ts#L29) |
| **VITE_RAJYA_BASE_URL** | Rajya | Base URL for risk scoring check. | **Yes** | [src/api/rajyaEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/rajyaEndpoints.ts#L4) |
| **VITE_SANSKAR_BASE_URL** | Sanskar | Base URL for Moderation, decision states, and ranking telemetry. | **Yes** | [src/api/sanskarEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/sanskarEndpoints.ts#L4) |
| **VITE_KARMA_URL** | Karma | Base URL for punya/paap ratios, lineages, and analytics flow. | **Yes** | [src/api/karmaEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/karmaEndpoints.ts#L3) |
| **VITE_KESHAV_URL** | Keshav | Base URL for requests latency, unique trace, and errors tracking. | **Yes** | [src/api/keshavEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/keshavEndpoints.ts#L7) |
| **VITE_SETU_URL** | Setu | Base URL for project roadmap, milestone metrics, and assignments. | **Yes** | [src/api/setuEndpoints.ts](file:///c:/Pratik_Bhuwad/shakti-command-center/src/api/setuEndpoints.ts#L10) |
