import type { ActiveAccessUsersResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useAcessoAtivoGipe({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): ActiveAccessUsersResponse => ({
      activeCount: data.kpis.acessoAtivo.valor,
      trend: data.kpis.acessoAtivo.tendencia,
      trendLabel: data.kpis.acessoAtivo.tendenciaLabel,
    }),
  );
}
