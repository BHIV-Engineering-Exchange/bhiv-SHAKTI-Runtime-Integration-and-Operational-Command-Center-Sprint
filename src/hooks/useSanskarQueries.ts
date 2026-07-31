import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getHealth, getRanking, getTrace } from "@/api/sanskarEndpoints";

export const useSanskarHealth = () =>
  useQuery({
    queryKey: ["sanskar-health"],
    queryFn: getHealth,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useSanskarRanking = () =>
  useQuery({
    queryKey: ["sanskar-ranking"],
    queryFn: getRanking,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useSanskarTrace = (traceId?: string) =>
  useQuery({
    queryKey: ["sanskar-trace", traceId],
    queryFn: () => getTrace(traceId!),
    enabled: !!traceId,
    retry: 1,
  });
