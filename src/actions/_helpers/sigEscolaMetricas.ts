import "server-only";
import { bffGet } from "@/lib/bff.server";
import type { MetricTrend } from "@/types/metric";
import type {
  ActiveAccessUsersResponse,
  SigEscolaMetricasResponse,
} from "@/types/metricas";

type HojeSobreAMedia = { valor: number; variacao_percentual_30_dias: number };

// Contrato do BFF. Com o cache frio vem o mesmo formato com atualizado_em e
// os blocos null; obterMetricas barra esse caso, então quem recebe o
// contrato sempre tem os blocos preenchidos.
type Contrato = {
  atualizado_em: string | null;
  filtros: { periodo: string | null };
  opcoes: {
    periodos: string[];
    unidades: { codigo_eol: string; nome: string }[];
  };
  usuarios: {
    com_acesso_ativo: { valor: number; variacao_30_dias: number } | null;
    unicos_por_dia: HojeSobreAMedia;
    acessos_hoje: HojeSobreAMedia;
  };
  plano_anual_de_atividades: {
    em_andamento: number;
    finalizados: number;
    em_retificacao: number;
  };
  prestacao_de_contas: {
    ues_aptas: number;
    enviadas_ou_em_andamento: number;
    creditos_disponiveis: number;
    despesas_registradas: number;
    demonstrativos_gerados: number;
    devolucao_ao_tesouro: number;
  };
  situacao_patrimonial: {
    quantidade_bens_produzidos: number;
    valor_bens_produzidos: number;
  };
};

const CAMINHO_METRICAS = "/api/v1/sigescola/metricas/";
const FILTROS = ["periodo", "data_inicio", "data_fim", "dre", "ue"] as const;

/** Repassa ao BFF só os filtros conhecidos e preenchidos. */
export function filtrosDoBff(searchParams: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const nome of FILTROS) {
    const valor = searchParams.get(nome);
    if (valor) params.set(nome, valor);
  }
  return params;
}

/**
 * Busca o contrato no BFF. Com o cache frio, o BFF devolve o fallback
 * (atualizado_em null) e calcula em background: aqui isso vira erro, a rota
 * responde 500 e o retry do TanStack Query pergunta de novo, como no SERAp.
 * O fallback não pode virar zero "real" no card.
 */
async function obterMetricas(params: URLSearchParams): Promise<Contrato> {
  const query = params.toString();
  const contrato = await bffGet<Contrato>(
    query ? `${CAMINHO_METRICAS}?${query}` : CAMINHO_METRICAS,
  );
  if (contrato.atualizado_em === null) {
    throw new Error("Métricas do SIG-Escola ainda indisponíveis");
  }
  return contrato;
}

/** "Usuários com acesso ativo": total e cadastrados nos últimos 30 dias. */
function acessoAtivo(
  comAcessoAtivo: Contrato["usuarios"]["com_acesso_ativo"],
): ActiveAccessUsersResponse {
  // O BFF aceita null no bloco; não pode virar zero "real" no card.
  if (!comAcessoAtivo) {
    throw new Error("Usuários com acesso ativo do SIG-Escola ainda indisponíveis");
  }
  const { valor, variacao_30_dias: novos } = comAcessoAtivo;
  return {
    activeCount: valor,
    trend: novos > 0 ? "above" : "on-average",
    trendLabel: `${novos} novos nos últimos 30 dias`,
  };
}

/** Texto do Figma: hoje contra a média diária dos 30 dias anteriores. */
function sobreAMedia(percentual: number): {
  trend: MetricTrend;
  trendLabel: string;
} {
  const pontos = Math.round(Math.abs(percentual));
  if (pontos === 0) {
    return { trend: "on-average", trendLabel: "Na média dos últimos 30 dias" };
  }
  const acima = percentual > 0;
  return {
    trend: acima ? "above" : "below",
    trendLabel: `${pontos}% ${acima ? "acima" : "abaixo"} da média dos últimos 30 dias`,
  };
}

/** Os KPIs e os três cards do SIG-Escola, e as opções reais dos filtros. */
export async function fetchMetricasSigEscola(
  searchParams: URLSearchParams,
): Promise<SigEscolaMetricasResponse> {
  const contrato = await obterMetricas(filtrosDoBff(searchParams));
  const { unicos_por_dia: unicos, acessos_hoje: acessos } = contrato.usuarios;
  const paa = contrato.plano_anual_de_atividades;
  const pc = contrato.prestacao_de_contas;
  const bens = contrato.situacao_patrimonial;
  return {
    opcoes: {
      periodo: contrato.filtros.periodo,
      periodos: contrato.opcoes.periodos,
      unidades: contrato.opcoes.unidades.map((ue) => ({
        value: ue.codigo_eol,
        label: ue.nome,
      })),
    },
    acessoAtivo: acessoAtivo(contrato.usuarios.com_acesso_ativo),
    usuariosUnicos: {
      uniqueCount: unicos.valor,
      ...sobreAMedia(unicos.variacao_percentual_30_dias),
    },
    acessosHoje: {
      accessCount: acessos.valor,
      ...sobreAMedia(acessos.variacao_percentual_30_dias),
    },
    planoAnual: {
      items: [
        { label: "PAAs em andamento", value: paa.em_andamento, variant: "neutral" },
        { label: "PAAs finalizados", value: paa.finalizados, variant: "success" },
        { label: "PAAs em retificação", value: paa.em_retificacao, variant: "warning" },
      ],
    },
    prestacaoDeContas: {
      destaque: [
        { label: "UEs aptas a prestar contas pelo sistema", value: pc.ues_aptas, variant: "neutral" },
        { label: "Devolução ao Tesouro", value: pc.devolucao_ao_tesouro, variant: "danger", format: "currency" },
      ],
      items: [
        { label: "PCs enviadas ou em andamento com as DREs", value: pc.enviadas_ou_em_andamento, variant: "neutral" },
        { label: "Créditos disponíveis para as UEs", value: pc.creditos_disponiveis, variant: "success", format: "currency" },
        { label: "Despesas registradas pelas UEs", value: pc.despesas_registradas, variant: "danger", format: "currency" },
        { label: "Demonstrativos financeiros gerados pelas UEs", value: pc.demonstrativos_gerados, variant: "neutral" },
      ],
    },
    situacaoPatrimonial: {
      items: [
        { label: "Quantidade de bens produzidos pelas UEs", value: bens.quantidade_bens_produzidos, variant: "neutral" },
        { label: "Valor dos bens produzidos", value: bens.valor_bens_produzidos, variant: "neutral", format: "currency" },
      ],
    },
  };
}

/** Usuários com acesso ativo da aba Operacional (cenário padrão do Beat). */
export async function fetchUsuariosAcessoAtivo(): Promise<ActiveAccessUsersResponse> {
  const { usuarios } = await obterMetricas(new URLSearchParams());
  return acessoAtivo(usuarios.com_acesso_ativo);
}
