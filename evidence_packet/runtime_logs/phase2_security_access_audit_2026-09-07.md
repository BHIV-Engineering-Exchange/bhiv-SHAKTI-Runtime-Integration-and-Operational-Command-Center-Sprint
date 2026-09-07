# Phase 2 Security & Access Audit Report — SHAKTI Command Center

**Audit Date**: 2026-09-07  
**Auditor**: Pratik Bhuwad (AI ML Department)  
**Classification**: Internal Security Audit (Sensitive values masked)  

---

## 1. Environment & Credential Inventory

| Variable / Key | Purpose | Scope | Value Classification | Risk Assessment | Mitigation / Recommended Action |
|---|---|---|---|---|---|
| `VITE_CONTROL_PLANE_URL` | Base path for Control Plane API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/control-plane`) | Standard relative reverse-proxy configuration. |
| `VITE_BUCKET_SERVICE_URL` | Base path for Bucket Storage API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/bucket`) | Standard relative reverse-proxy configuration. |
| `VITE_PRANA_SERVICE_URL` | Base path for Prana Engine API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/prana`) | Standard relative reverse-proxy configuration. |
| `VITE_INSIGHTFLOW_URL` | Base path for InsightFlow API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/insightflow`) | Standard relative reverse-proxy configuration. |
| `VITE_TANTRA_BASE_URL` | Base path for Tantra Bridge API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/tantra`) | Standard relative reverse-proxy configuration. |
| `VITE_RAJYA_BASE_URL` | Base path for Rajya Enforcement API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/rajya`) | Standard relative reverse-proxy configuration. |
| `VITE_SANSKAR_BASE_URL` | Base path for Sanskar Domain API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/sanskar`) | Standard relative reverse-proxy configuration. |
| `VITE_KARMA_URL` | Base path for Karma Analytics API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/karma`) | Standard relative reverse-proxy configuration. |
| `VITE_KESHAV_URL` | Base path for Keshav Dependency API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/keshav`) | Standard relative reverse-proxy configuration. |
| `VITE_SETU_URL` | Base path for SETU Interface API | Client-side bundle | **Safe Browser-Visible Configuration** | None (Relative URL `/api/setu`) | Standard relative reverse-proxy configuration. |
| `VITE_NIYANTRAN_URL` | Direct URL to Niyantran service | Client-side bundle | **Safe Public URL (`https://niyantran...`)** | Low (Public domain) | Recommend changing to relative `/api/niyantran` to eliminate CORS preflight blocks. |
| `VITE_NIYANTRAN_EXECUTION_KEY` | Execution key header for Niyantran requests | Client-side bundle | **Potentially Exposed Development Key** | Medium (`59d175...[MASKED]`) | Static key baked into dist bundle. Transition to server-side session header injection in Nginx/Vite proxy. |
| `VITE_NIYANTRAN_AUTH_TOKEN` | Fallback JWT token for Niyantran requests | Client-side bundle | **Potentially Exposed Static JWT** | High (`eyJhbGciOi...[MASKED]`) | Static fallback JWT. The frontend code safely prioritizes `WorkflowToken` cookie and `localStorage` before fallback. Migrate to HttpOnly cross-subdomain cookies. |
| `VITE_TANTRA_BRIDGE_SIGNATURE` | Development bridge token for Tantra | Client-side bundle | **Development Mock Token** | Low (`Bearer eyJhb...dummy_token...[MASKED]`) | Dummy development signature. No production privilege granted. |

---

## 2. Browser & Client-Side Access Safety

1. **Authorization Token Hierarchy**:
   In [`src/api/niyantranEndpoints.ts`](file:///c:/Pratik_Bhuwad/SHAKTI/shakti-command-center/src/api/niyantranEndpoints.ts#L44-L67), the request interceptor evaluates credentials in strict order of security:
   ```typescript
   const cookieToken = getCookie("WorkflowToken") || getCookie("x-auth-token") || getCookie("token");
   const localToken = localStorage.getItem("WorkflowToken") || localStorage.getItem("x-auth-token") || localStorage.getItem("token");
   const authToken = cookieToken || localToken || import.meta.env.VITE_NIYANTRAN_AUTH_TOKEN;
   ```
   * First priority: Secure Session Cookies.
   * Second priority: Active `localStorage` user session.
   * Third priority: Static environment fallback for headless testing.

2. **Cross-Origin & Header Hardening**:
   * All API communication routes through same-origin `/api/*` proxies, preventing credentials leakage to external 3rd-party domains.
   * Direct cross-origin credentials (`withCredentials: true`) are isolated to Niyantran API calls.
