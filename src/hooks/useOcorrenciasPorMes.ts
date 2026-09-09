import type { AccessComparisonResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useOcorrenciasPorMes({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): AccessComparisonResponse => ({
      buckets: data.ocorrencias.porMes.map((mes) => ({
        label: mes.label,
        value: mes.valor,
        isPeak: mes.pico,
      })),
    }),
  );
}
