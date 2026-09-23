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

type SituacaoPatrimonialValores = {
    quantidadeDeBens: number;
    valorDosBens: number;
};

const VALORES_BY_SCENARIO: Record<SigEscolaScenario, SituacaoPatrimonialValores> = {
    baseline: { quantidadeDeBens: 318, valorDosBens: 842212.85 },
    intervalo: { quantidadeDeBens: 286, valorDosBens: 654231.13 },
    "intervalo-butanta": { quantidadeDeBens: 32, valorDosBens: 14132.96 },
};

export function useSituacaoPatrimonial({ systemName, filtros }: Options) {
    const scenario = resolveSigEscolaScenario(filtros);

    return useQuery<StatsCardResponse>({
        queryKey: ["situacao-patrimonial", systemName, scenario],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const valores = VALORES_BY_SCENARIO[scenario];
            return {
                items: [
                    {
                        label: "Quantidade de bens produzidos pelas UEs",
                        value: valores.quantidadeDeBens,
                        variant: "neutral",
                    },
                    {
                        label: "Valor dos bens produzidos",
                        value: valores.valorDosBens,
                        variant: "neutral",
                        format: "currency",
                    },
                ],
            };
        },
    });
}
