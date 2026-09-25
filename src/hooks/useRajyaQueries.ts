import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchRajyaHealth,
  fetchSovereignTraces,
  fetchSovereignBucketEntries,
} from "@/api/rajyaEndpoints";

export const useRajyaHealth = () =>
  useQuery({
    queryKey: ["rajya-health"],
    queryFn: fetchRajyaHealth,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useSovereignTraces = () =>
  useQuery({
    queryKey: ["sovereign-traces"],
    queryFn: fetchSovereignTraces,
    refetchInterval: 3_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useSovereignBucketEntries = () =>
  useQuery({
    queryKey: ["sovereign-bucket-entries"],
    queryFn: fetchSovereignBucketEntries,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });
