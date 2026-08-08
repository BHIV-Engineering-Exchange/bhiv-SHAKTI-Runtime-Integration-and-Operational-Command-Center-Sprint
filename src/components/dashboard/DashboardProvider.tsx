import { DashboardProvider as SdkDashboardProvider, useDashboardConfig as useSdkDashboardConfig } from "@bhiv/dashboard-sdk";
import type { ReactNode } from "react";
import type { DashboardConfig, DashboardConfigOverride } from "@/types/dashboard.types";
import { defaultDashboardConfig } from "@/config/dashboard.config";

interface DashboardProviderProps {
  /** Partial config overrides — deep-merged with SHAKTI defaults */
  config?: DashboardConfigOverride;
  children: ReactNode;
}

export function DashboardProvider({ config: overrides, children }: DashboardProviderProps) {
  return (
    <SdkDashboardProvider
      defaultConfig={defaultDashboardConfig}
      overrides={overrides}
    >
      {children}
    </SdkDashboardProvider>
  );
}

export function useDashboardConfig(): DashboardConfig {
  return useSdkDashboardConfig() as unknown as DashboardConfig;
}
