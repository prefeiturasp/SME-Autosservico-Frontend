import type { StatsCardResponse } from "@/types/metricas";
import { useBensFisicosMetricasQuery } from "./_helpers/bensFisicosMetricas";

type Options = {
  systemName: string;
};

export function useBaixasFisicas({ systemName }: Options) {
  return useBensFisicosMetricasQuery(
    systemName,
    (data): StatsCardResponse => data.baixasFisicas,
  );
}
