import type { LimpezaContratoRow } from "@/types/limpezaMetricas";
import { useLimpezaMetricasQuery } from "./_helpers/limpezaMetricas";

type Options = {
    systemName: string;
};

export function useContratos({ systemName }: Options) {
    return useLimpezaMetricasQuery(
        systemName,
        (data): LimpezaContratoRow[] => data.contratos,
    );
}
