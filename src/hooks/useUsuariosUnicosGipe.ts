import type { UniqueUsersPerDayResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useUsuariosUnicosGipe({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): UniqueUsersPerDayResponse => ({
      uniqueCount: data.kpis.usuariosUnicos.valor,
      trend: data.kpis.usuariosUnicos.tendencia,
      trendLabel: data.kpis.usuariosUnicos.tendenciaLabel,
    }),
  );
}
