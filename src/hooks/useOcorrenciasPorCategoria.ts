import type { StatsCardResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useOcorrenciasPorCategoria({ systemName }: Options) {
  return useGipeMetricasQuery(systemName, (data): StatsCardResponse => {
    const { patrimoniais, interpessoais } = data.ocorrencias.porCategoria;
    return {
      items: [
        {
          label: "Ocorrências patrimoniais",
          value: patrimoniais,
          variant: "neutral",
        },
        {
          label: "Ocorrências interpessoais",
          value: interpessoais,
          variant: "neutral",
        },
      ],
    };
  });
}
