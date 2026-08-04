# Integration Guide

How to integrate SHAKTI Executive Dashboard into existing Backend Control Planes.

## Base URL Configuration
All backend API client base URLs are controlled strictly via environment variables. Create a `.env` file in the root of the project to configure them.

### Active Backend Services Environment Variables
```env
VITE_CONTROL_PLANE_URL="http://127.0.0.1:8009"
VITE_BUCKET_SERVICE_URL="https://bhiv-bucket-i1l6.onrender.com"
VITE_PRANA_SERVICE_URL="http://163.128.209.18:8103"
VITE_NIYANTRAN_URL="http://localhost:5001"
VITE_NIYANTRAN_EXECUTION_KEY="59d175200c3e26b42ba1532cd40090532b3e59c93be652311acbcdd6155dbb13159d8125a48364672d6c1d3d868fc2cf"
VITE_NIYANTRAN_AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsInJvbGUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5Ac2hha3RpLmNvbSIsImlhdCI6MTc4NTU2NTU1N30.oYs-Mwl7iTEOWuakmM65prM38_d0hJWasDxAoJPCCPc"
VITE_INSIGHTFLOW_URL="https://bhiv-svacs.onrender.com"
VITE_TANTRA_BASE_URL="https://tantra-gated-bridge-infrastructure.onrender.com"
VITE_TANTRA_BRIDGE_SIGNATURE="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_issued_by_sarathi"
VITE_RAJYA_BASE_URL="https://text-risk-scoring-service.onrender.com"
VITE_SANSKAR_BASE_URL="http://localhost:8000"
VITE_KARMA_URL="http://163.128.209.18:8102"
VITE_KESHAV_URL="https://keshav-cia7.onrender.com"
VITE_SETU_URL="https://db05-2409-40c2-103d-46f0-9d7b-3c78-2cde-82d4.ngrok-free.app"
```

*Note: Standard web servers ignore the custom `"ngrok-skip-browser-warning": "true"` bypass header sent by Setu and InsightFlow clients, but it is required to bypass the warning landing page when deploying behind an active ngrok tunnel.*

---

## Mocking API Data
If you are developing without a backend, the dashboard expects JSON payloads adhering exactly to the TypeScript interfaces defined in `src/types/api.ts` (API structure contracts) and `src/types/runtime.ts` (detailed service models).

Example Endpoint Expectation for `/projects` in `src/types/setu.ts`:
```json
[
  {
    "id": "proj_01",
    "name": "SETU Dashboard Integration",
    "description": "Active operational workflow integration",
    "created_at": "2026-08-04T15:20:00.000Z"
  }
]
```

---

## Authentication & Authorization
Currently, auth is mocked on the frontend for development speed.
- Refer to `src/hooks/useAuth.ts` and `src/hooks/useAuthorization.ts`.
- To integrate with a real backend, replace the mock returns in these hooks with your standard JWT decoding logic or OAuth provider hooks.
- The rest of the dashboard uses `hasRole()` and `hasPermission()` from these hooks, so the UI will adapt automatically once the integration is swapped.
