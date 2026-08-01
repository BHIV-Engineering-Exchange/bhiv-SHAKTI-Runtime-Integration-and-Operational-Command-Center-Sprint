import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchKarmaHealth,
  fetchKarmaLatestHash,
  fetchKarmaLineage,
  fetchKarmaAncestry,
  fetchKarmaConfidence,
  fetchKarmaReasoning,
  fetchKarmaLiveMetrics,
  fetchKarmaTrends,
  fetchKarmaDharmaSevaFlow,
  fetchKarmaPaapPunyaRatio,
} from "@/api/karmaEndpoints";

export const useKarmaHealth = () =>
  useQuery({
    queryKey: ["karma-health"],
    queryFn: fetchKarmaHealth,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useKarmaLatestHash = () =>
  useQuery({
    queryKey: ["karma-latest-hash"],
    queryFn: fetchKarmaLatestHash,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useKarmaLineage = () =>
  useQuery({
    queryKey: ["karma-lineage"],
    queryFn: fetchKarmaLineage,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useKarmaAncestry = (eventId?: string) =>
  useQuery({
    queryKey: ["karma-ancestry", eventId],
    queryFn: () => fetchKarmaAncestry(eventId!),
    enabled: !!eventId,
    retry: 1,
  });

export const useKarmaConfidence = (trajectoryId?: string) =>
  useQuery({
    queryKey: ["karma-confidence", trajectoryId],
    queryFn: () => fetchKarmaConfidence(trajectoryId!),
    enabled: !!trajectoryId,
    retry: 1,
  });

export const useKarmaReasoning = (trajectoryId?: string) =>
  useQuery({
    queryKey: ["karma-reasoning", trajectoryId],
    queryFn: () => fetchKarmaReasoning(trajectoryId!),
    enabled: !!trajectoryId,
    retry: 1,
  });

export const useKarmaLiveMetrics = () =>
  useQuery({
    queryKey: ["karma-live-metrics"],
    queryFn: fetchKarmaLiveMetrics,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useKarmaTrends = () =>
  useQuery({
    queryKey: ["karma-trends"],
    queryFn: fetchKarmaTrends,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useKarmaDharmaSevaFlow = () =>
  useQuery({
    queryKey: ["karma-dharma-seva-flow"],
    queryFn: fetchKarmaDharmaSevaFlow,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useKarmaPaapPunyaRatio = () =>
  useQuery({
    queryKey: ["karma-paap-punya-ratio"],
    queryFn: fetchKarmaPaapPunyaRatio,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });
