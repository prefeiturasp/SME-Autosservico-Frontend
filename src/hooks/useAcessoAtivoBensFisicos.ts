import type { ActiveAccessUsersResponse } from "@/types/metricas";
import { useBensFisicosMetricasQuery } from "./_helpers/bensFisicosMetricas";

type Options = {
  systemName: string;
};

export function useAcessoAtivoBensFisicos({ systemName }: Options) {
  return useBensFisicosMetricasQuery(
    systemName,
    (data): ActiveAccessUsersResponse => data.acessoAtivo,
  );
}
