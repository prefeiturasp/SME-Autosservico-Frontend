import "server-only";

import { bffGet } from "@/lib/bff.server";
import {
    BIMESTRES_POR_SEGMENTO,
    codificarPeriodoSgp,
    periodoCorrente,
    rotuloPeriodoSgp,
} from "@/lib/sgpPeriodo";
import type {
    ActiveAccessUsersResponse,
    ProgressStatsResponse,
    StatItem,
    StatVariant,
} from "@/types/metricas";
import type {
    AcompanhamentoFechamentoResponse,
    PeriodoSgpOption,
    SgpFiltroPeriodo,
    SgpSegmento,
} from "@/types/sgpMetricas";

export { periodoCorrente } from "@/lib/sgpPeriodo";

type ComAcessoAtivo = {
    valor: number | null;
    variacao_30_dias: number | null;
};

type Usuarios = {
    com_acesso_ativo: ComAcessoAtivo | null;
    de_unidades_educacionais: {
        total: number | null;
        diretorias_regionais: number | null;
    } | null;
    unicos_por_dia: number | null;
    acessos_por_hora: number | null;
};

type Frequencias = {
    lancadas: number | null;
    esperadas: number | null;
    percentual: number | null;
};

type Sondagens = {
    realizadas: number | null;
    esperadas: number | null;
};

type FechamentoBuckets = {
    nao_iniciados: number;
    processado_sucesso: number;
    processado_pendencias: number;
    processado_erro: number;
};

type Fechamento = {
    esperado: number | null;
    nao_iniciados: number | null;
    processado_sucesso: number | null;
    processado_pendencias: number | null;
    processado_erro: number | null;
    por_dre: Array<{ dre: string; previsto: number } & FechamentoBuckets>;
};

type ConselhoClasse = {
    esperado: number | null;
    nao_iniciados: number | null;
    em_andamento: number | null;
    processado_sucesso: number | null;
};

type MetricasSgp = {
    atualizado_em: string | null;
    ano_letivo: number;
    bimestre: number;
    usuarios: Usuarios | null;
    frequencias: Frequencias | null;
    sondagens: Sondagens | null;
    fechamento: Fechamento | null;
    conselho_classe: ConselhoClasse | null;
};

type PeriodoOpcao = {
    ano_letivo: number;
    segmento: SgpSegmento;
    semestre: number | null;
    bimestre: number;
    inicio: string;
    fim: string;
};

const CAMINHO_METRICAS = "/api/v1/sgp/metricas/";
const CAMINHO_PERIODOS = "/api/v1/sgp/periodos/";

export function resolverPeriodo(searchParams: URLSearchParams): {
    anoLetivo: number;
    bimestre: number;
} {
    const corrente = periodoCorrente();
    const ano = Number(searchParams.get("ano_letivo"));
    const bimestre = Number(searchParams.get("bimestre"));
    return {
        anoLetivo:
            Number.isInteger(ano) &&
            ano >= 2020 &&
            ano <= corrente.anoLetivo + 1
                ? ano
                : corrente.anoLetivo,
        bimestre:
            Number.isInteger(bimestre) && bimestre >= 1 && bimestre <= 4
                ? bimestre
                : corrente.bimestre,
    };
}

export function resolverFiltrosSgp(
    searchParams: URLSearchParams,
): SgpFiltroPeriodo {
    const { anoLetivo, bimestre } = resolverPeriodo(searchParams);
    const padrao: SgpFiltroPeriodo = {
        anoLetivo,
        bimestre,
        segmento: "fundamental_medio",
        semestre: null,
    };
    if (searchParams.get("segmento") !== "eja") return padrao;

    const semestre = Number(searchParams.get("semestre"));
    if (
        (semestre !== 1 && semestre !== 2) ||
        bimestre > BIMESTRES_POR_SEGMENTO.eja
    ) {
        return padrao;
    }
    return { anoLetivo, bimestre, segmento: "eja", semestre };
}

async function obterMetricas(filtro: SgpFiltroPeriodo): Promise<MetricasSgp> {
    const params = new URLSearchParams({
        ano_letivo: String(filtro.anoLetivo),
        bimestre: String(filtro.bimestre),
        segmento: filtro.segmento,
    });
    if (filtro.semestre !== null) {
        params.set("semestre", String(filtro.semestre));
    }
    return bffGet<MetricasSgp>(`${CAMINHO_METRICAS}?${params}`);
}

function filtroSemSegmento(
    anoLetivo: number,
    bimestre: number,
): SgpFiltroPeriodo {
    return {
        anoLetivo,
        bimestre,
        segmento: "fundamental_medio",
        semestre: null,
    };
}

function percentual(parte: number, total: number): number {
    return total > 0 ? Math.round((parte / total) * 10000) / 100 : 0;
}

export async function fetchFrequencias(
    anoLetivo: number,
    bimestre: number,
): Promise<ProgressStatsResponse> {
    const { frequencias } = await obterMetricas(
        filtroSemSegmento(anoLetivo, bimestre),
    );
    return {
        items: [
            {
                label: "Lançadas",
                value: frequencias?.lancadas ?? 0,
                variant: "neutral",
            },
            {
                label: "Esperadas",
                value: frequencias?.esperadas ?? 0,
                variant: "muted",
            },
        ],
        progressPercentage: frequencias?.percentual ?? 0,
    };
}

export async function fetchSondagens(
    anoLetivo: number,
    bimestre: number,
): Promise<ProgressStatsResponse> {
    const { sondagens } = await obterMetricas(
        filtroSemSegmento(anoLetivo, bimestre),
    );
    const realizadas = sondagens?.realizadas ?? 0;
    const esperadas = sondagens?.esperadas ?? 0;
    return {
        items: [
            {
                label: "Sondagens realizadas",
                value: realizadas,
                variant: "neutral",
            },
            {
                label: "Sondagens esperadas",
                value: esperadas,
                variant: "muted",
            },
        ],
        progressPercentage:
            esperadas > 0
                ? Math.round((realizadas / esperadas) * 1000) / 10
                : 0,
    };
}

const FECHAMENTO_ITENS: ReadonlyArray<{
    chave: keyof FechamentoBuckets;
    label: string;
    variant: StatVariant;
}> = [
    { chave: "nao_iniciados", label: "Não iniciados", variant: "muted" },
    {
        chave: "processado_sucesso",
        label: "Processado com sucesso",
        variant: "success",
    },
    {
        chave: "processado_pendencias",
        label: "Processado com pendências",
        variant: "warning",
    },
    {
        chave: "processado_erro",
        label: "Processado com erro",
        variant: "danger",
    },
];

export async function fetchAcompanhamentoFechamento(
    filtro: SgpFiltroPeriodo,
): Promise<AcompanhamentoFechamentoResponse> {
    const { fechamento } = await obterMetricas(filtro);
    const esperado = fechamento?.esperado ?? 0;
    const naoIniciados = fechamento?.nao_iniciados ?? 0;
    return {
        itens: [
            {
                label: "Esperado para o período",
                value: esperado,
                variant: "neutral",
                percentage: percentual(esperado - naoIniciados, esperado),
            },
            ...FECHAMENTO_ITENS.map(({ chave, label, variant }) => ({
                label,
                value: fechamento?.[chave] ?? 0,
                variant,
                percentage: percentual(fechamento?.[chave] ?? 0, esperado),
            })),
        ],
        porDre: (fechamento?.por_dre ?? []).map((linha) => ({
            dre: linha.dre,
            previsto: linha.previsto,
            naoIniciados: linha.nao_iniciados,
            processadoSucesso: linha.processado_sucesso,
            processadoPendencias: linha.processado_pendencias,
            processadoErro: linha.processado_erro,
        })),
    };
}

const CONSELHO_ITENS: ReadonlyArray<{
    chave: "nao_iniciados" | "em_andamento" | "processado_sucesso";
    label: string;
    variant: StatVariant;
}> = [
    { chave: "nao_iniciados", label: "Não iniciados", variant: "muted" },
    { chave: "em_andamento", label: "Em andamento", variant: "neutral" },
    {
        chave: "processado_sucesso",
        label: "Processado com sucesso",
        variant: "success",
    },
];

export async function fetchConselhoDeClasse(
    filtro: SgpFiltroPeriodo,
): Promise<StatItem[]> {
    const { conselho_classe } = await obterMetricas(filtro);
    const esperado = conselho_classe?.esperado ?? 0;
    const naoIniciados = conselho_classe?.nao_iniciados ?? 0;
    return [
        {
            label: "Esperados para o período",
            value: esperado,
            variant: "neutral",
            percentage: percentual(esperado - naoIniciados, esperado),
        },
        ...CONSELHO_ITENS.map(({ chave, label, variant }) => ({
            label,
            value: conselho_classe?.[chave] ?? 0,
            variant,
            percentage: percentual(conselho_classe?.[chave] ?? 0, esperado),
        })),
    ];
}

export async function fetchPeriodosSgp(): Promise<PeriodoSgpOption[]> {
    const { periodos } = await bffGet<{ periodos: PeriodoOpcao[] | null }>(
        CAMINHO_PERIODOS,
    );
    return (periodos ?? []).map((periodo) => {
        const filtro: SgpFiltroPeriodo = {
            anoLetivo: periodo.ano_letivo,
            segmento: periodo.segmento,
            semestre: periodo.semestre,
            bimestre: periodo.bimestre,
        };
        return {
            value: codificarPeriodoSgp(filtro),
            label: rotuloPeriodoSgp(filtro),
            segmento: periodo.segmento,
        };
    });
}

export async function fetchUsuariosAcessoAtivo(
    anoLetivo: number,
    bimestre: number,
): Promise<ActiveAccessUsersResponse> {
    const { usuarios } = await obterMetricas(
        filtroSemSegmento(anoLetivo, bimestre),
    );
    const novos = usuarios?.com_acesso_ativo?.variacao_30_dias ?? 0;
    return {
        activeCount: usuarios?.com_acesso_ativo?.valor ?? 0,
        trend: novos > 0 ? "above" : "on-average",
        trendLabel: `${novos} novos nos últimos 30 dias`,
    };
}
