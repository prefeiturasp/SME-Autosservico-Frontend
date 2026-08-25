import { useQuery } from "@tanstack/react-query";
import type { ProgressStatsResponse } from "@/types/metricas";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";

export type ProgressStatsByBimestreOptions = {
  systemName: string;
  bimestre?: string;
};

export function useProgressStatsByBimestre(
  queryKeyPrefix: string,
  mockResponseByBimestre: Record<string, ProgressStatsResponse>,
  { systemName, bimestre = DEFAULT_BIMESTRE }: ProgressStatsByBimestreOptions,
) {
  return useQuery<ProgressStatsResponse>({
    queryKey: [queryKeyPrefix, systemName, bimestre],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockResponseByBimestre[bimestre];
    },
  });
}
