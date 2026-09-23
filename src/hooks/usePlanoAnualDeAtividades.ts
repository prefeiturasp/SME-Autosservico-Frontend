import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import {
    resolveSigEscolaScenario,
    type SigEscolaScenario,
} from "./_helpers/sigEscolaMetricasScenario";

type Options = {
    systemName: string;
    filtros: SigEscolaFiltros;
};

type PlanoAnualValores = {
    emAndamento: number;
    finalizados: number;
    emRetificacao: number;
};

const VALORES_BY_SCENARIO: Record<SigEscolaScenario, PlanoAnualValores> = {
    baseline: {
        emAndamento: 318,
        finalizados: 1204,
        emRetificacao: 42,
    },
    intervalo: {
        emAndamento: 231,
        finalizados: 874,
        emRetificacao: 30,
    },
    "intervalo-butanta": {
        emAndamento: 14,
        finalizados: 54,
        emRetificacao: 4,
    },
};

export function usePlanoAnualDeAtividades({ systemName, filtros }: Options) {
    const scenario = resolveSigEscolaScenario(filtros);

    return useQuery<StatsCardResponse>({
        queryKey: ["plano-anual-de-atividades", systemName, scenario],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const valores = VALORES_BY_SCENARIO[scenario];
            return {
                items: [
                    {
                        label: "PAAs em andamento",
                        value: valores.emAndamento,
                        variant: "neutral",
                    },
                    {
                        label: "PAAs finalizados",
                        value: valores.finalizados,
                        variant: "success",
                    },
                    {
                        label: "PAAs em retificação",
                        value: valores.emRetificacao,
                        variant: "warning",
                    },
                ],
            };
        },
    });
}
