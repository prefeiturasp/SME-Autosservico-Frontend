import type { StatsCardResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function usePrazosMovimentacoes({ systemName }: Options) {
  return useGipeMetricasQuery(systemName, (data): StatsCardResponse => {
    const {
      dentroDoPrazo,
      foraDoPrazo,
      semMovimentacao7Dias,
      mediaMovimentacoesPorOcorrencia,
    } = data.ocorrencias.prazosMovimentacoes;
    return {
      items: [
        {
          label: "Ocorrências dentro do prazo",
          value: dentroDoPrazo,
          variant: "neutral",
        },
        {
          label: "Ocorrências fora do prazo",
          value: foraDoPrazo,
          variant: "danger",
        },
        {
          label: "Ocorrências dentro sem movimentações há mais de 7 dias",
          value: semMovimentacao7Dias,
          variant: "warning",
        },
        {
          label: "Média de movimentações por ocorrência",
          value: mediaMovimentacoesPorOcorrencia,
          variant: "neutral",
        },
      ],
    };
  });
}
