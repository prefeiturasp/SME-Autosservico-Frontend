import "server-only";
import { bffGet } from "@/lib/bff.server";
import type {
  StatsCardResponse,
  StatVariant,
  ActiveAccessUsersResponse,
  UniqueUsersPerDayResponse,
  TodayAccessResponse,
  UsersByProfileResponse,
} from "@/types/metricas";

type ComAcessoAtivo = {
  total: number | null;
  ativos_30_dias: number | null;
  novos_30_dias: number | null;
};

type ComparativoBalde = {
  label: string;
  value: number;
  isPeak: boolean;
};

type ComparativoPorPeriodo = Record<
  "dia" | "quinzena" | "mes" | "trimestre",
  { buckets: ComparativoBalde[] }
>;

type Usuarios = {
  com_acesso_ativo: ComAcessoAtivo | null;
  unicos_por_dia: number | null;
  acessos_hoje: number | null;
  por_tipo_perfil: {
    codae: number | null;
    dre: number | null;
    ue: number | null;
    empresa: number | null;
  };
  comparativo_acessos: ComparativoPorPeriodo | null;
};

type MedicoesIniciais = {
  aguardando_envio_ue: number | null;
  enviadas_pelas_unidades: number | null;
  aprovadas_pelas_dres: number | null;
  aguardando_codae: number | null;
  aprovadas_codae: number | null;
};

type ProdutosHomologados = {
  total_cadastrados: number | null;
  homologados: number | null;
  solicitacoes_no_mes: number | null;
  solicitacoes_no_ano: number | null;
};

type EmpresasTerceirizadas = {
  cadastradas: number | null;
  ativas: number | null;
};

type SolicitacaoContagens = {
  total: number | null;
  autorizadas: number | null;
  aguardando: number | null;
  negadas: number | null;
  canceladas: number | null;
};

const PERIODOS_SOLICITACAO = [
  "dia",
  "quinzena",
  "mes",
  "trimestre",
] as const;

type PeriodoSolicitacao = (typeof PERIODOS_SOLICITACAO)[number];

type SolicitacoesPorPeriodo = Record<
  PeriodoSolicitacao,
  SolicitacaoContagens | null
>;

export type SolicitacaoContagensCard = {
  total: number;
  autorizadas: number;
  aguardando: number;
  negadas: number;
  canceladas: number;
};

export type SolicitacoesPorPeriodoCard = Record<
  PeriodoSolicitacao,
  SolicitacaoContagensCard
>;

type CronogramasEntregas = {
  aguardando: number | null;
  enviadas: number | null;
  aprovadas: number | null;
};

type FichasTecnicasProdutos = {
  cadastradas: number | null;
  aprovadas: number | null;
  em_analise: number | null;
  pendentes_correcao: number | null;
};

type LayoutsEmbalagens = {
  cadastrados: number | null;
  aprovados: number | null;
  aguardando_codae: number | null;
  pendentes_correcao: number | null;
};

type FornecedoresDistribuidores = {
  cadastradas: number | null;
  ativas: number | null;
};

type Logistica = {
  cronogramas_entregas: CronogramasEntregas | null;
  fichas_tecnicas_produtos: FichasTecnicasProdutos | null;
  fornecedores_distribuidores: FornecedoresDistribuidores | null;
  layouts_embalagens: LayoutsEmbalagens | null;
};

type MetricasSigpae = {
  usuarios: Usuarios;
  alimentacao_terceirizada: {
    medicoes_iniciais: MedicoesIniciais;
    produtos_homologados: ProdutosHomologados | null;
    empresas_terceirizadas: EmpresasTerceirizadas | null;
    solicitacoes_dietas_especiais: SolicitacoesPorPeriodo | null;
    solicitacoes_alimentacoes: SolicitacoesPorPeriodo | null;
  };
  logistica: Logistica;
};

const CAMINHO_METRICAS = "/api/v1/sigpae/metricas/";

async function obterMetricas(): Promise<MetricasSigpae> {
  return bffGet<MetricasSigpae>(CAMINHO_METRICAS);
}

const MEDICOES_ITENS: ReadonlyArray<{
  chave: keyof MedicoesIniciais;
  label: string;
  variant: StatVariant;
}> = [
  { chave: "aguardando_envio_ue", label: "Aguardando envio pelas UEs", variant: "warning" },
  { chave: "enviadas_pelas_unidades", label: "Enviadas pelas unidades", variant: "success" },
  { chave: "aprovadas_pelas_dres", label: "Aprovadas pelas DREs", variant: "success" },
  { chave: "aguardando_codae", label: "Aguardando CODAE", variant: "warning" },
  { chave: "aprovadas_codae", label: "Aprovadas por CODAE", variant: "success" },
];

/** Busca as medições iniciais do SIGPAE no BFF e monta o contrato do card. */
export async function fetchMedicoesIniciais(): Promise<StatsCardResponse> {
  const { alimentacao_terceirizada } = await obterMetricas();
  const medicoes = alimentacao_terceirizada.medicoes_iniciais;
  return {
    items: MEDICOES_ITENS.map(({ chave, label, variant }) => ({
      label,
      value: medicoes[chave] ?? 0,
      variant,
    })),
  };
}

const PRODUTOS_ITENS: ReadonlyArray<{
  chave: keyof ProdutosHomologados;
  label: string;
  variant: StatVariant;
}> = [
  { chave: "total_cadastrados", label: "Total de produtos cadastrados", variant: "neutral" },
  { chave: "homologados", label: "Produtos homologados", variant: "success" },
  { chave: "solicitacoes_no_mes", label: "Solicitações de homologação no mês", variant: "neutral" },
  { chave: "solicitacoes_no_ano", label: "Solicitações de homologação no ano", variant: "neutral" },
];

/** Produtos homologados da alimentação terceirizada. */
export async function fetchProdutosHomologados(): Promise<StatsCardResponse> {
  const { alimentacao_terceirizada } = await obterMetricas();
  const produtos = alimentacao_terceirizada.produtos_homologados;
  return {
    items: PRODUTOS_ITENS.map(({ chave, label, variant }) => ({
      label,
      value: produtos?.[chave] ?? 0,
      variant,
    })),
  };
}

/** Empresas terceirizadas cadastradas e ativas. */
export async function fetchEmpresasTerceirizadas(): Promise<StatsCardResponse> {
  const { alimentacao_terceirizada } = await obterMetricas();
  const empresas = alimentacao_terceirizada.empresas_terceirizadas;
  return {
    items: [
      {
        label: "Total de empresas terceirizadas cadastradas",
        value: empresas?.cadastradas ?? 0,
        variant: "neutral",
      },
      {
        label: "Total de empresas terceirizadas ativas",
        value: empresas?.ativas ?? 0,
        variant: "success",
      },
    ],
  };
}

const CONTAGENS_ZERADAS: SolicitacaoContagensCard = {
  total: 0,
  autorizadas: 0,
  aguardando: 0,
  negadas: 0,
  canceladas: 0,
};

function normalizarContagens(
  contagens: SolicitacaoContagens | null,
): SolicitacaoContagensCard {
  return {
    total: contagens?.total ?? 0,
    autorizadas: contagens?.autorizadas ?? 0,
    aguardando: contagens?.aguardando ?? 0,
    negadas: contagens?.negadas ?? 0,
    canceladas: contagens?.canceladas ?? 0,
  };
}

function reshapeSolicitacoes(
  porPeriodo: SolicitacoesPorPeriodo | null,
): SolicitacoesPorPeriodoCard {
  return PERIODOS_SOLICITACAO.reduce((acc, periodo) => {
    acc[periodo] = porPeriodo
      ? normalizarContagens(porPeriodo[periodo])
      : { ...CONTAGENS_ZERADAS };
    return acc;
  }, {} as SolicitacoesPorPeriodoCard);
}

/** Solicitações de dietas especiais, agregadas nos 4 períodos do seletor. */
export async function fetchSolicitacoesDietasEspeciais(): Promise<SolicitacoesPorPeriodoCard> {
  const { alimentacao_terceirizada } = await obterMetricas();
  return reshapeSolicitacoes(
    alimentacao_terceirizada.solicitacoes_dietas_especiais,
  );
}

/** Solicitações de alimentações, agregadas nos 4 períodos do seletor. */
export async function fetchSolicitacoesAlimentacoes(): Promise<SolicitacoesPorPeriodoCard> {
  const { alimentacao_terceirizada } = await obterMetricas();
  return reshapeSolicitacoes(
    alimentacao_terceirizada.solicitacoes_alimentacoes,
  );
}

const CRONOGRAMAS_ITENS: ReadonlyArray<{
  chave: keyof CronogramasEntregas;
  label: string;
  variant: StatVariant;
}> = [
  { chave: "aguardando", label: "Aguardando", variant: "warning" },
  { chave: "enviadas", label: "Enviadas", variant: "success" },
  { chave: "aprovadas", label: "Aprovadas", variant: "success" },
];

/** Cronogramas de entregas (logística). */
export async function fetchCronogramasEntregas(): Promise<StatsCardResponse> {
  const { logistica } = await obterMetricas();
  const dados = logistica.cronogramas_entregas;
  return {
    items: CRONOGRAMAS_ITENS.map(({ chave, label, variant }) => ({
      label,
      value: dados?.[chave] ?? 0,
      variant,
    })),
  };
}

const FICHAS_ITENS: ReadonlyArray<{
  chave: keyof FichasTecnicasProdutos;
  label: string;
  variant: StatVariant;
}> = [
  {
    chave: "cadastradas",
    label: "Cadastradas pelos fornecedores",
    variant: "neutral",
  },
  { chave: "aprovadas", label: "Aprovadas", variant: "success" },
  { chave: "em_analise", label: "Em análise", variant: "warning" },
  {
    chave: "pendentes_correcao",
    label: "Pendentes de correção",
    variant: "danger",
  },
];

/** Fichas técnicas de produtos (logística). */
export async function fetchFichasTecnicasProdutos(): Promise<StatsCardResponse> {
  const { logistica } = await obterMetricas();
  const dados = logistica.fichas_tecnicas_produtos;
  return {
    items: FICHAS_ITENS.map(({ chave, label, variant }) => ({
      label,
      value: dados?.[chave] ?? 0,
      variant,
    })),
  };
}

const LAYOUTS_ITENS: ReadonlyArray<{
  chave: keyof LayoutsEmbalagens;
  label: string;
  variant: StatVariant;
}> = [
  { chave: "cadastrados", label: "Cadastrados", variant: "neutral" },
  { chave: "aprovados", label: "Aprovados", variant: "success" },
  { chave: "aguardando_codae", label: "Aguardando CODAE", variant: "warning" },
  {
    chave: "pendentes_correcao",
    label: "Pendentes de correção",
    variant: "danger",
  },
];

/** Layouts de embalagens (logística). */
export async function fetchLayoutsEmbalagens(): Promise<StatsCardResponse> {
  const { logistica } = await obterMetricas();
  const dados = logistica.layouts_embalagens;
  return {
    items: LAYOUTS_ITENS.map(({ chave, label, variant }) => ({
      label,
      value: dados?.[chave] ?? 0,
      variant,
    })),
  };
}

/** Fornecedores e distribuidores (logística). */
export async function fetchFornecedoresDistribuidores(): Promise<StatsCardResponse> {
  const { logistica } = await obterMetricas();
  const dados = logistica.fornecedores_distribuidores;
  return {
    items: [
      {
        label: "Total de empresas fornecedoras cadastradas",
        value: dados?.cadastradas ?? 0,
        variant: "neutral",
      },
      {
        label: "Total de empresas fornecedoras ativas",
        value: dados?.ativas ?? 0,
        variant: "success",
      },
    ],
  };
}

const COMPARATIVO_ROTULOS: Record<PeriodoSolicitacao, string> = {
  dia: "Dia",
  quinzena: "Quinzena",
  mes: "Semana",
  trimestre: "Mês",
};

function comparativoZerado(): ComparativoPorPeriodo {
  return PERIODOS_SOLICITACAO.reduce((acc, periodo) => {
    acc[periodo] = {
      buckets: [1, 2, 3].map((n) => ({
        label: `${COMPARATIVO_ROTULOS[periodo]} ${n}`,
        value: 0,
        isPeak: false,
      })),
    };
    return acc;
  }, {} as ComparativoPorPeriodo);
}

/** Comparativo de acessos (séries por período), do auditlog do SIGPAE. */
export async function fetchComparativoAcessos(): Promise<ComparativoPorPeriodo> {
  const { usuarios } = await obterMetricas();
  return usuarios.comparativo_acessos ?? comparativoZerado();
}

/** Usuários com acesso ativo (total + novos nos últimos 30 dias). */
export async function fetchUsuariosAcessoAtivo(): Promise<ActiveAccessUsersResponse> {
  const { usuarios } = await obterMetricas();
  const novos = usuarios.com_acesso_ativo?.novos_30_dias ?? 0;
  return {
    activeCount: usuarios.com_acesso_ativo?.total ?? 0,
    trend: novos > 0 ? "above" : "on-average",
    trendLabel: `${novos} novos nos últimos 30 dias`,
  };
}

/** Usuários únicos por dia (média dos últimos 30 dias). */
export async function fetchUsuariosUnicosPorDia(): Promise<UniqueUsersPerDayResponse> {
  const { usuarios } = await obterMetricas();
  return {
    uniqueCount: usuarios.unicos_por_dia ?? 0,
    trend: "on-average",
    trendLabel: "Média dos últimos 30 dias",
  };
}

/** Total de acessos ao sistema hoje. */
export async function fetchAcessosHoje(): Promise<TodayAccessResponse> {
  const { usuarios } = await obterMetricas();
  return {
    accessCount: usuarios.acessos_hoje ?? 0,
    trend: "on-average",
    trendLabel: "Acessos de hoje",
  };
}

/** Distribuição de usuários por tipo de perfil, em porcentagem. */
export async function fetchUsuariosPorTipoPerfil(): Promise<UsersByProfileResponse> {
  const { usuarios } = await obterMetricas();
  const p = usuarios.por_tipo_perfil;
  const codae = p.codae ?? 0;
  const dre = p.dre ?? 0;
  const ue = p.ue ?? 0;
  const total = codae + dre + ue;
  const pct = (valor: number) =>
    total > 0 ? Math.round((valor / total) * 100) : 0;
  return { codae: pct(codae), dre: pct(dre), ue: pct(ue) };
}
