import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";

export type TableStatsOptions = {
  systemName: string;
};

export function useTableStats(
  queryKeyPrefix: string,
  mockRows: TableRow[],
  { systemName }: TableStatsOptions,
) {
  return useQuery<TableRow[]>({
    queryKey: [queryKeyPrefix, systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockRows;
    },
  });
}
