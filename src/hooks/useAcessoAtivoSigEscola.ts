import { useQuery } from "@tanstack/react-query";
import type { ActiveAccessUsersResponse } from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import {
    resolveSigEscolaScenario,
    type SigEscolaScenario,
} from "./_helpers/sigEscolaMetricasScenario";

type Options = {
    systemName: string;
    filtros: SigEscolaFiltros;
};

const ACTIVE_COUNT_BY_SCENARIO: Record<SigEscolaScenario, number> = {
    baseline: 4645,
    intervalo: 3372,
    "intervalo-butanta": 209,
};

export function useAcessoAtivoSigEscola({ systemName, filtros }: Options) {
    const scenario = resolveSigEscolaScenario(filtros);

    return useQuery<ActiveAccessUsersResponse>({
        queryKey: ["acesso-ativo-sig-escola", systemName, scenario],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return {
                activeCount: ACTIVE_COUNT_BY_SCENARIO[scenario],
                trend: "on-average",
                trendLabel: "Média dos últimos 30 dias",
            };
        },
    });
}
