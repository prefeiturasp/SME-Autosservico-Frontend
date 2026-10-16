import type { TableRow } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useOcorrenciasPorDre({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): TableRow[] => data.ocorrencias.porDre,
  );
}
