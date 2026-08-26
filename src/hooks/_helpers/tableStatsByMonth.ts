import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";
import { DEFAULT_MONTH } from "@/types/monthOption";

export type TableStatsByMonthOptions = {
  systemName: string;
  month?: string;
};

export function useTableStatsByMonth(
  queryKeyPrefix: string,
  mockRowsByMonth: Record<string, TableRow[]>,
  { systemName, month = DEFAULT_MONTH }: TableStatsByMonthOptions,
) {
  return useQuery<TableRow[]>({
    queryKey: [queryKeyPrefix, systemName, month],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockRowsByMonth[month] ?? [];
    },
  });
}
