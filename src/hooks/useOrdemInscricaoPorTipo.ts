import type { TableRow } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

export function useOrdemInscricaoPorTipo({ systemName, period = "dia" }: Options) {
  return useIntranetMetricaQuery<TableRow[]>(
    "ordem-inscricao-por-tipo",
    "/api/intranet/ordem-inscricao/por-tipo",
    systemName,
    { periodo: period },
  );
}
