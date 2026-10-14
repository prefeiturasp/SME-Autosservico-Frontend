import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

export function useSorteiosPorGanhador({ systemName, period = "dia" }: Options) {
  return useIntranetMetricaQuery<TableRow[]>(
    "sorteios-por-ganhador",
    "/api/intranet/sorteios/por-ganhador",
    systemName,
    { periodo: period },
  );
}
