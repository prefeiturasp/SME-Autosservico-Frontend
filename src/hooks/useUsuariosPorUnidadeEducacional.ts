import type { TableRow } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useUsuariosPorUnidadeEducacional({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): TableRow[] => data.usuarios.porUnidadeEducacional,
  );
}
