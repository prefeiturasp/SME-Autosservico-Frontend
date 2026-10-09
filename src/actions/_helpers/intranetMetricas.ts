import "server-only";
import { bffGet } from "@/lib/bff.server";
import { ALL_DRES_VALUE, DRE_OPTIONS } from "@/types/dreOption";
import type {
  StatItem,
  StatVariant,
  StatsCardResponse,
  TableRow,
} from "@/types/metricas";

type ItemContagem = {
  label: string;
  value: number;
};

type StatusSorteios = {
  cadastrados: number;
  realizados: number;
  ativos: number;
  encerrados: number;
};

type StatusOrdemInscricao = {
  cadastrados: number;
  ativos: number;
  encerrados: number;
};

type Distribuicoes = {
  por_tipo: ItemContagem[];
  por_ganhador: ItemContagem[];
  por_dre: ItemContagem[];
};

type Oportunidades = {
  cadastradas: number;
  cvs_cadastrados: number;
  inscricoes_realizadas: number;
  contratacoes_efetivadas: number;
};

type MetricasIntranet = {
  atualizado_em: string | null;
  periodo: string;
  mes: string | null;
  sorteios: (Distribuicoes & { status_geral: StatusSorteios }) | null;
  ordem_inscricao:
    | (Distribuicoes & { status_geral: StatusOrdemInscricao })
    | null;
  oportunidades: Oportunidades | null;
};

export type ParametrosIntranet = {
  periodo: string;
  mes: string | null;
};

const CAMINHO_METRICAS = "/api/v1/intranet/metricas/";

const PERIODO_GERAL = "geral";

// Mesmos recortes do AccessComparisonPeriodSwitcher, aceitos pelo BFF.
const PERIODOS_ACEITOS = new Set(["dia", "quinzena", "mes", "trimestre"]);

const FORMATO_MES = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * Lê periodo/mes da query, descartando valores que o BFF recusaria (400):
 * período desconhecido cai em "geral" e mês fora de AAAA-MM é ignorado.
 */
export function resolverParametros(
  searchParams: URLSearchParams,
): ParametrosIntranet {
  const periodo = searchParams.get("periodo") ?? "";
  const mes = searchParams.get("mes") ?? "";
  return {
    periodo: PERIODOS_ACEITOS.has(periodo) ? periodo : PERIODO_GERAL,
    mes: FORMATO_MES.test(mes) ? mes : null,
  };
}

function obterMetricas({
  periodo,
  mes,
}: ParametrosIntranet): Promise<MetricasIntranet> {
  const params = new URLSearchParams({ periodo });
  if (mes) params.set("mes", mes);
  return bffGet<MetricasIntranet>(`${CAMINHO_METRICAS}?${params}`);
}

/** Status gerais não dependem de recorte: sempre o período "geral". */
const obterMetricasGerais = () =>
  obterMetricas({ periodo: PERIODO_GERAL, mes: null });

type ItemStatus<T> = ReadonlyArray<{
  chave: keyof T;
  label: string;
  variant: StatVariant;
}>;

function montarItens<T extends Record<string, number>>(
  bloco: T | null | undefined,
  itens: ItemStatus<T>,
): StatItem[] {
  return itens.map(({ chave, label, variant }) => ({
    label,
    value: bloco?.[chave] ?? 0,
    variant,
  }));
}

const STATUS_SORTEIOS_ITENS: ItemStatus<StatusSorteios> = [
  { chave: "cadastrados", label: "Cadastrados", variant: "neutral" },
  { chave: "realizados", label: "Realizados", variant: "success" },
  { chave: "ativos", label: "Ativos", variant: "warning" },
  { chave: "encerrados", label: "Encerrados", variant: "danger" },
];

// Ordem de Inscrição é por ordem de chegada: não existe "Realizados".
const STATUS_ORDEM_INSCRICAO_ITENS: ItemStatus<StatusOrdemInscricao> = [
  { chave: "cadastrados", label: "Cadastrados", variant: "neutral" },
  { chave: "ativos", label: "Ativos", variant: "warning" },
  { chave: "encerrados", label: "Encerrados", variant: "danger" },
];

const OPORTUNIDADES_ITENS: ItemStatus<Oportunidades> = [
  { chave: "cadastradas", label: "Oportunidades cadastradas", variant: "neutral" },
  { chave: "cvs_cadastrados", label: "CVs cadastrados", variant: "neutral" },
  { chave: "inscricoes_realizadas", label: "Inscrições realizadas", variant: "warning" },
  { chave: "contratacoes_efetivadas", label: "Contratações efetivadas", variant: "success" },
];

const paraLinhas = (itens: ItemContagem[] | undefined): TableRow[] =>
  (itens ?? []).map(({ label, value }) => ({ label, value }));

const DRES = DRE_OPTIONS.filter(({ value }) => value !== ALL_DRES_VALUE);

// O campo dre do Intranet é texto livre ("DRE Freguesia/Brasilândia" vs
// "DRE Freguesia / Brasilândia"): compara sem acento, espaço nem caixa.
const chaveDre = (label: string) =>
  label
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/\s+/g, "")
    .toLowerCase();

/** Mantém as linhas do BFF e acrescenta, com 0, as DREs sem inscrição. */
function completarDres(linhas: TableRow[]): TableRow[] {
  const presentes = new Set(linhas.map(({ label }) => chaveDre(label)));
  const ausentes = DRES.filter(({ label }) => !presentes.has(chaveDre(label)));
  return [...linhas, ...ausentes.map(({ label }) => ({ label, value: 0 }))];
}

/** Sorteios cadastrados/realizados/ativos/encerrados. */
export async function fetchSorteiosStatusGeral(): Promise<StatsCardResponse> {
  const { sorteios } = await obterMetricasGerais();
  return { items: montarItens(sorteios?.status_geral, STATUS_SORTEIOS_ITENS) };
}

/** Inscrições em sorteios por tipo, no período selecionado. */
export async function fetchSorteiosPorTipo(
  parametros: ParametrosIntranet,
): Promise<TableRow[]> {
  const { sorteios } = await obterMetricas(parametros);
  return paraLinhas(sorteios?.por_tipo);
}

/** Inscrições em sorteios por perfil do ganhador, no período selecionado. */
export async function fetchSorteiosPorGanhador(
  parametros: ParametrosIntranet,
): Promise<TableRow[]> {
  const { sorteios } = await obterMetricas(parametros);
  return paraLinhas(sorteios?.por_ganhador);
}

/**
 * Inscrições em sorteios por DRE, no período selecionado. Lista sempre as
 * 13 DREs, mesmo as sem inscrição no período.
 */
export async function fetchSorteiosPorDre(
  parametros: ParametrosIntranet,
): Promise<TableRow[]> {
  const { sorteios } = await obterMetricas(parametros);
  return completarDres(paraLinhas(sorteios?.por_dre));
}

/** Ordens de inscrição cadastradas/ativas/encerradas. */
export async function fetchOrdemInscricaoStatusGeral(): Promise<StatsCardResponse> {
  const { ordem_inscricao } = await obterMetricasGerais();
  return {
    items: montarItens(
      ordem_inscricao?.status_geral,
      STATUS_ORDEM_INSCRICAO_ITENS,
    ),
  };
}

/** Inscrições em ordens de inscrição por tipo, no período selecionado. */
export async function fetchOrdemInscricaoPorTipo(
  parametros: ParametrosIntranet,
): Promise<TableRow[]> {
  const { ordem_inscricao } = await obterMetricas(parametros);
  return paraLinhas(ordem_inscricao?.por_tipo);
}

/** Inscrições em ordens de inscrição por ganhador, no período selecionado. */
export async function fetchOrdemInscricaoPorGanhador(
  parametros: ParametrosIntranet,
): Promise<TableRow[]> {
  const { ordem_inscricao } = await obterMetricas(parametros);
  return paraLinhas(ordem_inscricao?.por_ganhador);
}

/**
 * Inscrições em ordens de inscrição por DRE, no mês selecionado. Lista
 * sempre as 13 DREs, mesmo as sem inscrição no mês.
 */
export async function fetchOrdemInscricaoPorDre(
  parametros: ParametrosIntranet,
): Promise<TableRow[]> {
  const { ordem_inscricao } = await obterMetricas(parametros);
  return completarDres(paraLinhas(ordem_inscricao?.por_dre));
}

/** Oportunidades, CVs, inscrições e contratações (sem recorte de data). */
export async function fetchOportunidades(): Promise<StatsCardResponse> {
  const { oportunidades } = await obterMetricasGerais();
  return { items: montarItens(oportunidades, OPORTUNIDADES_ITENS) };
}
