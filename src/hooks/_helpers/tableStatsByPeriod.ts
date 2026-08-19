import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";

export type TableStatsByPeriodOptions = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

export function useTableStatsByPeriod(
  queryKeyPrefix: string,
  mockRowsByPeriod: Record<AccessComparisonPeriod, TableRow[]>,
  { systemName, period = "dia" }: TableStatsByPeriodOptions,
) {
  return useQuery<TableRow[]>({
    queryKey: [queryKeyPrefix, systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockRowsByPeriod[period];
    },
  });
}
