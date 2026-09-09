import type { StatsCardResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useProdutividadeTotais({ systemName }: Options) {
  return useGipeMetricasQuery(systemName, (data): StatsCardResponse => {
    const {
      encaminhamentosRealizados,
      anexosEnviados,
      atualizacoesNasOcorrencias,
    } = data.produtividade;
    return {
      items: [
        {
          label: "Encaminhamentos realizados",
          value: encaminhamentosRealizados,
          variant: "neutral",
        },
        { label: "Anexos enviados", value: anexosEnviados, variant: "neutral" },
        {
          label: "Atualizações nas ocorrências",
          value: atualizacoesNasOcorrencias,
          variant: "neutral",
        },
      ],
    };
  });
}
