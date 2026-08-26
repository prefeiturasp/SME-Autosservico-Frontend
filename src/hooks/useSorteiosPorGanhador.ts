import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import {
  useTableStatsByPeriod,
  type TableStatsByPeriodOptions,
} from "./_helpers/tableStatsByPeriod";

const MOCK_ROWS_BY_PERIOD: Record<AccessComparisonPeriod, TableRow[]> = {
  dia: [
    { label: "Servidores", value: 483 },
    { label: "Estagiários", value: 122 },
    { label: "Parceiros", value: 138 },
  ],
  quinzena: [
    { label: "Servidores", value: 1150 },
    { label: "Estagiários", value: 290 },
    { label: "Parceiros", value: 330 },
  ],
  mes: [
    { label: "Servidores", value: 2200 },
    { label: "Estagiários", value: 560 },
    { label: "Parceiros", value: 620 },
  ],
  trimestre: [
    { label: "Servidores", value: 6100 },
    { label: "Estagiários", value: 1550 },
    { label: "Parceiros", value: 1700 },
  ],
};

export function useSorteiosPorGanhador(options: TableStatsByPeriodOptions) {
  return useTableStatsByPeriod("sorteios-por-ganhador", MOCK_ROWS_BY_PERIOD, options);
}
