import { useQuery } from "@tanstack/react-query";
import { getSetuAuthMe } from "@/api/setuEndpoints";
import type { SetuAuthUser } from "@/types/setu";

export type TenantResolutionStatus =
  | "loading"
  | "authenticated"
  | "missing_tenant"
  | "unauthenticated"
  | "error";

export interface CurrentTenantResult {
  tenantId: string | null;
  authoritativeTenantId: string | null;
  user: SetuAuthUser | null;
  status: TenantResolutionStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

/**
 * useCurrentTenant
 * Authoritative tenant provider hook for SHAKTI.
 *
 * Calls GET /api/auth/me using the existing browser session token.
 * Extracts response.data.user.tenant_id.
 *
 * STRICT RULES:
 * - Never fabricates or defaults a tenant_id.
 * - Never uses trace_id, execution_id, or request_id as tenant_id.
 * - Handles loading, auth errors, missing tenant_id, and valid tenant_id.
 */
export function useCurrentTenant(): CurrentTenantResult {
  const query = useQuery({
    queryKey: ["auth-me-tenant"],
    queryFn: getSetuAuthMe,
    staleTime: 60_000,
    refetchInterval: 30_000,
    retry: 1,
  });

  const { data, isLoading, isError, error, refetch } = query;

  if (isLoading) {
    return {
      tenantId: null,
      authoritativeTenantId: null,
      user: null,
      status: "loading",
      isLoading: true,
      isAuthenticated: false,
      isError: false,
      errorMessage: null,
      refetch,
    };
  }

  if (isError) {
    const status = (error as any)?.response?.status;
    const errorMsg =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Failed to authenticate with SETU";

    return {
      tenantId: null,
      authoritativeTenantId: null,
      user: null,
      status: status === 401 || status === 403 ? "unauthenticated" : "error",
      isLoading: false,
      isAuthenticated: false,
      isError: true,
      errorMessage: errorMsg,
      refetch,
    };
  }

  const user = data?.data?.user ?? null;
  const rawTenantId = user?.tenant_id;
  const trimmedTenantId =
    typeof rawTenantId === "string" && rawTenantId.trim().length > 0
      ? rawTenantId.trim()
      : null;

  if (!user) {
    return {
      tenantId: null,
      authoritativeTenantId: null,
      user: null,
      status: "unauthenticated",
      isLoading: false,
      isAuthenticated: false,
      isError: false,
      errorMessage: "No user object returned from /api/auth/me",
      refetch,
    };
  }

  if (!trimmedTenantId) {
    return {
      tenantId: null,
      authoritativeTenantId: null,
      user,
      status: "missing_tenant",
      isLoading: false,
      isAuthenticated: true,
      isError: false,
      errorMessage: "Authenticated user lacks authoritative tenant_id",
      refetch,
    };
  }

  return {
    tenantId: trimmedTenantId,
    authoritativeTenantId: trimmedTenantId,
    user,
    status: "authenticated",
    isLoading: false,
    isAuthenticated: true,
    isError: false,
    errorMessage: null,
    refetch,
  };
}
