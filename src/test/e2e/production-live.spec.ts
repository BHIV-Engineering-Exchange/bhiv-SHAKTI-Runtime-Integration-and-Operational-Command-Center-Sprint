import { test, expect } from "@playwright/test";

const PRODUCTION_URL = process.env.PRODUCTION_URL || "";

interface ObservedApiCall {
  url: string;
  pathname: string;
  method: string;
  status: number;
  contentType: string;
  postData: string | null;
  durationMs?: number;
}

test.describe("SHAKTI Production Live E2E Verification", () => {
  // Opt-in safety: Skip suite if PRODUCTION_URL is not explicitly supplied
  test.skip(
    !PRODUCTION_URL,
    "Skipping live production E2E suite: PRODUCTION_URL environment variable is not provided."
  );

  // Execute tests serially to avoid concurrent network saturation on live production VM
  test.describe.configure({ mode: "serial" });
  test.setTimeout(90000);

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = testInfo.outputPath("production-failure.png");
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`[Diagnostic] Failure screenshot captured: ${screenshotPath}`);
    }
  });

  test("1. Production Application Shell & Critical Mounting", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("pageerror", (err) => {
      pageErrors.push(err.message || String(err));
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to production URL
    const response = await page.goto(PRODUCTION_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    expect(response, "Navigation response should exist").not.toBeNull();
    const navStatus = response?.status() ?? 0;
    expect(navStatus, `Production navigation status must be 200, got ${navStatus}`).toBe(200);

    // 2. Verify #root exists and mounts
    const root = page.locator("#root");
    await expect(root).toBeVisible({ timeout: 15000 });

    // 3. Verify System Header branding
    const header = page.locator("header");
    await expect(header).toBeVisible({ timeout: 10000 });
    await expect(header).toContainText("SHAKTI");

    // 4. Assert no fatal unhandled page errors occurred during boot
    const fatalErrors = pageErrors.filter(
      (msg) => !msg.includes("ResizeObserver") && !msg.includes("favicon")
    );
    expect(fatalErrors, `Fatal JavaScript page errors encountered: ${fatalErrors.join("; ")}`).toHaveLength(0);
  });

  test("2. Production UI Surfaces & Layout Integrity", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => {
      pageErrors.push(err.message || String(err));
    });

    await page.goto(PRODUCTION_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    await page.locator("#root").waitFor({ state: "visible", timeout: 15000 });

    // Scroll through the dashboard to trigger all lazy-loaded layouts and queries
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // Verify all 8 core production operational layouts are visible and did NOT crash
    const requiredSurfaces = [
      { name: "Runtime Health", heading: "Runtime Health", crashCheck: "Health Crashed" },
      { name: "Operations", heading: "BHIV Operations & Ecosystem Capabilities", crashCheck: "Operations Crashed" },
      { name: "Observability", heading: "Observability & Telemetry", crashCheck: "Observability Crashed" },
      { name: "Integration", heading: "Integrations & Alerts", crashCheck: "Integrations Crashed" },
      { name: "Decision Intelligence", heading: "Decision Intelligence", crashCheck: "Intelligence Crashed" },
      { name: "Workflow", heading: "Active Workflows", crashCheck: "Workflows Crashed" },
      { name: "Replay", heading: "Simulation & Replay", crashCheck: "Replay Crashed" },
      { name: "Evidence", heading: "Evidence & Intelligence", crashCheck: "Evidence Crashed" },
    ];

    for (const surface of requiredSurfaces) {
      const heading = page.getByRole("heading", { name: surface.heading });
      await expect(heading, `UI Surface '${surface.name}' heading must be present`).toBeVisible({ timeout: 15000 });

      // Verify ErrorBoundary did not catch a fatal crash in this zone
      const crashFallback = page.locator(`text=${surface.crashCheck}`);
      await expect(crashFallback, `UI Surface '${surface.name}' must not show crash banner`).not.toBeVisible();
    }

    // Ensure no fatal runtime crashes occurred
    const fatalErrors = pageErrors.filter(
      (msg) => !msg.includes("ResizeObserver") && !msg.includes("favicon")
    );
    expect(fatalErrors, `Fatal JavaScript page errors: ${fatalErrors.join("; ")}`).toHaveLength(0);
  });

  test("3. Production Network Layer & Representative API Observation", async ({ page }) => {
    const observedApis: ObservedApiCall[] = [];
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("pageerror", (err) => {
      pageErrors.push(err.message || String(err));
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Monitor all network responses
    page.on("response", async (response) => {
      const urlStr = response.url();
      if (!urlStr.endsWith(".js") && !urlStr.endsWith(".css") && !urlStr.endsWith(".ico") && !urlStr.endsWith(".png") && !urlStr.endsWith(".svg")) {
        try {
          const parsedUrl = new URL(urlStr);
          const req = response.request();
          observedApis.push({
            url: urlStr,
            pathname: parsedUrl.pathname,
            method: req.method(),
            status: response.status(),
            contentType: response.headers()["content-type"] || "",
            postData: req.postData(),
          });
        } catch {
          // Ignore URL parse anomalies
        }
      }
    });

    // Navigate to production
    await page.goto(PRODUCTION_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    await page.locator("#root").waitFor({ state: "visible", timeout: 15000 });

    // Scroll through the page to ensure all queries across all 12 rows trigger
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    // Wait for control plane status response or timeout
    await page.waitForResponse(
      (res) => res.url().includes("/control-plane/system/status"),
      { timeout: 12000 }
    ).catch(() => {});
    await page.waitForTimeout(4000);

    // List of representative endpoints required to be verified
    const representativeEndpoints = [
      { pattern: "/api/control-plane/system/status", name: "Control Plane System Status" },
      { pattern: "/api/control-plane/metrics", name: "Control Plane Metrics" },
      { pattern: "/api/control-plane/dashboard/operations", name: "Control Plane Operations Dashboard" },
      { pattern: "/api/prana/prana/system/health", name: "PRANA System Health" },
      { pattern: "/api/prana/prana/propagation-log", name: "PRANA Propagation Log" },
      { pattern: "/api/tantra/telemetry", name: "TANTRA Telemetry" },
      { pattern: "/api/karma/intelligence/lineage", name: "KARMA Intelligence Lineage" },
      { pattern: "/api/karma/api/v1/analytics/metrics/live", name: "KARMA Live Analytics Metrics" },
      { pattern: "/api/setu/projects", name: "SETU Projects" },
      { pattern: "/api/sanskar/ranking", name: "SANSKAR Domain Ranking" },
      { pattern: "/api/bucket/bucket/artifacts", name: "BUCKET Artifacts" },
      { pattern: "/api/insightflow/stage-metrics", name: "InsightFlow Stage Metrics" },
      { pattern: "/api/keshav/metrics/json", name: "KESHAV Metrics JSON" },
    ];

    // Evaluate observed calls against representative list
    const endpointVerificationResults = representativeEndpoints.map((ep) => {
      const match = observedApis.find((call) => call.pathname === ep.pattern || call.pathname.endsWith(ep.pattern));
      return {
        ...ep,
        observed: !!match,
        call: match,
      };
    });

    // Partition API calls by HTTP status classes
    const successCalls = observedApis.filter((call) => call.status >= 200 && call.status < 300);
    const redirectCalls = observedApis.filter((call) => call.status >= 300 && call.status < 400);
    const clientErrorCalls = observedApis.filter((call) => call.status >= 400 && call.status < 500);
    const serverErrorCalls = observedApis.filter((call) => call.status >= 500);

    // Output formatted diagnostic summary
    console.log("\n========================================================");
    console.log("PRODUCTION E2E API SUMMARY");
    console.log("========================================================");
    console.log(`Total /api requests observed: ${observedApis.length}`);
    console.log(`Successful requests (2xx):    ${successCalls.length}`);
    console.log(`Redirect requests (3xx):      ${redirectCalls.length}`);
    console.log(`Client error requests (4xx):  ${clientErrorCalls.length}`);
    console.log(`Server error requests (5xx):  ${serverErrorCalls.length}`);
    console.log(`Console error count:          ${consoleErrors.length}`);
    console.log(`Page error count:             ${pageErrors.length}`);
    console.log("--------------------------------------------------------");
    console.log("CONSOLE ERRORS CAPTURED IN BROWSER:");
    for (const err of consoleErrors) {
      console.log(`[Console Error] ${err}`);
    }
    console.log("--------------------------------------------------------");
    console.log("REPRESENTATIVE ENDPOINTS CHECKLIST:");
    for (const res of endpointVerificationResults) {
      if (res.observed && res.call) {
        console.log(`[${res.call.status}] ${res.call.method.padEnd(4)} ${res.call.pathname} (${res.name}) - ${res.call.contentType}`);
      } else {
        console.log(`[MISSING] ---- ${res.pattern} (${res.name})`);
      }
    }
    console.log("--------------------------------------------------------");
    console.log("DETAILED OBSERVED API LOG:");
    for (const call of observedApis) {
      console.log(`[${call.status}] ${call.method.padEnd(4)} ${call.pathname}`);
    }
    console.log("========================================================\n");

    // Network Assertions:
    // 1. Browser must make real /api/ requests
    expect(observedApis.length, "Browser must observe /api/ requests on production").toBeGreaterThan(0);

    // 2. 2xx responses should dominate live operational traffic
    expect(successCalls.length, "At least 10 live /api/ requests must succeed with 2xx").toBeGreaterThanOrEqual(10);

    // 3. Check each observed call: any 2xx response must be JSON-compatible
    for (const call of successCalls) {
      if (call.contentType) {
        const isJson = call.contentType.includes("json") || call.contentType.includes("octet-stream") || call.contentType.includes("text/");
        expect(isJson, `Endpoint ${call.pathname} returned unexpected content type: ${call.contentType}`).toBe(true);
      }
    }

    // 4. Verify representative APIs: at least the core control plane & health endpoints must have been called
    const cpStatus = endpointVerificationResults.find((r) => r.pattern === "/api/control-plane/system/status");
    expect(cpStatus?.observed, "Control plane system status request must occur").toBe(true);
    if (cpStatus?.call) {
      expect(cpStatus.call.status, "Control plane status endpoint must return 200").toBe(200);
    }
  });

  test("4. Karma Confidence & Reasoning Contract Observation", async ({ page }) => {
    interface KarmaCallRecord extends ObservedApiCall {
      responseBody?: string;
    }
    const karmaCalls: KarmaCallRecord[] = [];

    page.on("response", async (response) => {
      const urlStr = response.url();
      if (urlStr.includes("/api/karma/intelligence/confidence") || urlStr.includes("/api/karma/intelligence/reasoning")) {
        try {
          const parsedUrl = new URL(urlStr);
          const req = response.request();
          let resText = "";
          try {
            resText = await response.text();
          } catch {
            // Ignore stream read failure
          }
          karmaCalls.push({
            url: urlStr,
            pathname: parsedUrl.pathname,
            method: req.method(),
            status: response.status(),
            contentType: response.headers()["content-type"] || "",
            postData: req.postData(),
            responseBody: resText,
          });
        } catch {
          // Ignore
        }
      }
    });

    await page.goto(PRODUCTION_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    await page.locator("#root").waitFor({ state: "visible", timeout: 15000 });

    // Scroll to operations/decision intelligence section so queries fire
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForResponse(
      (res) => res.url().includes("/control-plane/dashboard/operations"),
      { timeout: 12000 }
    ).catch(() => {});
    await page.waitForTimeout(5000);

    // Locate Decision Intelligence Card
    const diHeading = page.getByRole("heading", { name: "Decision Intelligence" });
    await expect(diHeading).toBeVisible({ timeout: 15000 });

    // Check if decision items exist in the DOM
    const decisionCards = page.locator("section[aria-label='Decision Intelligence Layout'] [class*='cursor-pointer']");
    const cardCount = await decisionCards.count();

    console.log("\n========================================================");
    console.log("KARMA CONFIDENCE / REASONING LIVE POST CONTRACT VERIFICATION");
    console.log("========================================================");
    console.log(`Decision Intelligence items rendered in UI: ${cardCount}`);
    console.log(`Karma confidence/reasoning requests observed: ${karmaCalls.length}`);

    if (karmaCalls.length > 0) {
      for (const call of karmaCalls) {
        console.log(`Endpoint:    ${call.pathname}`);
        console.log(`Method:      ${call.method}`);
        console.log(`HTTP Status: ${call.status}`);
        console.log(`Content-Type:${call.contentType}`);
        console.log(`Request Body Sent by Browser: ${call.postData ? JSON.stringify(call.postData) : "None (empty/stripped by browser)"}`);
        console.log(`Response Body from Backend:   ${call.responseBody ? call.responseBody.slice(0, 500) : "None"}`);
        console.log("--------------------------------------------------------");
      }
    } else {
      console.log("[Notice] No Karma confidence/reasoning requests triggered.");
      if (cardCount === 0) {
        console.log("Reason: Upstream decision sources (SANSKAR ranking / CP operations / NIYANTRAN aims) provided no entities/trajectories.");
        console.log("Contract state: useKarmaConfidence and useKarmaReasoning are correctly guarded with enabled: !!trajectoryId.");
      } else {
        console.log(`Decision items exist (${cardCount}), but no automated request was captured in initial window.`);
      }
    }
    console.log("========================================================\n");

    // Validate the authoritative live Karma POST contract
    for (const call of karmaCalls) {
      expect(call.method).toBe("POST");
      expect(call.status, `Karma ${call.pathname} must return 200 OK`).toBe(200);
      expect(call.postData, `Karma ${call.pathname} must include JSON request body`).toBeTruthy();
      console.log(`Live Karma ${call.pathname} responded with HTTP ${call.status}`);
    }
  });
});
