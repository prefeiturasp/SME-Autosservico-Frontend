import type { TodayAccessResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useTotalAcessosHojeGipe({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): TodayAccessResponse => ({
      accessCount: data.kpis.acessosHoje.valor,
      trend: data.kpis.acessosHoje.tendencia,
      trendLabel: data.kpis.acessosHoje.tendenciaLabel,
    }),
  );
}
