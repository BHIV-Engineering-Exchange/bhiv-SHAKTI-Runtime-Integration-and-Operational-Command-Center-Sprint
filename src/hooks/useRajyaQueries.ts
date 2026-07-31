import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchRajyaHealth } from "@/api/rajyaEndpoints";

export const useRajyaHealth = () =>
  useQuery({
    queryKey: ["rajya-health"],
    queryFn: fetchRajyaHealth,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });
