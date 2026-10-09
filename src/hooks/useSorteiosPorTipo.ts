import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

export function useSorteiosPorTipo({ systemName, period = "dia" }: Options) {
  return useIntranetMetricaQuery<TableRow[]>(
    "sorteios-por-tipo",
    "/api/intranet/sorteios/por-tipo",
    systemName,
    { periodo: period },
  );
}
