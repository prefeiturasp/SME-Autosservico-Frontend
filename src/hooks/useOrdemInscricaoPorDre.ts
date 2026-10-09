import type { TableRow } from "@/types/metricas";
import { DEFAULT_MONTH } from "@/types/monthOption";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
  month?: string;
};

export function useOrdemInscricaoPorDre({ systemName, month = DEFAULT_MONTH }: Options) {
  return useIntranetMetricaQuery<TableRow[]>(
    "ordem-inscricao-por-dre",
    "/api/intranet/ordem-inscricao/por-dre",
    systemName,
    { mes: month },
  );
}
