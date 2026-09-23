import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentTenant } from "@/hooks/useCurrentTenant";
import {
  setuClient,
  getSetuAuthMe,
  getSetuDashboard,
  getSetuTimeline,
  getSetuCandidateState,
  getSetuSignals,
  getSetuTelemetry,
} from "@/api/setuEndpoints";
import { fetchNiyantranExecutionHistory, niyantranClient } from "@/api/niyantranEndpoints";

describe("Authoritative SETU Tenant Provider Contract", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test("getSetuAuthMe fetches /api/auth/me and returns user data with tenant_id", async () => {
    const mockResponse = {
      success: true,
      data: {
        user: {
          _id: "user_001",
          name: "System Administrator",
          email: "admin@company.com",
          role: "admin",
          tenant_id: "tenant_sampada_001",
          isActive: true,
        },
      },
    };

    const getSpy = vi.spyOn(setuClient, "get").mockResolvedValueOnce({
      data: mockResponse,
    });

    const res = await getSetuAuthMe();

    expect(getSpy).toHaveBeenCalledWith("/api/auth/me");
    expect(res.data.user.tenant_id).toBe("tenant_sampada_001");
  });

  test("useCurrentTenant handles loading state", () => {
    (useQuery as any).mockReturnValueOnce({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentTenant());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.status).toBe("loading");
    expect(result.current.tenantId).toBeNull();
    expect(result.current.authoritativeTenantId).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test("useCurrentTenant resolves valid tenant_id and authenticated status", () => {
    (useQuery as any).mockReturnValueOnce({
      isLoading: false,
      isError: false,
      data: {
        success: true,
        data: {
          user: {
            _id: "usr_123",
            name: "Dev User",
            tenant_id: "tenant_alpha_99",
            role: "lead",
          },
        },
      },
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentTenant());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe("authenticated");
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.tenantId).toBe("tenant_alpha_99");
    expect(result.current.authoritativeTenantId).toBe("tenant_alpha_99");
    expect(result.current.user?.name).toBe("Dev User");
    expect(result.current.isError).toBe(false);
  });

  test("useCurrentTenant handles missing tenant_id without fabricating or defaulting", () => {
    (useQuery as any).mockReturnValueOnce({
      isLoading: false,
      isError: false,
      data: {
        success: true,
        data: {
          user: {
            _id: "usr_no_tenant",
            name: "Orphan User",
            role: "viewer",
          },
        },
      },
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentTenant());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe("missing_tenant");
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.tenantId).toBeNull();
    expect(result.current.authoritativeTenantId).toBeNull();
    expect(result.current.errorMessage).toContain("lacks authoritative tenant_id");
  });

  test("useCurrentTenant handles 401 authentication error safely", () => {
    (useQuery as any).mockReturnValueOnce({
      isLoading: false,
      isError: true,
      data: undefined,
      error: {
        response: {
          status: 401,
          data: {
            success: false,
            message: "Not authorized to access this route",
          },
        },
      },
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentTenant());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe("unauthenticated");
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.tenantId).toBeNull();
    expect(result.current.authoritativeTenantId).toBeNull();
    expect(result.current.errorMessage).toBe("Not authorized to access this route");
  });

  test("useCurrentTenant handles network error safely", () => {
    (useQuery as any).mockReturnValueOnce({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error("Network Error"),
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentTenant());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe("error");
    expect(result.current.isError).toBe(true);
    expect(result.current.tenantId).toBeNull();
    expect(result.current.errorMessage).toBe("Network Error");
  });

  test("SETU observation endpoints attach both x-tenant-id and x-setu-tenant-id", async () => {
    const getSpy = vi.spyOn(setuClient, "get").mockResolvedValue({ data: {} });

    await getSetuDashboard("trace_101", "tenant_001");
    expect(getSpy).toHaveBeenLastCalledWith("/setu/ui/dashboard/trace_101", {
      headers: {
        "x-tenant-id": "tenant_001",
        "x-setu-tenant-id": "tenant_001",
      },
    });

    await getSetuTimeline("trace_101", "tenant_001");
    expect(getSpy).toHaveBeenLastCalledWith("/setu/niyantran/timeline/trace_101", {
      headers: {
        "x-tenant-id": "tenant_001",
        "x-setu-tenant-id": "tenant_001",
      },
    });

    await getSetuCandidateState("trace_101", "tenant_001");
    expect(getSpy).toHaveBeenLastCalledWith("/setu/ui/candidate/trace_101", {
      headers: {
        "x-tenant-id": "tenant_001",
        "x-setu-tenant-id": "tenant_001",
      },
    });

    await getSetuSignals("trace_101", "tenant_001");
    expect(getSpy).toHaveBeenLastCalledWith("/setu/ui/signals/trace_101", {
      headers: {
        "x-tenant-id": "tenant_001",
        "x-setu-tenant-id": "tenant_001",
      },
    });

    await getSetuTelemetry("trace_101", "tenant_001");
    expect(getSpy).toHaveBeenLastCalledWith("/setu/telemetry/trace_101", {
      headers: {
        "x-tenant-id": "tenant_001",
        "x-setu-tenant-id": "tenant_001",
      },
    });
  });

  test("SETU observation endpoints do NOT send tenant headers when tenantId is omitted", async () => {
    const getSpy = vi.spyOn(setuClient, "get").mockResolvedValue({ data: {} });

    await getSetuDashboard("trace_no_tenant");
    expect(getSpy).toHaveBeenLastCalledWith("/setu/ui/dashboard/trace_no_tenant", {
      headers: {},
    });
  });

  test("Niyantran execution history preserves x-tenant-id header", async () => {
    const getSpy = vi.spyOn(niyantranClient, "get").mockResolvedValue({
      data: {
        execution_id: "exec_555",
        status: "SUCCESS",
      },
    });

    await fetchNiyantranExecutionHistory("exec_555", "tenant_001");
    expect(getSpy).toHaveBeenCalledWith("/api/tantra/execution/exec_555/history", {
      headers: {
        "x-tenant-id": "tenant_001",
      },
    });
  });
});
