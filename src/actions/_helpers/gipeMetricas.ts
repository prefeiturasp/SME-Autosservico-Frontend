import "server-only";
import { bffGet } from "@/lib/bff.server";
import type { MetricTrend } from "@/types/metric";
import type { ActiveAccessUsersResponse, TableRow } from "@/types/metricas";
import type { GipeMetricasKpi, GipeMetricasResponse } from "@/types/gipeMetricas";

type Kpi = {
  valor: number;
  tendencia: MetricTrend | null;
  tendencia_label: string | null;
};

// Contrato do BFF (espelha o serializer do Backend). Com o cache frio vem o
// mesmo formato com atualizado_em e os blocos null; obterMetricas barra esse
// caso, então quem recebe o contrato sempre tem os blocos preenchidos.
type Contrato = {
  atualizado_em: string | null;
  ano_letivo: number;
  kpis: { acesso_ativo: Kpi; usuarios_unicos: Kpi; acessos_hoje: Kpi };
  ocorrencias: {
    status_geral: {
      cadastrados: number;
      abertas: number;
      em_andamento: number;
      finalizadas: number;
    };
    tempo_resposta: {
      tempo_medio_resolucao_dias: number | null;
      tendencia_resolucao: MetricTrend | null;
      tendencia_resolucao_label: string | null;
      tempo_medio_primeira_tratativa_dias: number | null;
      tendencia_primeira_tratativa: MetricTrend | null;
      tendencia_primeira_tratativa_label: string | null;
    };
    prazos_movimentacoes: {
      dentro_do_prazo: number | null;
      fora_do_prazo: number | null;
      sem_movimentacao_7_dias: number;
      media_movimentacoes_por_ocorrencia: number | null;
    };
    por_dre: TableRow[];
    por_unidade_educacional: TableRow[];
    por_categoria: { patrimoniais: number; interpessoais: number };
    por_tipo_patrimonial: TableRow[];
    por_tipo_interpessoal: TableRow[];
    por_mes: { label: string; valor: number; pico: boolean }[];
    por_periodo_letivo: TableRow[];
    tratadas_por_analista: {
      analista: string;
      ocorrencias_tratadas: number;
      tempo_medio: string;
    }[];
    tratadas_por_dre: TableRow[];
  };
  usuarios: {
    cadastrados: number;
    por_tipo_de_perfil: { label: string; percentage: number }[];
    perfis_mais_utilizados: TableRow[];
    por_dre: TableRow[];
    por_unidade_educacional: TableRow[];
  };
  produtividade: {
    encaminhamentos_realizados: number;
    anexos_enviados: number;
    atualizacoes_nas_ocorrencias: number;
  };
};

const CAMINHO_METRICAS = "/api/v1/gipe/metricas/";

/**
 * Busca o contrato no BFF. Com o cache frio, o BFF devolve o fallback
 * (atualizado_em null) e calcula em background: aqui isso vira erro, a rota
 * responde 500 e o retry do TanStack Query pergunta de novo, como no
 * SIG-Escola. O fallback não pode virar zero "real" no card.
 */
async function obterMetricas(anoLetivo: string | null): Promise<Contrato> {
  const contrato = await bffGet<Contrato>(
    anoLetivo
      ? `${CAMINHO_METRICAS}?${new URLSearchParams({ ano_letivo: anoLetivo })}`
      : CAMINHO_METRICAS,
  );
  if (contrato.atualizado_em === null) {
    throw new Error("Métricas do GIPE ainda indisponíveis");
  }
  return contrato;
}

/**
 * Sem histórico de login no GIPE, o Backend manda a tendência nula; o
 * rótulo vazio faz o card esconder o selo (o MetricCard exige os dois).
 */
function kpi({ valor, tendencia, tendencia_label }: Kpi): GipeMetricasKpi {
  return {
    valor,
    tendencia: tendencia ?? "on-average",
    tendenciaLabel: tendencia_label ?? "",
  };
}

// No tempo de resposta, menor é melhor: o Backend manda below para "mais
// rápido", mas no selo o verde (↑) é above. Inverte só o sentido.
const SENTIDO_DO_TEMPO: Record<MetricTrend, MetricTrend> = {
  below: "above",
  above: "below",
  "on-average": "on-average",
};

const tendenciaDoTempo = (tendencia: MetricTrend | null) =>
  tendencia ? SENTIDO_DO_TEMPO[tendencia] : undefined;

/** Os cards da aba Métricas do GIPE, para o ano letivo da query. */
export async function fetchMetricasGipe(
  searchParams: URLSearchParams,
): Promise<GipeMetricasResponse> {
  const { kpis, ocorrencias: o, usuarios: u, produtividade: p } =
    await obterMetricas(searchParams.get("ano_letivo"));
  const tempo = o.tempo_resposta;
  const prazos = o.prazos_movimentacoes;
  return {
    kpis: {
      acessoAtivo: kpi(kpis.acesso_ativo),
      usuariosUnicos: kpi(kpis.usuarios_unicos),
      acessosHoje: kpi(kpis.acessos_hoje),
    },
    ocorrencias: {
      statusGeral: {
        cadastrados: o.status_geral.cadastrados,
        abertas: o.status_geral.abertas,
        emAndamento: o.status_geral.em_andamento,
        finalizadas: o.status_geral.finalizadas,
      },
      tempoResposta: {
        tempoMedioResolucaoDias: tempo.tempo_medio_resolucao_dias,
        tendenciaResolucao: tendenciaDoTempo(tempo.tendencia_resolucao),
        tendenciaResolucaoLabel: tempo.tendencia_resolucao_label ?? undefined,
        tempoMedioPrimeiraTratativaDias:
          tempo.tempo_medio_primeira_tratativa_dias,
        tendenciaPrimeiraTratativa: tendenciaDoTempo(
          tempo.tendencia_primeira_tratativa,
        ),
        tendenciaPrimeiraTratativaLabel:
          tempo.tendencia_primeira_tratativa_label ?? undefined,
      },
      prazosMovimentacoes: {
        dentroDoPrazo: prazos.dentro_do_prazo,
        foraDoPrazo: prazos.fora_do_prazo,
        semMovimentacao7Dias: prazos.sem_movimentacao_7_dias,
        mediaMovimentacoesPorOcorrencia:
          prazos.media_movimentacoes_por_ocorrencia,
      },
      porDre: o.por_dre,
      porUnidadeEducacional: o.por_unidade_educacional,
      porCategoria: o.por_categoria,
      porTipoPatrimonial: o.por_tipo_patrimonial,
      porTipoInterpessoal: o.por_tipo_interpessoal,
      porMes: o.por_mes,
      porPeriodoLetivo: o.por_periodo_letivo,
      tratadasPorAnalista: o.tratadas_por_analista.map((a) => ({
        analista: a.analista,
        ocorrenciasTratadas: a.ocorrencias_tratadas,
        tempoMedio: a.tempo_medio,
      })),
      tratadasPorDre: o.tratadas_por_dre,
    },
    usuarios: {
      cadastrados: u.cadastrados,
      porTipoDePerfil: u.por_tipo_de_perfil,
      perfisMaisUtilizados: u.perfis_mais_utilizados,
      porDre: u.por_dre,
      porUnidadeEducacional: u.por_unidade_educacional,
    },
    produtividade: {
      encaminhamentosRealizados: p.encaminhamentos_realizados,
      anexosEnviados: p.anexos_enviados,
      atualizacoesNasOcorrencias: p.atualizacoes_nas_ocorrencias,
    },
  };
}

/** Usuários com acesso ativo da aba Operacional (ano corrente, via Beat). */
export async function fetchUsuariosAcessoAtivoGipe(): Promise<ActiveAccessUsersResponse> {
  const { kpis } = await obterMetricas(null);
  const { valor, tendencia, tendenciaLabel } = kpi(kpis.acesso_ativo);
  return { activeCount: valor, trend: tendencia, trendLabel: tendenciaLabel };
}
