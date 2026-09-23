import { useQuery } from "@tanstack/react-query";
import type { TodayAccessResponse } from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import {
    resolveSigEscolaScenario,
    type SigEscolaScenario,
} from "./_helpers/sigEscolaMetricasScenario";

type Options = {
    systemName: string;
    filtros: SigEscolaFiltros;
};

const ACCESS_COUNT_BY_SCENARIO: Record<SigEscolaScenario, number> = {
    baseline: 944,
    intervalo: 231,
    "intervalo-butanta": 23,
};

export function useTotalAcessosHojeSigEscola({ systemName, filtros }: Options) {
    const scenario = resolveSigEscolaScenario(filtros);

    return useQuery<TodayAccessResponse>({
        queryKey: ["total-acessos-hoje-sig-escola", systemName, scenario],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return {
                accessCount: ACCESS_COUNT_BY_SCENARIO[scenario],
                trend: "above",
                trendLabel: "13 novos nos últimos 30 dias",
            };
        },
    });
}
