import type { TableRow } from "@/types/metricas";
import { useBensFisicosMetricasQuery } from "./_helpers/bensFisicosMetricas";

type Options = {
  systemName: string;
};

export function useBensCadastradosPorUnidade({ systemName }: Options) {
  return useBensFisicosMetricasQuery(
    systemName,
    (data): TableRow[] => data.bensPorUnidade,
  );
}
