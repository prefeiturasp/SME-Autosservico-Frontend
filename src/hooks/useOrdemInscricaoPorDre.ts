import type { TableRow } from "@/types/metricas";
import { MONTH_OPTIONS } from "@/types/monthOption";
import { DRE_MOCK_ROWS } from "./_helpers/dreMockRows";
import {
  useTableStatsByMonth,
  type TableStatsByMonthOptions,
} from "./_helpers/tableStatsByMonth";

const MOCK_ROWS_BY_MONTH: Record<string, TableRow[]> = Object.fromEntries(
  MONTH_OPTIONS.map((month) => [month.value, DRE_MOCK_ROWS]),
);

export function useOrdemInscricaoPorDre(options: TableStatsByMonthOptions) {
  return useTableStatsByMonth("ordem-inscricao-por-dre", MOCK_ROWS_BY_MONTH, options);
}
