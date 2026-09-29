import "server-only";
import { bffGet } from "@/lib/bff.server";
import type {
  ProgressStatsResponse,
  StatItem,
  StatVariant,
  ActiveAccessUsersResponse,
} from "@/types/metricas";

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

type Fechamento = {
  nao_iniciados: number | null;
  processado_sucesso: number | null;
  processado_pendencias: number | null;
  processado_erro: number | null;
};

type ConselhoClasse = {
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

const CAMINHO_METRICAS = "/api/v1/sgp/metricas/";

const BIMESTRE_POR_MES: Record<number, number> = {
  1: 1, 2: 1, 3: 1, 4: 1,
  5: 2, 6: 2, 7: 2,
  8: 3, 9: 3,
  10: 4, 11: 4, 12: 4,
};

/** Ano letivo e bimestre correntes (espelha o periodo_corrente do BFF). */
export function periodoCorrente(): { anoLetivo: number; bimestre: number } {
  const hoje = new Date();
  return {
    anoLetivo: hoje.getFullYear(),
    bimestre: BIMESTRE_POR_MES[hoje.getMonth() + 1],
  };
}

/** Lê ano_letivo/bimestre da query, caindo no período corrente se ausentes. */
export function resolverPeriodo(searchParams: URLSearchParams): {
  anoLetivo: number;
  bimestre: number;
} {
  const corrente = periodoCorrente();
  return {
    anoLetivo: Number(searchParams.get("ano_letivo")) || corrente.anoLetivo,
    bimestre: Number(searchParams.get("bimestre")) || corrente.bimestre,
  };
}

async function obterMetricas(
  anoLetivo: number,
  bimestre: number,
): Promise<MetricasSgp> {
  const params = new URLSearchParams({
    ano_letivo: String(anoLetivo),
    bimestre: String(bimestre),
  });
  return bffGet<MetricasSgp>(`${CAMINHO_METRICAS}?${params}`);
}

/** Frequências lançadas x esperadas, com o percentual de preenchimento. */
export async function fetchFrequencias(
  anoLetivo: number,
  bimestre: number,
): Promise<ProgressStatsResponse> {
  const { frequencias } = await obterMetricas(anoLetivo, bimestre);
  return {
    items: [
      { label: "Lançadas", value: frequencias?.lancadas ?? 0, variant: "neutral" },
      { label: "Esperadas", value: frequencias?.esperadas ?? 0, variant: "muted" },
    ],
    progressPercentage: frequencias?.percentual ?? 0,
  };
}

/** Sondagens realizadas x esperadas; o percentual é derivado das duas. */
export async function fetchSondagens(
  anoLetivo: number,
  bimestre: number,
): Promise<ProgressStatsResponse> {
  const { sondagens } = await obterMetricas(anoLetivo, bimestre);
  const realizadas = sondagens?.realizadas ?? 0;
  const esperadas = sondagens?.esperadas ?? 0;
  return {
    items: [
      { label: "Sondagens realizadas", value: realizadas, variant: "neutral" },
      { label: "Sondagens esperadas", value: esperadas, variant: "muted" },
    ],
    progressPercentage:
      esperadas > 0 ? Math.round((realizadas / esperadas) * 1000) / 10 : 0,
  };
}

const FECHAMENTO_ITENS: ReadonlyArray<{
  chave: keyof Fechamento;
  label: string;
  variant: StatVariant;
}> = [
  { chave: "nao_iniciados", label: "Não iniciados", variant: "muted" },
  { chave: "processado_sucesso", label: "Processado com sucesso", variant: "success" },
  { chave: "processado_pendencias", label: "Processado com pendências", variant: "warning" },
  { chave: "processado_erro", label: "Processado com erro", variant: "danger" },
];

/** Acompanhamento de fechamento das turmas, por situação. */
export async function fetchAcompanhamentoFechamento(
  anoLetivo: number,
  bimestre: number,
): Promise<StatItem[]> {
  const { fechamento } = await obterMetricas(anoLetivo, bimestre);
  return FECHAMENTO_ITENS.map(({ chave, label, variant }) => ({
    label,
    value: fechamento?.[chave] ?? 0,
    variant,
  }));
}

const CONSELHO_ITENS: ReadonlyArray<{
  chave: keyof ConselhoClasse;
  label: string;
  variant: StatVariant;
}> = [
  { chave: "nao_iniciados", label: "Não iniciados", variant: "muted" },
  { chave: "em_andamento", label: "Em andamento", variant: "neutral" },
  { chave: "processado_sucesso", label: "Processado com sucesso", variant: "success" },
];

/** Conselho de classe das turmas, por situação. */
export async function fetchConselhoDeClasse(
  anoLetivo: number,
  bimestre: number,
): Promise<StatItem[]> {
  const { conselho_classe } = await obterMetricas(anoLetivo, bimestre);
  return CONSELHO_ITENS.map(({ chave, label, variant }) => ({
    label,
    value: conselho_classe?.[chave] ?? 0,
    variant,
  }));
}

/** Usuários com acesso ativo (total + variação nos últimos 30 dias). */
export async function fetchUsuariosAcessoAtivo(
  anoLetivo: number,
  bimestre: number,
): Promise<ActiveAccessUsersResponse> {
  const { usuarios } = await obterMetricas(anoLetivo, bimestre);
  const novos = usuarios?.com_acesso_ativo?.variacao_30_dias ?? 0;
  return {
    activeCount: usuarios?.com_acesso_ativo?.valor ?? 0,
    trend: novos > 0 ? "above" : "on-average",
    trendLabel: `${novos} novos nos últimos 30 dias`,
  };
}
