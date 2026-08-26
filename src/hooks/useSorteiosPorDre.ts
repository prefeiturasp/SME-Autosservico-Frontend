import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import { DRE_MOCK_ROWS } from "./_helpers/dreMockRows";
import {
  useTableStatsByPeriod,
  type TableStatsByPeriodOptions,
} from "./_helpers/tableStatsByPeriod";

const MOCK_ROWS_BY_PERIOD: Record<AccessComparisonPeriod, TableRow[]> = {
  dia: DRE_MOCK_ROWS,
  quinzena: DRE_MOCK_ROWS,
  mes: DRE_MOCK_ROWS,
  trimestre: DRE_MOCK_ROWS,
};

export function useSorteiosPorDre(options: TableStatsByPeriodOptions) {
  return useTableStatsByPeriod("sorteios-por-dre", MOCK_ROWS_BY_PERIOD, options);
}
