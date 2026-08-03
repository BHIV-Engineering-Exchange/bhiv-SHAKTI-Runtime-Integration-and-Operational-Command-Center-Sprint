import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { useQueries } from "@tanstack/react-query";

// Mock the react-router-dom if any layout uses it
vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

// Mock the queries hook module
const mockUseExecutiveDashboard = vi.fn();
const mockUseSystemStatus = vi.fn();
const mockUseMetrics = vi.fn();
const mockUseOperationsDashboard = vi.fn();
const mockUseRepositoryRegistry = vi.fn();
const mockUseCapabilityRegistry = vi.fn();
const mockUseBuildRegistry = vi.fn();
const mockUseReviewQueue = vi.fn();
const mockUseEmployeeExecution = vi.fn();
const mockUseEngineeringCapacity = vi.fn();
const mockUseDeliveryIntelligence = vi.fn();
const mockUseMigrationQueue = vi.fn();
const mockUseTelemetryDashboard = vi.fn();
const mockUseRuntimeDashboard = vi.fn();

const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
};

const mockUseBucketHealth = vi.fn();
const mockUseBucketArtifacts = vi.fn();
const mockUseAuditRecent = vi.fn();
const mockUseBucketStorageStats = vi.fn();
const mockUseBucketChainState = vi.fn();
const mockUseConstitutionalStatus = vi.fn();
const mockUseMetricsScaleStatus = vi.fn();
const mockUseMetricsQueryPerformance = vi.fn();
const mockUseMetricsAlerts = vi.fn();

vi.mock("@/hooks/useQueries", () => ({
  useExecutiveDashboard: () => mockUseExecutiveDashboard(),
  useSystemStatus: () => mockUseSystemStatus(),
  useMetrics: () => mockUseMetrics(),
  useOperationsDashboard: () => mockUseOperationsDashboard(),
  useRepositoryRegistry: () => mockUseRepositoryRegistry(),
  useCapabilityRegistry: () => mockUseCapabilityRegistry(),
  useBuildRegistry: () => mockUseBuildRegistry(),
  useReviewQueue: () => mockUseReviewQueue(),
  useEmployeeExecution: () => mockUseEmployeeExecution(),
  useEngineeringCapacity: () => mockUseEngineeringCapacity(),
  useDeliveryIntelligence: () => mockUseDeliveryIntelligence(),
  useMigrationQueue: () => mockUseMigrationQueue(),
  useTelemetryDashboard: () => mockUseTelemetryDashboard(),
  useRuntimeDashboard: () => mockUseRuntimeDashboard(),
}));

vi.mock("@/hooks/useBucketQueries", () => ({
  useBucketHealth: () => mockUseBucketHealth(),
  useBucketArtifacts: () => mockUseBucketArtifacts(),
  useAuditRecent: () => mockUseAuditRecent(),
  useBucketStorageStats: () => mockUseBucketStorageStats(),
  useBucketChainState: () => mockUseBucketChainState(),
  useConstitutionalStatus: () => mockUseConstitutionalStatus(),
  useMetricsScaleStatus: () => mockUseMetricsScaleStatus(),
  useMetricsQueryPerformance: () => mockUseMetricsQueryPerformance(),
  useMetricsAlerts: () => mockUseMetricsAlerts(),
}));

const mockUsePranaHealth = vi.fn();
const mockUsePranaSystemHealth = vi.fn();
const mockUsePranaPropagationLog = vi.fn();

vi.mock("@/hooks/usePranaQueries", () => ({
  usePranaHealth: () => mockUsePranaHealth(),
  usePranaSystemHealth: () => mockUsePranaSystemHealth(),
  usePranaPropagationLog: () => mockUsePranaPropagationLog(),
}));

const mockUseNiyantranStats = vi.fn();
vi.mock("@/hooks/useNiyantranQueries", () => ({
  useNiyantranStats: () => mockUseNiyantranStats(),
  useNiyantranAims: () => vi.fn().mockReturnValue(defaultQueryResult)(),
}));

const mockUseInsightFlowHealth = vi.fn();
vi.mock("@/hooks/useInsightFlowQueries", () => ({
  useInsightFlowHealth: () => mockUseInsightFlowHealth(),
  useInsightFlowStageMetrics: () => vi.fn().mockReturnValue(defaultQueryResult)(),
}));

const mockUseTantraHealth = vi.fn();
const mockUseTantraTelemetry = vi.fn();
vi.mock("@/hooks/useTantraQueries", () => ({
  useTantraHealth: () => mockUseTantraHealth(),
  useTantraTelemetry: () => mockUseTantraTelemetry(),
}));

const mockUseRajyaHealth = vi.fn();
vi.mock("@/hooks/useRajyaQueries", () => ({
  useRajyaHealth: () => mockUseRajyaHealth(),
}));

const mockUseSanskarHealth = vi.fn();
vi.mock("@/hooks/useSanskarQueries", () => ({
  useSanskarHealth: () => mockUseSanskarHealth(),
}));

const mockUseKarmaHealth = vi.fn();
const mockUseKarmaLiveMetrics = vi.fn();
const mockUseKarmaTrends = vi.fn();
const mockUseKarmaDharmaSevaFlow = vi.fn();
const mockUseKarmaPaapPunyaRatio = vi.fn();
vi.mock("@/hooks/useKarmaQueries", () => ({
  useKarmaHealth: () => mockUseKarmaHealth(),
  useKarmaLiveMetrics: () => mockUseKarmaLiveMetrics(),
  useKarmaTrends: () => mockUseKarmaTrends(),
  useKarmaDharmaSevaFlow: () => mockUseKarmaDharmaSevaFlow(),
  useKarmaPaapPunyaRatio: () => mockUseKarmaPaapPunyaRatio(),
}));

const mockUseKeshavHealth = vi.fn();
const mockUseKeshavMetrics = vi.fn();
vi.mock("@/hooks/useKeshavQueries", () => ({
  useKeshavHealth: () => mockUseKeshavHealth(),
  useKeshavMetrics: () => mockUseKeshavMetrics(),
}));

const mockUseSetuHealth = vi.fn();
const mockUseSetuReady = vi.fn();
const mockUseSetuProjects = vi.fn();
const mockUseSetuProject = vi.fn();
const mockUseSetuProjectMilestones = vi.fn();
const mockUseSetuTask = vi.fn();
const mockUseSetuTaskAssignments = vi.fn();
vi.mock("@/hooks/useSetuQueries", () => ({
  useSetuHealth: () => mockUseSetuHealth(),
  useSetuReady: () => mockUseSetuReady(),
  useSetuProjects: () => mockUseSetuProjects(),
  useSetuProject: () => mockUseSetuProject(),
  useSetuProjectMilestones: () => mockUseSetuProjectMilestones(),
  useSetuTask: () => mockUseSetuTask(),
  useSetuTaskAssignments: () => mockUseSetuTaskAssignments(),
}));

const mockUseQueries = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({}),
  useQueries: () => mockUseQueries(),
  keepPreviousData: (v: any) => v,
}));

vi.mock("@/api/setuEndpoints", () => ({
  getProjectMilestones: vi.fn().mockResolvedValue([]),
  getHealth: vi.fn().mockResolvedValue({ status: "ok", version: "1.0.0" }),
  getReady: vi.fn().mockResolvedValue({ status: "ready", version: "1.0.0" }),
  getProjects: vi.fn().mockResolvedValue([]),
  getProject: vi.fn().mockResolvedValue({}),
  getTask: vi.fn().mockResolvedValue({}),
  getTaskAssignments: vi.fn().mockResolvedValue([]),
}));

import ExecutiveLayout from "../components/dashboard/layouts/ExecutiveLayout";
import RuntimeHealthLayout from "../components/dashboard/layouts/RuntimeHealthLayout";
import WorkflowLayout from "../components/dashboard/layouts/WorkflowLayout";

describe("Layout Components Integration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseQueries.mockReturnValue([]);
    mockUseExecutiveDashboard.mockReturnValue(defaultQueryResult);
    mockUseSystemStatus.mockReturnValue(defaultQueryResult);
    mockUseMetrics.mockReturnValue(defaultQueryResult);
    mockUseOperationsDashboard.mockReturnValue(defaultQueryResult);
    mockUseRepositoryRegistry.mockReturnValue(defaultQueryResult);
    mockUseCapabilityRegistry.mockReturnValue(defaultQueryResult);
    mockUseBuildRegistry.mockReturnValue(defaultQueryResult);
    mockUseReviewQueue.mockReturnValue(defaultQueryResult);
    mockUseEmployeeExecution.mockReturnValue(defaultQueryResult);
    mockUseEngineeringCapacity.mockReturnValue(defaultQueryResult);
    mockUseDeliveryIntelligence.mockReturnValue(defaultQueryResult);
    mockUseMigrationQueue.mockReturnValue(defaultQueryResult);
    mockUseTelemetryDashboard.mockReturnValue(defaultQueryResult);
    mockUseRuntimeDashboard.mockReturnValue(defaultQueryResult);
    mockUseBucketHealth.mockReturnValue(defaultQueryResult);
    mockUseBucketArtifacts.mockReturnValue(defaultQueryResult);
    mockUseAuditRecent.mockReturnValue(defaultQueryResult);
    mockUseBucketStorageStats.mockReturnValue(defaultQueryResult);
    mockUseBucketChainState.mockReturnValue(defaultQueryResult);
    mockUseConstitutionalStatus.mockReturnValue(defaultQueryResult);
    mockUseMetricsScaleStatus.mockReturnValue(defaultQueryResult);
    mockUseMetricsQueryPerformance.mockReturnValue(defaultQueryResult);
    mockUseMetricsAlerts.mockReturnValue(defaultQueryResult);
    mockUsePranaHealth.mockReturnValue(defaultQueryResult);
    mockUsePranaSystemHealth.mockReturnValue(defaultQueryResult);
    mockUsePranaPropagationLog.mockReturnValue(defaultQueryResult);
    mockUseNiyantranStats.mockReturnValue(defaultQueryResult);
    mockUseInsightFlowHealth.mockReturnValue(defaultQueryResult);
    mockUseTantraHealth.mockReturnValue(defaultQueryResult);
    mockUseTantraTelemetry.mockReturnValue(defaultQueryResult);
    mockUseRajyaHealth.mockReturnValue(defaultQueryResult);
    mockUseSanskarHealth.mockReturnValue(defaultQueryResult);
    mockUseKarmaHealth.mockReturnValue(defaultQueryResult);
    mockUseKarmaLiveMetrics.mockReturnValue(defaultQueryResult);
    mockUseKarmaTrends.mockReturnValue(defaultQueryResult);
    mockUseKarmaDharmaSevaFlow.mockReturnValue(defaultQueryResult);
    mockUseKarmaPaapPunyaRatio.mockReturnValue(defaultQueryResult);
    mockUseKeshavHealth.mockReturnValue(defaultQueryResult);
    mockUseKeshavMetrics.mockReturnValue(defaultQueryResult);
    mockUseSetuHealth.mockReturnValue(defaultQueryResult);
    mockUseSetuReady.mockReturnValue(defaultQueryResult);
    mockUseSetuProjects.mockReturnValue(defaultQueryResult);
    mockUseSetuProject.mockReturnValue(defaultQueryResult);
    mockUseSetuProjectMilestones.mockReturnValue(defaultQueryResult);
    mockUseSetuTask.mockReturnValue(defaultQueryResult);
    mockUseSetuTaskAssignments.mockReturnValue(defaultQueryResult);
  });

  describe("ExecutiveLayout Component", () => {
    test("renders executive KPI values in success state", () => {
      mockUseExecutiveDashboard.mockReturnValue({
        data: {
          timestamp: "2026-07-15T16:53:18.000Z",
          summary: [
            { metric: "active_contracts_count", value: "77", trend: "up", status: "operational" },
          ],
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      mockUseMetrics.mockReturnValue({
        data: {
          timestamp: "2026-07-15T16:53:18.000Z",
          total_requests: 1500,
          success_rate: 99.98,
          average_response_time_ms: 45.2,
          events_processed: 50000,
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<ExecutiveLayout />);

      expect(screen.getByText(/Executive Command Center/)).toBeInTheDocument();
      expect(screen.getByText("Engineering Health")).toBeInTheDocument();
      expect(screen.getByText("1,500 Reqs")).toBeInTheDocument();
    });

    test("renders empty fallback on empty/no KPI dataset", () => {
      mockUseExecutiveDashboard.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      mockUseMetrics.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<ExecutiveLayout />);
      expect(screen.getAllByText("No Runtime Data Available")[0]).toBeInTheDocument();
    });

    test("renders inline unavailable state when API fails independently without affecting other cards", () => {
      // Mock metrics succeeding while status fails (404/Error)
      mockUseMetrics.mockReturnValue({
        data: {
          timestamp: "2026-07-15T16:53:18.000Z",
          total_requests: 2500,
          success_rate: 99.5,
          average_response_time_ms: 30,
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      mockUseRepositoryRegistry.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      });

      render(<ExecutiveLayout />);

      // Successful card section continues displaying live data
      expect(screen.getByText("2,500 Reqs")).toBeInTheDocument();

      // Failed card section displays inline unavailable message
      expect(screen.getAllByText("No Runtime Data Available").length).toBeGreaterThan(0);
    });
  });

  describe("RuntimeHealthLayout Component", () => {
    test("renders runtime health parameters and modules", () => {
      mockUseSystemStatus.mockReturnValue({
        data: {
          timestamp: "2026-07-15T16:53:18.000Z",
          components: [
            { name: "gate_service", status: "operational", response_time_ms: 45, details: "healthy" },
            { name: "bhiv_bucket", status: "operational", response_time_ms: 120, details: "healthy" },
          ],
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      mockUseMetrics.mockReturnValue({
        data: {
          timestamp: "2026-07-15T16:53:18.000Z",
          total_requests: 1500,
          success_rate: 99.98,
          average_response_time_ms: 45.2,
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<RuntimeHealthLayout />);

      expect(screen.getByText("Runtime Health")).toBeInTheDocument();
      expect(screen.getByText("gate_service")).toBeInTheDocument();
      expect(screen.getByText("bhiv_bucket")).toBeInTheDocument();
      expect(screen.getByText("99.98%")).toBeInTheDocument();
      expect(screen.getAllByText("45ms")[0]).toBeInTheDocument();
    });
  });

  describe("WorkflowLayout Component", () => {
    test("renders active operations and steps in table", () => {
      mockUseSetuProjects.mockReturnValue({
        data: [
          {
            id: "proj_01",
            name: "SETU Dashboard Integration",
            description: "Phase 2 implementation",
            created_at: "2026-07-15T16:53:18.000Z",
          },
        ],
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      mockUseQueries.mockReturnValue([
        {
          data: [
            {
              id: "ms_01",
              name: "Step 1: Setu API Integration",
              project_id: "proj_01",
              description: "Create endpoints and query hooks",
              status: "IN_PROGRESS",
            },
          ],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        },
      ]);

      render(<WorkflowLayout />);

      expect(screen.getByText("Active Workflows")).toBeInTheDocument();
      expect(screen.getByText("SETU Dashboard Integration")).toBeInTheDocument();
      expect(screen.getByText("Step 1: Setu API Integration")).toBeInTheDocument();
      expect(screen.getByText("IN_PROGRESS")).toBeInTheDocument();
      expect(screen.getByText("#proj_0")).toBeInTheDocument();
    });

    test("renders empty row fallback when no workflows are returned", () => {
      mockUseSetuProjects.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
      mockUseQueries.mockReturnValue([]);

      render(<WorkflowLayout />);
      expect(screen.getByText("No Runtime Data Available")).toBeInTheDocument();
    });
  });

});
