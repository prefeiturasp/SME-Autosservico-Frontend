import type { StatsCardResponse } from "@/types/metricas";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
};

export function useSorteiosStatusGeral({ systemName }: Options) {
  return useIntranetMetricaQuery<StatsCardResponse>(
    "sorteios-status-geral",
    "/api/intranet/sorteios/status-geral",
    systemName,
  );
}
