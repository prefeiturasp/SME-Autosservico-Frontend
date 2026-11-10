import type { UniqueUsersPerDayResponse } from "@/types/metricas";
import { useBensFisicosMetricasQuery } from "./_helpers/bensFisicosMetricas";

type Options = {
  systemName: string;
};

export function useUsuariosUnicosBensFisicos({ systemName }: Options) {
  return useBensFisicosMetricasQuery(
    systemName,
    (data): UniqueUsersPerDayResponse => data.usuariosUnicos,
  );
}
