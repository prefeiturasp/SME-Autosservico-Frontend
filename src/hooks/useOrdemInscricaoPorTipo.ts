import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import {
  useTableStatsByPeriod,
  type TableStatsByPeriodOptions,
} from "./_helpers/tableStatsByPeriod";

const MOCK_ROWS_BY_PERIOD: Record<AccessComparisonPeriod, TableRow[]> = {
  dia: [
    { label: "Premiação", value: 182 },
    { label: "Data específica", value: 93 },
    { label: "Período", value: 26 },
  ],
  quinzena: [
    { label: "Premiação", value: 440 },
    { label: "Data específica", value: 225 },
    { label: "Período", value: 65 },
  ],
  mes: [
    { label: "Premiação", value: 820 },
    { label: "Data específica", value: 410 },
    { label: "Período", value: 120 },
  ],
  trimestre: [
    { label: "Premiação", value: 2300 },
    { label: "Data específica", value: 1150 },
    { label: "Período", value: 330 },
  ],
};

export function useOrdemInscricaoPorTipo(options: TableStatsByPeriodOptions) {
  return useTableStatsByPeriod(
    "ordem-inscricao-por-tipo",
    MOCK_ROWS_BY_PERIOD,
    options,
  );
}
