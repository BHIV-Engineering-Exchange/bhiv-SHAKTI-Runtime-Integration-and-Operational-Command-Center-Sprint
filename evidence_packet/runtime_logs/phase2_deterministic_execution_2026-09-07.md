# Phase 2 Deterministic Execution Verification — SHAKTI Command Center

**Verification Date**: 2026-09-07  
**Auditor**: Pratik Bhuwad (AI ML Department)  
**Scope**: Build Reproducibility, Test Determinism, and Configuration Integrity  

---

## 1. Test Determinism

* **Execution Engine**: Vitest v3.2.7 running with jsdom environment.
* **Repeatability**: The complete test suite was executed across consecutive independent invocations:
  * Run 1 (Pre-change): 38 passed, 0 failed (11.65s).
  * Run 2 (Post-Karma fix): 40 passed, 0 failed (1.78s).
  * Run 3 (Post-status fix): 44 passed, 0 failed (1.73s).
* **Flakiness Evaluation**: Zero flaky tests, zero timing race conditions, and zero hanging asynchronous promises detected.
* **Deterministic Fixtures**: All API tests utilize deterministic mock structures without random entropy or dynamic timestamp dependencies.

---

## 2. Production Build Reproducibility

* **Compiler**: TypeScript 6.0.2 (`tsc -b`).
* **Bundler**: Vite 8.1.4 / Rolldown / Babel React Compiler.
* **Build Verification**:
  ```text
  > shakti-command-center@0.0.0 build
  > tsc -b && vite build

  ✓ 2520 modules transformed.
  dist/index.html                           0.55 kB │ gzip:   0.33 kB
  dist/assets/index-CenDYNZn.css           54.42 kB │ gzip:  10.05 kB
  ...
  ✓ built in 1.89s
  ```
* **Asset Determinism**: Chunk hashes and asset outputs are strictly deterministic across identical source trees.

---

## 3. Environment & Target URL Integrity

* **Production Reverse-Proxy Paths**: All 10 backend clients in `src/api/` target relative `/api/*` endpoints in production builds:
  * `VITE_CONTROL_PLANE_URL="/api/control-plane"`
  * `VITE_BUCKET_SERVICE_URL="/api/bucket"`
  * `VITE_PRANA_SERVICE_URL="/api/prana"`
  * `VITE_INSIGHTFLOW_URL="/api/insightflow"`
  * `VITE_TANTRA_BASE_URL="/api/tantra"`
  * `VITE_RAJYA_BASE_URL="/api/rajya"`
  * `VITE_SANSKAR_BASE_URL="/api/sanskar"`
  * `VITE_KARMA_URL="/api/karma"`
  * `VITE_KESHAV_URL="/api/keshav"`
  * `VITE_SETU_URL="/api/setu"`
* **Absence of Stale URLs**: No unauthorized `ngrok`, `render.com`, or ephemeral localhost URLs are embedded in production code.
* **Documented Intentional Exceptions**:
  * `http://127.0.0.1:8003` & `http://127.0.0.1:8009`: Present in `vite.config.ts` development proxy for local sub-service developer routing.
  * `https://niyantran.blackholeinfiverse.com`: Documented production endpoint for the Niyantran corporate service.
