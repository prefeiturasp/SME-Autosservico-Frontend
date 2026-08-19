import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import {
  useTableStatsByPeriod,
  type TableStatsByPeriodOptions,
} from "./_helpers/tableStatsByPeriod";

const MOCK_ROWS_BY_PERIOD: Record<AccessComparisonPeriod, TableRow[]> = {
  dia: [
    { label: "Servidores", value: 234 },
    { label: "Estagiários", value: 53 },
    { label: "Parceiros", value: 34 },
  ],
  quinzena: [
    { label: "Servidores", value: 560 },
    { label: "Estagiários", value: 125 },
    { label: "Parceiros", value: 80 },
  ],
  mes: [
    { label: "Servidores", value: 1050 },
    { label: "Estagiários", value: 240 },
    { label: "Parceiros", value: 150 },
  ],
  trimestre: [
    { label: "Servidores", value: 2900 },
    { label: "Estagiários", value: 650 },
    { label: "Parceiros", value: 420 },
  ],
};

export function useOrdemInscricaoPorGanhador(options: TableStatsByPeriodOptions) {
  return useTableStatsByPeriod(
    "ordem-inscricao-por-ganhador",
    MOCK_ROWS_BY_PERIOD,
    options,
  );
}
