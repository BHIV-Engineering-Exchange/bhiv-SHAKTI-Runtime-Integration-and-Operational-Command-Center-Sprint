import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getPravahTraceRegistry,
  getPravahEvidence,
} from "@/api/pravahEndpoints";

export const usePravahTraceRegistry = (traceId?: string) =>
  useQuery({
    queryKey: ["pravah-trace-registry", traceId],
    queryFn: () => getPravahTraceRegistry(traceId!),
    enabled: Boolean(traceId),
    refetchInterval: 15_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const usePravahEvidence = (evidenceRef?: string) =>
  useQuery({
    queryKey: ["pravah-evidence", evidenceRef],
    queryFn: () => getPravahEvidence(evidenceRef!),
    enabled: Boolean(evidenceRef),
    refetchInterval: 30_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });
