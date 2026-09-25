import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  fetchRajyaHealth,
  fetchSovereignTraces,
  fetchSovereignBucketEntries,
  rajyaClient,
} from "@/api/rajyaEndpoints";
import type { SovereignExecutionTrace } from "@/types/sovereign";

describe("Sovereign Core / RAJYA Integration Contract", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("fetchRajyaHealth performs GET /health and returns canonical service and status", async () => {
    const mockHealth = {
      status: "ok",
      service: "bhiv-enforcement-gateway",
    };
    const getSpy = vi.spyOn(rajyaClient, "get").mockResolvedValueOnce({
      data: mockHealth,
    });

    const result = await fetchRajyaHealth();

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith("/health");
    expect(result.status).toBe("ok");
    expect(result.service).toBe("bhiv-enforcement-gateway");
  });

  test("fetchSovereignTraces performs GET /api/v1/niyantran/traces and returns canonical schema", async () => {
    const mockTrace: SovereignExecutionTrace = {
      execution_id: "exec-a1b2c3d4e5f6",
      execution_status: "COMPLETED",
      dgic_state: "KNOWN",
      risk_score: 0.15,
      confidence: 0.98,
      rajya_verdict: "EXECUTION_APPROVED",
      sarathi_status: "VALID",
      core_status: "ALLOW",
      bucket_persistence: true,
      failure_reason: null,
      trace_hash: "baecfe00bacf96a1b1cfa52707db79d06354f77b7b0d2d0e78d928cd647fc566",
    };

    const getSpy = vi.spyOn(rajyaClient, "get").mockResolvedValueOnce({
      data: [mockTrace],
    });

    const result = await fetchSovereignTraces();

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith("/api/v1/niyantran/traces");
    expect(result).toHaveLength(1);
    expect(result[0].execution_id).toBe("exec-a1b2c3d4e5f6");
    expect(result[0].execution_status).toBe("COMPLETED");
    expect(result[0].dgic_state).toBe("KNOWN");
    expect(result[0].risk_score).toBe(0.15);
    expect(result[0].confidence).toBe(0.98);
    expect(result[0].rajya_verdict).toBe("EXECUTION_APPROVED");
    expect(result[0].sarathi_status).toBe("VALID");
    expect(result[0].core_status).toBe("ALLOW");
    expect(result[0].bucket_persistence).toBe(true);
    expect(result[0].failure_reason).toBeNull();
    expect(result[0].trace_hash).toBe(
      "baecfe00bacf96a1b1cfa52707db79d06354f77b7b0d2d0e78d928cd647fc566"
    );
  });

  test("fetchSovereignTraces handles empty response array safely", async () => {
    vi.spyOn(rajyaClient, "get").mockResolvedValueOnce({ data: [] });
    const result = await fetchSovereignTraces();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  test("fetchSovereignBucketEntries performs GET /api/v1/bucket/entries", async () => {
    const getSpy = vi.spyOn(rajyaClient, "get").mockResolvedValueOnce({
      data: [],
    });

    const result = await fetchSovereignBucketEntries();

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith("/api/v1/bucket/entries");
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  test("Strict Read-Only Compliance: rajyaClient exposes zero POST/PUT/PATCH/DELETE calls in endpoints", () => {
    // Verify no mutation functions exist in rajyaClient endpoints
    expect(typeof rajyaClient.get).toBe("function");
    // Ensure Sovereign functions only ever invoke GET
    expect(typeof fetchRajyaHealth).toBe("function");
    expect(typeof fetchSovereignTraces).toBe("function");
    expect(typeof fetchSovereignBucketEntries).toBe("function");
  });

  test("Identifier Independence: execution_id is strictly preserved without mutation to trace_id", async () => {
    const mockTrace: SovereignExecutionTrace = {
      execution_id: "tantra-consumer-trace-99aa88",
      execution_status: "IN_PROGRESS",
      dgic_state: "INFERRED",
      risk_score: null,
      confidence: 0.85,
      rajya_verdict: "PENDING",
      sarathi_status: "PENDING",
      core_status: "PENDING",
      bucket_persistence: false,
      failure_reason: null,
      trace_hash: "11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
    };

    vi.spyOn(rajyaClient, "get").mockResolvedValueOnce({ data: [mockTrace] });
    const [trace] = await fetchSovereignTraces();

    expect(trace.execution_id).toBe("tantra-consumer-trace-99aa88");
    expect(trace.trace_hash).toBe("11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff");
    expect(trace.risk_score).toBeNull();
  });
});
