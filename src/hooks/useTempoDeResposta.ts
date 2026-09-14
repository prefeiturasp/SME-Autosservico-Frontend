import type { StatsCardResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useTempoDeResposta({ systemName }: Options) {
  return useGipeMetricasQuery(systemName, (data): StatsCardResponse => {
    const tempoResposta = data.ocorrencias.tempoResposta;
    return {
      items: [
        {
          label: "Tempo médio de resolução",
          value: tempoResposta.tempoMedioResolucaoDias,
          variant: "neutral",
          format: "days",
          trend: tempoResposta.tendenciaResolucao,
          trendLabel: tempoResposta.tendenciaResolucaoLabel,
        },
        {
          label: "Tempo médio até a primeira tratativa",
          value: tempoResposta.tempoMedioPrimeiraTratativaDias,
          variant: "neutral",
          format: "days",
          trend: tempoResposta.tendenciaPrimeiraTratativa,
          trendLabel: tempoResposta.tendenciaPrimeiraTratativaLabel,
        },
      ],
    };
  });
}
