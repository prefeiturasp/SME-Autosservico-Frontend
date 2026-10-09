import type { StatsCardResponse } from "@/types/metricas";
import { useIntranetMetricaQuery } from "./_helpers/intranetMetricaQuery";

type Options = {
  systemName: string;
};

export function useOportunidadesRecrutamento({ systemName }: Options) {
  return useIntranetMetricaQuery<StatsCardResponse>(
    "oportunidades-recrutamento-status-geral",
    "/api/intranet/oportunidades",
    systemName,
  );
}
