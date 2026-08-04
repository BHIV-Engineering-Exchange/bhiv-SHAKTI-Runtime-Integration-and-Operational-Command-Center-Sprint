# Runtime Integration

The frontend operates completely decoupled from backend constraints, but it relies on a standardized set of microservice APIs to retrieve data.

## API Architecture
Rather than routing all connections through a single backend client, the frontend initializes dedicated Axios clients targeting individual services, enabling parallel fetching and isolated timeouts.

### 1. Axios Clients Inventory
All endpoint clients are configured under `src/api/` and utilize environment variables from `.env`:

| Client | File | Environment Variable | Timeout | Key Configuration |
| --- | --- | --- | --- | --- |
| `apiClient` | `client.ts` | `VITE_CONTROL_PLANE_URL` | 300,000ms | Global Control Plane calls |
| `karmaClient` | `karmaEndpoints.ts` | `VITE_KARMA_URL` | 15,000ms | Lineage and analytics |
| `setuClient` | `setuEndpoints.ts` | `VITE_SETU_URL` | 10,000ms | Skip browser warning header (ngrok) |
| `niyantranClient` | `niyantranEndpoints.ts` | `VITE_NIYANTRAN_URL` | 15,000ms | Execution keys and auth headers |
| `pranaClient` | `pranaEndpoints.ts` | `VITE_PRANA_URL` | 10,000ms | System forwarding and logs |
| `bucketClient` | `bucketEndpoints.ts` | `VITE_BUCKET_SERVICE_URL` | 15,000ms | Audit logs and artifacts storage |
| `insightflowClient` | `insightflowEndpoints.ts` | `VITE_INSIGHTFLOW_URL` | 15,000ms | Skip browser warning header (ngrok) |
| `rajyaClient` | `rajyaEndpoints.ts` | `VITE_RAJYA_BASE_URL` | 30,000ms | Render cold starts tolerance |
| `tantraClient` | `tantraEndpoints.ts` | `VITE_TANTRA_BASE_URL` | 30,000ms | Render cold starts tolerance |
| `sanskarClient` | `sanskarEndpoints.ts` | `VITE_SANSKAR_BASE_URL` | 15,000ms | Deterministic tracing |
| `keshavClient` | `keshavEndpoints.ts` | `VITE_KESHAV_URL` | 10,000ms | Fail-safe try/catch mock fallback |

---

## 2. React Query Hooks Map
Every dashboard zone fetches data using a custom react query hook located in `src/hooks/`:

### Control Plane Hooks (`useQueries.ts`)
- `useHealth()` -> `GET /health`
- `useSystemStatus()` -> `GET /system/status` (fetches status list)
- `useMetrics()` -> `GET /metrics`
- `useExecutiveDashboard()` -> `GET /dashboard/executive` (Placeholder)
- `useOperationsDashboard()` -> `GET /dashboard/operations`
- `useAlertsDashboard()` -> `GET /dashboard/alerts`
- `useRuntimeDashboard()` -> `GET /dashboard/runtime` (Simulation sessions)
- `useTelemetryDashboard()` -> `GET /dashboard/telemetry`
- `useRepositoryRegistry()` -> Placeholder
- `useBuildRegistry()` -> Placeholder
- `useMigrationQueue()` -> Placeholder
- `useReviewQueue()` -> Placeholder
- `useCapabilityRegistry()` -> Placeholder

### Karma Hooks (`useKarmaQueries.ts`)
- `useKarmaHealth()` -> `GET /health`
- `useKarmaLineage()` -> `GET /intelligence/lineage`
- `useKarmaConfidence()` -> `GET /intelligence/confidence/{id}`
- `useKarmaReasoning()` -> `GET /intelligence/reasoning/{id}`
- `useKarmaLiveMetrics()`, `useKarmaTrends()`, `useKarmaDharmaSevaFlow()`, `useKarmaPaapPunyaRatio()` -> Analytics

### Niyantran Hooks (`useNiyantranQueries.ts`)
- `useNiyantranAims()` -> `GET /api/aims`
- `useNiyantranStats()`, `useNiyantranTasksOverview()`, `useNiyantranLeaderboard()`, `useNiyantranExecutionHistory()` -> Stats & Operations

### Setu PMC Hooks (`useSetuQueries.ts`)
- `useSetuProjects()` -> `GET /projects`
- `useSetuProjectMilestones()` -> `GET /projects/{id}/milestones`

### Prana Hooks (`usePranaQueries.ts`)
- `usePranaPropagationLog()` -> `GET /prana/propagation-log`

### Bucket Hooks (`useBucketQueries.ts`)
- `useBucketArtifacts()` -> `GET /bucket/artifacts`
- `useBucketStorageStats()` -> `GET /bucket/storage-stats`

### Tantra Hooks (`useTantraQueries.ts`)
- `useTantraTelemetry()`, `useTantraTelemetrySummary()`

### Rajya Hooks (`useRajyaQueries.ts`)
- `useRajyaHealth()` -> `GET /health`

### Sanskar Hooks (`useSanskarQueries.ts`)
- `useSanskarRanking()` -> `GET /ranking`

---

## 3. Resilience Mechanism (`keepPreviousData`)
All hooks are configured with `@tanstack/react-query`'s `placeholderData: keepPreviousData`. 
If a polling interval triggers and the backend is down, React Query will fail the request, but the hook will **continue returning the last cached `data` object**. The `isStale`/`isError` flags flip, allowing the UI to render an "Offline / Cached Data" warning banner without destroying the existing rendered components.
