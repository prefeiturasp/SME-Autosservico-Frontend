import type { StatsCardResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useOcorrenciasStatusGeral({ systemName }: Options) {
  return useGipeMetricasQuery(systemName, (data): StatsCardResponse => {
    const { cadastrados, abertas, emAndamento, finalizadas } =
      data.ocorrencias.statusGeral;
    return {
      items: [
        { label: "Cadastrados", value: cadastrados, variant: "neutral" },
        { label: "Abertas", value: abertas, variant: "success" },
        { label: "Em andamento", value: emAndamento, variant: "warning" },
        { label: "Finalizadas", value: finalizadas, variant: "success" },
      ],
    };
  });
}
