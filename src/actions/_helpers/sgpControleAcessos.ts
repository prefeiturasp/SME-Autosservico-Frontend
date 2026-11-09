import "server-only";

import { bffGet } from "@/lib/bff.server";
import type {
    ControleAcessosSgpResponse,
    GranularidadeAcessos,
    SerieAcessosSgpResponse,
} from "@/types/sgpControleAcessos";

type ControleAcessosBff = {
    atualizado_em: string | null;
    limite_conexoes: number | null;
    conectados: {
        total: number | null;
        sgp: number | null;
        sondagem: number | null;
    } | null;
    em_fila: number | null;
    fila_iniciada_em: string | null;
    tempo_espera_estimado: {
        media_s: number | null;
        posicao_media: number | null;
        testes: number;
        atingiu_limite_teste: boolean;
    } | null;
};

type SerieAcessosBff = {
    granularidade: GranularidadeAcessos;
    atualizado_em: string | null;
    pontos: Array<{
        inicio: string;
        total: number;
        em_fila_max: number;
        fila_ativa: boolean;
    }>;
};

const CAMINHO_CONTROLE_ACESSOS = "/api/v1/zabbix/sgp/controle-acessos/";
const FUSO = "America/Sao_Paulo";

export const GRANULARIDADES_ACESSOS: ReadonlyArray<GranularidadeAcessos> = [
    "hora",
    "dia",
    "mes",
    "ano",
];

const FORMATO_ROTULO: Record<GranularidadeAcessos, Intl.DateTimeFormatOptions> =
    {
        hora: { hour: "2-digit", minute: "2-digit", hour12: false },
        dia: { day: "2-digit", month: "2-digit" },
        mes: { month: "short" },
        ano: { year: "numeric" },
    };

export function resolverGranularidade(
    searchParams: URLSearchParams,
): GranularidadeAcessos {
    const valor = searchParams.get("granularidade");
    return GRANULARIDADES_ACESSOS.find((g) => g === valor) ?? "hora";
}

function rotuloDoPonto(inicio: string, granularidade: GranularidadeAcessos) {
    const rotulo = new Intl.DateTimeFormat("pt-BR", {
        ...FORMATO_ROTULO[granularidade],
        timeZone: FUSO,
    }).format(new Date(inicio));
    return granularidade === "mes" ? rotulo.replace(".", "") : rotulo;
}

export async function fetchControleAcessos(): Promise<ControleAcessosSgpResponse> {
    const estado = await bffGet<ControleAcessosBff>(CAMINHO_CONTROLE_ACESSOS);
    const tempo = estado.tempo_espera_estimado;
    return {
        atualizadoEm: estado.atualizado_em,
        limiteConexoes: estado.limite_conexoes,
        conectados: estado.conectados?.total ?? null,
        emFila: estado.em_fila,
        filaIniciadaEm: estado.fila_iniciada_em,
        tempoEspera: tempo && {
            mediaSegundos: tempo.media_s,
            posicaoMedia: tempo.posicao_media,
            testes: tempo.testes,
            atingiuLimiteTeste: tempo.atingiu_limite_teste,
        },
    };
}

export async function fetchSerieAcessos(
    granularidade: GranularidadeAcessos,
): Promise<SerieAcessosSgpResponse> {
    const serie = await bffGet<SerieAcessosBff>(
        `${CAMINHO_CONTROLE_ACESSOS}serie/?granularidade=${granularidade}`,
    );
    return {
        granularidade,
        pontos: serie.pontos.map((ponto) => ({
            label: rotuloDoPonto(ponto.inicio, granularidade),
            total: ponto.total,
            emFilaMax: ponto.em_fila_max,
            filaAtiva: ponto.fila_ativa,
        })),
    };
}
