import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchTantraHealth,
  fetchTantraTelemetry,
  fetchTantraTelemetrySummary,
} from "@/api/tantraEndpoints";

export const useTantraHealth = () =>
  useQuery({
    queryKey: ["tantra-health"],
    queryFn: fetchTantraHealth,
    refetchInterval: 10_000, // 10s health polling
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useTantraTelemetry = () =>
  useQuery({
    queryKey: ["tantra-telemetry"],
    queryFn: fetchTantraTelemetry,
    refetchInterval: 10_000, // 10s telemetry polling
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useTantraTelemetrySummary = () =>
  useQuery({
    queryKey: ["tantra-telemetry-summary"],
    queryFn: fetchTantraTelemetrySummary,
    refetchInterval: 10_000, // 10s telemetry summary polling
    placeholderData: keepPreviousData,
    retry: 1,
  });
