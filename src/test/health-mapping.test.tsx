import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { toStatus } from "@/utils/format";

// ── Mock definitions ────────────────────────────────────────────────
const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  isFetching: false,
  isStale: false,
  refetch: vi.fn(),
};

const mockUseSystemStatus = vi.fn();
const mockUseMetrics = vi.fn();
const mockUseBucketHealth = vi.fn();
const mockUsePranaHealth = vi.fn();
const mockUsePranaSystemHealth = vi.fn();
const mockUseNiyantranStats = vi.fn();
const mockUseInsightFlowHealth = vi.fn();
const mockUseTantraHealth = vi.fn();
const mockUseRajyaHealth = vi.fn();
const mockUseSanskarHealth = vi.fn();
const mockUseKarmaHealth = vi.fn();
const mockUseKeshavHealth = vi.fn();
const mockUseSetuHealth = vi.fn();

// ── Mocks ───────────────────────────────────────────────────────────
vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

vi.mock("@/hooks/useQueries", () => ({
  useExecutiveDashboard: () => defaultQueryResult,
  useSystemStatus: () => mockUseSystemStatus(),
  useMetrics: () => mockUseMetrics(),
  useOperationsDashboard: () => defaultQueryResult,
  useRepositoryRegistry: () => defaultQueryResult,
  useCapabilityRegistry: () => defaultQueryResult,
  useBuildRegistry: () => defaultQueryResult,
  useReviewQueue: () => defaultQueryResult,
  useEmployeeExecution: () => defaultQueryResult,
  useEngineeringCapacity: () => defaultQueryResult,
  useDeliveryIntelligence: () => defaultQueryResult,
  useMigrationQueue: () => defaultQueryResult,
  useTelemetryDashboard: () => defaultQueryResult,
  useRuntimeDashboard: () => defaultQueryResult,
}));

vi.mock("@/hooks/useBucketQueries", () => ({
  useBucketHealth: () => mockUseBucketHealth(),
  useBucketArtifacts: () => defaultQueryResult,
  useAuditRecent: () => defaultQueryResult,
  useBucketStorageStats: () => defaultQueryResult,
  useBucketChainState: () => defaultQueryResult,
  useConstitutionalStatus: () => defaultQueryResult,
  useMetricsScaleStatus: () => defaultQueryResult,
  useMetricsQueryPerformance: () => defaultQueryResult,
  useMetricsAlerts: () => defaultQueryResult,
}));

vi.mock("@/hooks/usePranaQueries", () => ({
  usePranaHealth: () => mockUsePranaHealth(),
  usePranaSystemHealth: () => mockUsePranaSystemHealth(),
  usePranaPropagationLog: () => defaultQueryResult,
}));

vi.mock("@/hooks/useNiyantranQueries", () => ({
  useNiyantranStats: () => mockUseNiyantranStats(),
  useNiyantranAims: () => defaultQueryResult,
}));

vi.mock("@/hooks/useInsightFlowQueries", () => ({
  useInsightFlowHealth: () => mockUseInsightFlowHealth(),
  useInsightFlowStageMetrics: () => defaultQueryResult,
}));

vi.mock("@/hooks/useTantraQueries", () => ({
  useTantraHealth: () => mockUseTantraHealth(),
  useTantraTelemetry: () => defaultQueryResult,
}));

vi.mock("@/hooks/useRajyaQueries", () => ({
  useRajyaHealth: () => mockUseRajyaHealth(),
}));

vi.mock("@/hooks/useSanskarQueries", () => ({
  useSanskarHealth: () => mockUseSanskarHealth(),
}));

vi.mock("@/hooks/useKarmaQueries", () => ({
  useKarmaHealth: () => mockUseKarmaHealth(),
  useKarmaLiveMetrics: () => defaultQueryResult,
  useKarmaTrends: () => defaultQueryResult,
  useKarmaDharmaSevaFlow: () => defaultQueryResult,
  useKarmaPaapPunyaRatio: () => defaultQueryResult,
}));

vi.mock("@/hooks/useKeshavQueries", () => ({
  useKeshavHealth: () => mockUseKeshavHealth(),
  useKeshavMetrics: () => defaultQueryResult,
}));

vi.mock("@/hooks/useSetuQueries", () => ({
  useSetuHealth: () => mockUseSetuHealth(),
  useSetuProjects: () => defaultQueryResult,
  useSetuProject: () => defaultQueryResult,
  useSetuProjectMilestones: () => defaultQueryResult,
  useSetuTask: () => defaultQueryResult,
  useSetuTaskAssignments: () => defaultQueryResult,
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({}),
  useQueries: () => [],
  keepPreviousData: (v: any) => v,
}));

vi.mock("@/api/setuEndpoints", () => ({
  getProjectMilestones: vi.fn().mockResolvedValue([]),
  getHealth: vi.fn().mockResolvedValue({ status: "healthy", version: "1.0.0", success: true }),
  getProjects: vi.fn().mockResolvedValue([]),
  getProject: vi.fn().mockResolvedValue({}),
  getTask: vi.fn().mockResolvedValue({}),
  getTaskAssignments: vi.fn().mockResolvedValue([]),
}));

import RuntimeHealthLayout from "../components/dashboard/layouts/RuntimeHealthLayout";

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Helper to create a mock query result that looks like a successful health response.
 */
function healthResult(data: any) {
  return {
    data,
    isLoading: false,
    isError: false,
    isFetching: false,
    isStale: false,
    refetch: vi.fn(),
  };
}

function errorResult() {
  return {
    data: undefined,
    isLoading: false,
    isError: true,
    isFetching: false,
    isStale: false,
    refetch: vi.fn(),
  };
}

function loadingResult() {
  return {
    data: undefined,
    isLoading: true,
    isError: false,
    isFetching: true,
    isStale: false,
    refetch: vi.fn(),
  };
}

// ── beforeEach ──────────────────────────────────────────────────────
describe("Health Mapping — SETU, InsightFlow, Keshav", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Provide baseline "loaded with data" for system status + metrics so
    // RuntimeHealthLayout renders the service grid, not a global error.
    mockUseSystemStatus.mockReturnValue(
      healthResult({
        timestamp: "2026-09-04T09:00:00Z",
        overall_status: "ok",
        components: [],
      })
    );
    mockUseMetrics.mockReturnValue(
      healthResult({
        timestamp: "2026-09-04T09:00:00Z",
        total_requests: 100,
        success_rate: 100,
        average_response_time_ms: 10,
        requests: { success_rate_pct: 100 },
      })
    );

    // Default all service hooks to "no data, no error, not loading"
    mockUseBucketHealth.mockReturnValue(defaultQueryResult);
    mockUsePranaHealth.mockReturnValue(defaultQueryResult);
    mockUsePranaSystemHealth.mockReturnValue(defaultQueryResult);
    mockUseNiyantranStats.mockReturnValue(defaultQueryResult);
    mockUseInsightFlowHealth.mockReturnValue(defaultQueryResult);
    mockUseTantraHealth.mockReturnValue(defaultQueryResult);
    mockUseRajyaHealth.mockReturnValue(defaultQueryResult);
    mockUseSanskarHealth.mockReturnValue(defaultQueryResult);
    mockUseKarmaHealth.mockReturnValue(defaultQueryResult);
    mockUseKeshavHealth.mockReturnValue(defaultQueryResult);
    mockUseSetuHealth.mockReturnValue(defaultQueryResult);
  });

  // ───────────────────────────────────────────────────────────────
  // SETU
  // ───────────────────────────────────────────────────────────────
  describe("SETU PMC", () => {
    test('SETU "healthy" response → operational', () => {
      mockUseSetuHealth.mockReturnValue(
        healthResult({
          success: true,
          status: "healthy",
          message: "Server is healthy",
          version: "1.0.0",
          dependencies: { mongodb: "connected" },
        })
      );

      render(<RuntimeHealthLayout />);

      // The component should render SETU PMC with status text
      const setuText = screen.getByText("SETU PMC");
      expect(setuText).toBeInTheDocument();

      // The status detail should show "healthy"
      expect(screen.getByText(/Status: healthy/)).toBeInTheDocument();
    });

    test("SETU 404/network error → offline", () => {
      mockUseSetuHealth.mockReturnValue(errorResult());

      render(<RuntimeHealthLayout />);

      const setuText = screen.getByText("SETU PMC");
      expect(setuText).toBeInTheDocument();

      // Error state should show "Connection failed"
      expect(screen.getByText("Connection failed")).toBeInTheDocument();
    });

    test('SETU unexpected status "banana" → degraded', () => {
      mockUseSetuHealth.mockReturnValue(
        healthResult({ status: "banana", version: "0.0.1" })
      );

      render(<RuntimeHealthLayout />);

      // SETU PMC should appear — with a non-"operational" status
      expect(screen.getByText("SETU PMC")).toBeInTheDocument();
      expect(screen.getByText(/Status: banana/)).toBeInTheDocument();
    });

    test('SETU "ok" response → operational', () => {
      mockUseSetuHealth.mockReturnValue(
        healthResult({ status: "ok", version: "1.0.0" })
      );

      render(<RuntimeHealthLayout />);
      expect(screen.getByText("SETU PMC")).toBeInTheDocument();
      expect(screen.getByText(/Status: ok/)).toBeInTheDocument();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // InsightFlow
  // ───────────────────────────────────────────────────────────────
  describe("InsightFlow", () => {
    test('"healthy" response → operational', () => {
      mockUseInsightFlowHealth.mockReturnValue(
        healthResult({ status: "healthy", service: "InsightBridge" })
      );

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("insightflow_runtime")).toBeInTheDocument();
    });

    test('"ONLINE" response → operational (backward compat)', () => {
      mockUseInsightFlowHealth.mockReturnValue(
        healthResult({ status: "ONLINE", error_count_60s: 0 })
      );

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("insightflow_runtime")).toBeInTheDocument();
    });

    test('"offline" response → degraded (not a recognized healthy value)', () => {
      mockUseInsightFlowHealth.mockReturnValue(
        healthResult({ status: "offline" })
      );

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("insightflow_runtime")).toBeInTheDocument();
    });

    test("network error → offline", () => {
      mockUseInsightFlowHealth.mockReturnValue(errorResult());

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("insightflow_runtime")).toBeInTheDocument();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // Keshav
  // ───────────────────────────────────────────────────────────────
  describe("KESHAV Dependency Engine", () => {
    test('"OK" (uppercase) response → operational', () => {
      mockUseKeshavHealth.mockReturnValue(
        healthResult({ status: "OK", service: "KESHAV" })
      );

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("KESHAV Dependency Engine")).toBeInTheDocument();
    });

    test('"ok" (lowercase) response → operational', () => {
      mockUseKeshavHealth.mockReturnValue(
        healthResult({ status: "ok", service: "KESHAV" })
      );

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("KESHAV Dependency Engine")).toBeInTheDocument();
    });

    test('"healthy" response → operational', () => {
      mockUseKeshavHealth.mockReturnValue(
        healthResult({ status: "healthy", service: "KESHAV" })
      );

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("KESHAV Dependency Engine")).toBeInTheDocument();
    });

    test('unexpected status "error" → degraded', () => {
      mockUseKeshavHealth.mockReturnValue(
        healthResult({ status: "error", service: "KESHAV" })
      );

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("KESHAV Dependency Engine")).toBeInTheDocument();
    });

    test("network error → offline", () => {
      mockUseKeshavHealth.mockReturnValue(errorResult());

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("KESHAV Dependency Engine")).toBeInTheDocument();
    });
  });

  describe("toStatus Mapping Integrity", () => {
    test("maps unhealthy, down, failed, error, and crash_looping to offline (red)", () => {
      expect(toStatus("unhealthy")).toBe("offline");
      expect(toStatus("UNHEALTHY")).toBe("offline");
      expect(toStatus("down")).toBe("offline");
      expect(toStatus("failed")).toBe("offline");
      expect(toStatus("error")).toBe("offline");
      expect(toStatus("crash_looping")).toBe("offline");
      expect(toStatus("critical")).toBe("offline");
      expect(toStatus("offline")).toBe("offline");
    });

    test("maps healthy states to online (green)", () => {
      expect(toStatus("operational")).toBe("online");
      expect(toStatus("healthy")).toBe("online");
      expect(toStatus("normal")).toBe("online");
      expect(toStatus("online")).toBe("online");
      expect(toStatus("ok")).toBe("online");
      expect(toStatus("OK")).toBe("online");
    });

    test("maps degraded and warning correctly", () => {
      expect(toStatus("degraded")).toBe("degraded");
      expect(toStatus("warning")).toBe("warning");
    });

    test("defaults unrecognized states safely to offline", () => {
      expect(toStatus("unknown_bad_state")).toBe("offline");
    });
  });
});
