import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import {
  useTableStatsByPeriod,
  type TableStatsByPeriodOptions,
} from "./_helpers/tableStatsByPeriod";

const MOCK_ROWS_BY_PERIOD: Record<AccessComparisonPeriod, TableRow[]> = {
  dia: [
    { label: "Premiação", value: 254 },
    { label: "Data específica", value: 124 },
    { label: "Período", value: 57 },
  ],
  quinzena: [
    { label: "Premiação", value: 620 },
    { label: "Data específica", value: 310 },
    { label: "Período", value: 140 },
  ],
  mes: [
    { label: "Premiação", value: 1080 },
    { label: "Data específica", value: 540 },
    { label: "Período", value: 250 },
  ],
  trimestre: [
    { label: "Premiação", value: 2900 },
    { label: "Data específica", value: 1450 },
    { label: "Período", value: 650 },
  ],
};

export function useSorteiosPorTipo(options: TableStatsByPeriodOptions) {
  return useTableStatsByPeriod("sorteios-por-tipo", MOCK_ROWS_BY_PERIOD, options);
}
