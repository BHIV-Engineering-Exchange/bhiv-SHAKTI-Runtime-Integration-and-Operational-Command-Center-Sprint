import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getHealth,
  getMetricsJson,
} from "@/api/keshavEndpoints";

export const useKeshavHealth = () =>
  useQuery({
    queryKey: ["keshav-health"],
    queryFn: getHealth,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
  });

export const useKeshavMetrics = () =>
  useQuery({
    queryKey: ["keshav-metrics-json"],
    queryFn: getMetricsJson,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
  });
