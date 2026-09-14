import type { AnalistaTableRow } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useOcorrenciasTratadasPorAnalista({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): AnalistaTableRow[] => data.ocorrencias.tratadasPorAnalista,
  );
}
