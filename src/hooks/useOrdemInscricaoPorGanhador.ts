import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

export function useOrdemInscricaoPorGanhador({ systemName, period = "dia" }: Options) {
  return useIntranetMetricaQuery<TableRow[]>(
    "ordem-inscricao-por-ganhador",
    "/api/intranet/ordem-inscricao/por-ganhador",
    systemName,
    { periodo: period },
  );
}
