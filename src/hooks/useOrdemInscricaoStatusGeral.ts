import type { StatsCardResponse } from "@/types/metricas";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
};

export function useOrdemInscricaoStatusGeral({ systemName }: Options) {
  return useIntranetMetricaQuery<StatsCardResponse>(
    "ordem-inscricao-status-geral",
    "/api/intranet/ordem-inscricao/status-geral",
    systemName,
  );
}
