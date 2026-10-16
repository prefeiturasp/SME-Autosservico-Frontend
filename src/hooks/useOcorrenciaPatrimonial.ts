import type { TableRow } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useOcorrenciaPatrimonial({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): TableRow[] => data.ocorrencias.porTipoPatrimonial,
  );
}
