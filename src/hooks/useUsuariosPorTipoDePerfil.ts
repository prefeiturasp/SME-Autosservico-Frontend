import type { ProfileDistributionResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useUsuariosPorTipoDePerfil({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): ProfileDistributionResponse => ({
      items: data.usuarios.porTipoDePerfil,
    }),
  );
}
