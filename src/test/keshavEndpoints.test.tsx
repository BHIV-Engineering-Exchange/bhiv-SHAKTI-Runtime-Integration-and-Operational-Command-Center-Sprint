import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { getMetricsJson, keshavClient } from "@/api/keshavEndpoints";
import type { KeshavMetricsResponse } from "@/types/keshav";
import ObservabilityLayout from "@/components/dashboard/layouts/ObservabilityLayout";

// Mock TelemetryCard to avoid recharts ResponsiveContainer sizing issues in jsdom
vi.mock("@/components/dashboard/primitives/TelemetryCard", () => ({
  TelemetryCard: ({ summaryMetrics }: { summaryMetrics?: Array<{ label: string; value: string | number; unit?: string }> }) => (
    <div data-testid="telemetry-card">
      {summaryMetrics?.map((m) => (
        <div key={m.label} data-testid={`metric-${m.label}`}>
          <span>{m.label}</span>: <span>{m.value}</span>{m.unit || ""}
        </div>
      ))}
    </div>
  ),
}));

// Mock useKeshavMetrics
const mockUseKeshavMetrics = vi.fn();
vi.mock("@/hooks/useKeshavQueries", () => ({
  useKeshavMetrics: () => mockUseKeshavMetrics(),
  useKeshavHealth: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

// Mock background queries consumed by ObservabilityLayout
const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
  isFetching: false,
  isStale: false,
};

vi.mock("@/hooks/useQueries", () => ({
  useTelemetryDashboard: () => defaultQueryResult,
}));

vi.mock("@/hooks/useBucketQueries", () => ({
  useMetricsScaleStatus: () => defaultQueryResult,
  useMetricsQueryPerformance: () => defaultQueryResult,
}));

vi.mock("@/hooks/usePranaQueries", () => ({
  usePranaPropagationLog: () => defaultQueryResult,
}));

vi.mock("@/hooks/useInsightFlowQueries", () => ({
  useInsightFlowStageMetrics: () => defaultQueryResult,
}));

vi.mock("@/hooks/useTantraQueries", () => ({
  useTantraTelemetry: () => defaultQueryResult,
}));

vi.mock("@/hooks/useKarmaQueries", () => ({
  useKarmaLiveMetrics: () => defaultQueryResult,
  useKarmaTrends: () => defaultQueryResult,
  useKarmaDharmaSevaFlow: () => defaultQueryResult,
  useKarmaPaapPunyaRatio: () => defaultQueryResult,
}));

describe("KESHAV Fail-Closed Endpoint & Metrics Integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Test A — successful canonical response
  test("Test A — getMetricsJson() returns exact canonical response with all 8 fields", async () => {
    const canonicalPayload: KeshavMetricsResponse = {
      request_count: 5000,
      request_errors: 12,
      request_success_rate: 0.9976,
      avg_latency_seconds: 0.038,
      p95_latency_seconds: 0.095,
      p99_latency_seconds: 0.21,
      severity_distribution: { info: 4900, warning: 88, critical: 12 },
      unique_traces_processed: 1250,
    };

    vi.spyOn(keshavClient, "get").mockResolvedValueOnce({ data: canonicalPayload });

    const result = await getMetricsJson();

    expect(result).toEqual(canonicalPayload);
    expect(result.request_count).toBe(5000);
    expect(result.request_errors).toBe(12);
    expect(result.request_success_rate).toBe(0.9976);
    expect(result.avg_latency_seconds).toBe(0.038);
    expect(result.p95_latency_seconds).toBe(0.095);
    expect(result.p99_latency_seconds).toBe(0.21);
    expect(result.severity_distribution).toEqual({ info: 4900, warning: 88, critical: 12 });
    expect(result.unique_traces_processed).toBe(1250);
  });

  // Test B — request failure directly propagates and does not return synthetic values
  test("Test B — getMetricsJson() directly propagates network/API failure and rejects without synthetic fallback", async () => {
    vi.spyOn(keshavClient, "get").mockRejectedValueOnce(new Error("Connection refused: 503 Service Unavailable"));

    await expect(getMetricsJson()).rejects.toThrow("Connection refused: 503 Service Unavailable");
  });

  // Test C — no synthetic success-rate fallback in ObservabilityLayout
  test("Test C — ObservabilityLayout renders N/A and does not render 100.0% when request_success_rate is missing", () => {
    mockUseKeshavMetrics.mockReturnValue({
      data: {
        request_count: 100,
        // request_success_rate is intentionally missing/undefined
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
      isStale: false,
    });

    render(<ObservabilityLayout />);

    // Header badge must render N/A and must NOT synthesize 100.0%
    expect(screen.getByText("KESHAV:")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.queryByText("100.0%")).not.toBeInTheDocument();
  });

  // Test D — real metrics remain rendered accurately
  test("Test D — ObservabilityLayout renders exact real metrics from canonical response", () => {
    mockUseKeshavMetrics.mockReturnValue({
      data: {
        request_count: 2500,
        request_success_rate: 0.975,
        avg_latency_seconds: 0.052,
        unique_traces_processed: 890,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
      isStale: false,
    });

    render(<ObservabilityLayout />);

    // Header badge renders 97.5%
    expect(screen.getByText("KESHAV:")).toBeInTheDocument();
    expect(screen.getByText("97.5%")).toBeInTheDocument();

    // Summary metrics tiles render exact values
    expect(screen.getByText("KESHAV Requests")).toBeInTheDocument();
    expect(screen.getByText("2,500")).toBeInTheDocument();

    expect(screen.getByText("KESHAV Avg Latency")).toBeInTheDocument();
    expect(screen.getByText("52")).toBeInTheDocument();

    expect(screen.getByText("KESHAV Error Rate")).toBeInTheDocument();
    expect(screen.getByText("2.50")).toBeInTheDocument();

    expect(screen.getByText("KESHAV Traces")).toBeInTheDocument();
    expect(screen.getByText("890")).toBeInTheDocument();
  });

  // Test E — refetch failure suppresses stale metrics
  test("Test E — ObservabilityLayout suppresses stale metrics and header percentage when isError=true during refetch failure", () => {
    // Simulates TanStack Query retaining previous data while isError=true after refetch failure
    mockUseKeshavMetrics.mockReturnValue({
      data: {
        request_count: 2500,
        request_success_rate: 0.975,
        avg_latency_seconds: 0.052,
        unique_traces_processed: 890,
      },
      isLoading: false,
      isError: true, // refetch failed
      error: new Error("503 Service Unavailable"),
      refetch: vi.fn(),
      isFetching: false,
      isStale: true,
    });

    render(<ObservabilityLayout />);

    // Stale header badge must NOT be rendered
    expect(screen.queryByText("KESHAV:")).not.toBeInTheDocument();
    expect(screen.queryByText("97.5%")).not.toBeInTheDocument();

    // Stale summary metrics tiles must NOT be rendered
    expect(screen.queryByText("KESHAV Requests")).not.toBeInTheDocument();
    expect(screen.queryByText("2,500")).not.toBeInTheDocument();
    expect(screen.queryByText("KESHAV Avg Latency")).not.toBeInTheDocument();
    expect(screen.queryByText("KESHAV Error Rate")).not.toBeInTheDocument();
    expect(screen.queryByText("KESHAV Traces")).not.toBeInTheDocument();
  });
});
