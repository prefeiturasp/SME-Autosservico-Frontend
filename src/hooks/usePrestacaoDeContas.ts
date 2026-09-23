import { useQuery } from "@tanstack/react-query";
import type { PrestacaoDeContasResponse } from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import {
    resolveSigEscolaScenario,
    type SigEscolaScenario,
} from "./_helpers/sigEscolaMetricasScenario";

type Options = {
    systemName: string;
    filtros: SigEscolaFiltros;
};

type PrestacaoDeContasValores = {
    uesAptas: number;
    devolucaoAoTesouro: number;
    pcsEnviadas: number;
    creditosDisponiveis: number;
    despesasRegistradas: number;
    demonstrativosFinanceiros: number;
};

const VALORES_BY_SCENARIO: Record<SigEscolaScenario, PrestacaoDeContasValores> = {
    baseline: {
        uesAptas: 3683,
        devolucaoAoTesouro: 2340530,
        pcsEnviadas: 2490,
        creditosDisponiveis: 197248412.27,
        despesasRegistradas: 90490083.76,
        demonstrativosFinanceiros: 3683,
    },
    intervalo: {
        uesAptas: 2983,
        devolucaoAoTesouro: 1699267.12,
        pcsEnviadas: 1808,
        creditosDisponiveis: 143207752.38,
        despesasRegistradas: 65698279.99,
        demonstrativosFinanceiros: 2674,
    },
    "intervalo-butanta": {
        uesAptas: 126,
        devolucaoAoTesouro: 104354.46,
        pcsEnviadas: 112,
        creditosDisponiveis: 8878880.59,
        despesasRegistradas: 4073293.36,
        demonstrativosFinanceiros: 166,
    },
};

export function usePrestacaoDeContas({ systemName, filtros }: Options) {
    const scenario = resolveSigEscolaScenario(filtros);

    return useQuery<PrestacaoDeContasResponse>({
        queryKey: ["prestacao-de-contas", systemName, scenario],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const valores = VALORES_BY_SCENARIO[scenario];
            return {
                destaque: [
                    {
                        label: "UEs aptas a prestar contas pelo sistema",
                        value: valores.uesAptas,
                        variant: "neutral",
                    },
                    {
                        label: "Devolução ao Tesouro",
                        value: valores.devolucaoAoTesouro,
                        variant: "neutral",
                        format: "currency",
                    },
                ],
                items: [
                    {
                        label: "PCs enviadas ou em andamento com as DREs",
                        value: valores.pcsEnviadas,
                        variant: "neutral",
                    },
                    {
                        label: "Créditos disponíveis para as UEs",
                        value: valores.creditosDisponiveis,
                        variant: "success",
                        format: "currency",
                    },
                    {
                        label: "Despesas registradas pelas UEs",
                        value: valores.despesasRegistradas,
                        variant: "danger",
                        format: "currency",
                    },
                    {
                        label: "Demonstrativos financeiros gerados pelas UEs",
                        value: valores.demonstrativosFinanceiros,
                        variant: "neutral",
                    },
                ],
            };
        },
    });
}
