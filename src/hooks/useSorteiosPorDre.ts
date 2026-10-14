import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

export function useSorteiosPorDre({ systemName, period = "dia" }: Options) {
  return useIntranetMetricaQuery<TableRow[]>(
    "sorteios-por-dre",
    "/api/intranet/sorteios/por-dre",
    systemName,
    { periodo: period },
  );
}
