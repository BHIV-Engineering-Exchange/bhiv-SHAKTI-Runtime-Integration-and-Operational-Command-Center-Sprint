# Testing Results

This document contains the local verification records for the build process and automated test suite of the SHAKTI Command Center.

---

## 1. Production Bundle Build Verification

*   **Command**: `npm run build`
*   **Status**: **SUCCESS**
*   **Duration**: 3.64 seconds
*   **Code Compilation**: Built cleanly without any warnings or type mismatches.

### Asset Distribution (Standard Output):
```text
vite v8.1.4 building client environment for production...
transforming...✓ 4953 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                            0.54 kB │ gzip:   0.32 kB
dist/assets/index-DNc2e5Q_.css                            62.17 kB │ gzip:  11.00 kB
dist/assets/clock-DrL3bq44.js                              0.15 kB │ gzip:   0.15 kB
dist/assets/search-CDyUO23R.js                             0.16 kB │ gzip:   0.16 kB
dist/assets/circle-check-BZqDHUuV.js                       0.16 kB │ gzip:   0.15 kB
dist/assets/circle-check-big-BHV76006.js                   0.18 kB │ gzip:   0.17 kB
dist/assets/user-DWP57f9b.js                               0.18 kB │ gzip:   0.17 kB
dist/assets/git-branch-CdoFncfT.js                         0.21 kB │ gzip:   0.18 kB
dist/assets/user-check-VUweLkSp.js                         0.23 kB │ gzip:   0.19 kB
dist/assets/circle-alert-D-1qMj3I.js                       0.23 kB │ gzip:   0.17 kB
dist/assets/clipboard-check-rblOFYZr.js                    0.29 kB │ gzip:   0.22 kB
dist/assets/shield-check-CnXQ82H_.js                       0.30 kB │ gzip:   0.23 kB
dist/assets/shield-alert-B1QzD4ma.js                       0.34 kB │ gzip:   0.25 kB
dist/assets/folder-git-2-DmL_UVgX.js                       0.35 kB │ gzip:   0.24 kB
dist/assets/file-text-BKhmQcSU.js                          0.37 kB │ gzip:   0.24 kB
dist/assets/triangle-alert-ImxTr8d-.js                     0.40 kB │ gzip:   0.26 kB
dist/assets/layers-ga5fHX3i.js                             0.41 kB │ gzip:   0.23 kB
dist/assets/octagon-alert-B38TiG00.js                      0.41 kB │ gzip:   0.24 kB
dist/assets/server-DQ6pAACM.js                             0.47 kB │ gzip:   0.28 kB
dist/assets/useKeshavQueries-WVYMMv76.js                   0.87 kB │ gzip:   0.52 kB
dist/assets/useSetuQueries-Cmr1Kzfu.js                     0.89 kB │ gzip:   0.45 kB
dist/assets/users-D_P_xmyv.js                              0.89 kB │ gzip:   0.48 kB
dist/assets/usePranaQueries-CJ_EMcNh.js                    0.94 kB │ gzip:   0.50 kB
dist/assets/useNiyantranQueries-BFilpCoi.js                0.96 kB │ gzip:   0.35 kB
dist/assets/useSanskarQueries-uuQ7rCpw.js                  1.37 kB │ gzip:   0.75 kB
dist/assets/useBucketQueries-Cdnue4Dn.js                   2.10 kB │ gzip:   0.74 kB
dist/assets/useKarmaQueries-BbHNAy8q.js                    2.13 kB │ gzip:   0.71 kB
dist/assets/WorkflowLayout-BK5WG0FP.js                     3.42 kB │ gzip:   1.39 kB
dist/assets/useQueries-x6fvO5BG.js                         3.45 kB │ gzip:   1.47 kB
dist/assets/useTantraQueries-CO5NYl86.js                   3.73 kB │ gzip:   1.31 kB
dist/assets/ReviewQueueLayout-DNt8ednP.js                  3.81 kB │ gzip:   1.29 kB
dist/assets/BuildRegistryLayout-DiwU_ndH.js                4.60 kB │ gzip:   1.55 kB
dist/assets/RepositoryRegistryLayout-DebaHeSp.js           4.82 kB │ gzip:   1.43 kB
dist/assets/MigrationQueueLayout-dW5UoGjk.js               5.07 kB │ gzip:   1.71 kB
dist/assets/EmployeeExecutionLayout-BCCQPSoa.js            5.30 kB │ gzip:   1.90 kB
dist/assets/EngineeringCapacityLayout-BTNQV4Xp.js          5.69 kB │ gzip:   1.74 kB
dist/assets/DeliveryIntelligenceLayout-iYwTB5Kb.js         6.03 kB │ gzip:   1.86 kB
dist/assets/ReplayLayout-Dku7nFU7.js                       6.07 kB │ gzip:   2.15 kB
dist/assets/IntegrationLayout-Be1xlzyf.js                  6.87 kB │ gzip:   2.45 kB
dist/assets/ExecutiveLayout-BmKm6Yv8.js                    7.04 kB │ gzip:   2.58 kB
dist/assets/OperatorConsoleLayout-DdqlAoOY.js              7.15 kB │ gzip:   2.66 kB
dist/assets/CapabilityRegistryLayout-CwYzlGIC.js           8.58 kB │ gzip:   2.51 kB
dist/assets/DecisionIntelligenceLayout-BKlL7wWi.js         8.97 kB │ gzip:   3.18 kB
dist/assets/RuntimeHealthLayout-Ca3gKdkv.js               11.39 kB │ gzip:   3.58 kB
dist/assets/OperationsLayout-B9jrtjzV.js                  12.11 kB │ gzip:   3.68 kB
dist/assets/useQueries-DdemMW5h.js                        13.91 kB │ gzip:   4.29 kB
dist/assets/CapabilityDependencyGraphLayout-B9_AZCU-.js   15.36 kB │ gzip:   4.68 kB
dist/assets/EvidenceLayout-PPeiYGhp.js                    19.85 kB │ gzip:   4.21 kB
dist/assets/format-CYE7RN-f.js                            55.52 kB │ gzip:  20.71 kB
dist/assets/src-C_gDga0-.js                               73.88 kB │ gzip:  23.91 kB
dist/assets/index-ClbNpc5b.js                            220.35 kB │ gzip:  69.03 kB
dist/assets/ObservabilityLayout-DVprvg08.js              360.94 kB │ gzip: 104.63 kB

✓ built in 3.64s
```

---

## 2. Automated Unit/Integration Test Verification

*   **Command**: `npm run test`
*   **Status**: **SUCCESS**
*   **Test files run**: 6 passed (6 total)
*   **Tests executed**: 27 passed (27 total)
*   **Duration**: 3.40s

### Standard Output Log:
```text
 RUN  v3.2.7 C:/Pratik_Bhuwad/shakti-command-center

 ✓ src/test/integration.test.tsx (6 tests) 8ms
 ✓ src/test/ErrorBoundary.test.tsx (3 tests) 64ms
 ✓ src/test/DashboardCard.test.tsx (6 tests) 83ms
 ✓ src/test/sdk-smoke.test.tsx (2 tests) 8ms
 ✓ src/test/layouts.test.tsx (6 tests) 133ms
 ✓ src/test/DecisionIntelligenceLayout.test.tsx (4 tests) 138ms

 Test Files  6 passed (6)
      Tests  27 passed (27)
   Start at  17:10:33
   Duration  3.40s (transform 2.87s, setup 871ms, collect 10.12s, tests 434ms, environment 3.99s, prepare 777ms)
```

---

## 3. Production Readiness Recommendation

The test suite coverage verifies:
1.  **Component Mounting**: Verify standard dashboard card components render correctly.
2.  **SDK Integration**: Verify the dashboard layout and SDK state wrappers integrate without runtime crashes.
3.  **Layouts rendering**: Verify all 19 zone layouts render stable structures.
4.  **Error boundaries**: Verify client crashes are gracefully intercepted by parent wrapper components.

The build and test results confirm the repository is locally stable and compile-safe for production deployment.
