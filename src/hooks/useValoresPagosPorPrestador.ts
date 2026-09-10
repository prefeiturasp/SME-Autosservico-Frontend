import type { TableRow } from "@/types/metricas";
import { useLimpezaMetricasQuery } from "./_helpers/limpezaMetricas";

type Options = {
    systemName: string;
};

export function useValoresPagosPorPrestador({ systemName }: Options) {
    return useLimpezaMetricasQuery(
        systemName,
        (data): TableRow[] => data.valoresPagosPorPrestador,
    );
}
