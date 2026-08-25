import { useQuery } from "@tanstack/react-query";
import type { StatItem } from "@/types/metricas";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";

export type StatsByBimestreOptions = {
  systemName: string;
  bimestre?: string;
};

export function useStatsByBimestre(
  queryKeyPrefix: string,
  mockItemsByBimestre: Record<string, StatItem[]>,
  { systemName, bimestre = DEFAULT_BIMESTRE }: StatsByBimestreOptions,
) {
  return useQuery<StatItem[]>({
    queryKey: [queryKeyPrefix, systemName, bimestre],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockItemsByBimestre[bimestre];
    },
  });
}
