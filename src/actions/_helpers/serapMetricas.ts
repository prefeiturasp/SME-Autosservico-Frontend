import "server-only";
import { bffGet } from "@/lib/bff.server";
import type {
  ActiveAccessUsersResponse,
  ProvasResponse,
} from "@/types/metricas";

type ComAcessoAtivo = {
  valor: number | null;
  variacao_30_dias: number | null;
};

type Usuarios = {
  com_acesso_ativo: ComAcessoAtivo | null;
  unicos_por_dia: number | null;
  acessos_por_hora: number | null;
};

type Provas = {
  total: number | null;
  iniciadas_hoje: number | null;
  nao_finalizadas: number | null;
  finalizadas: number | null;
  percentual_finalizadas: number | null;
};

type MetricasSerap = {
  atualizado_em: string | null;
  ano: number;
  bimestre: number;
  usuarios: Usuarios | null;
  provas: Provas | null;
};

const CAMINHO_METRICAS = "/api/v1/serap/metricas/";

async function obterMetricas(
  ano: number,
  bimestre: number,
): Promise<MetricasSerap> {
  const params = new URLSearchParams({
    ano: String(ano),
    bimestre: String(bimestre),
  });
  return bffGet<MetricasSerap>(`${CAMINHO_METRICAS}?${params}`);
}

/** Bloco "Provas": total, iniciadas hoje, não finalizadas e finalizadas. */
export async function fetchProvas(
  ano: number,
  bimestre: number,
): Promise<ProvasResponse> {
  const { provas } = await obterMetricas(ano, bimestre);
  // O BFF devolve null com o cache frio; não pode virar zero "real" no card.
  if (!provas) {
    throw new Error("Métricas de provas do SERAp ainda indisponíveis");
  }
  return {
    items: [
      { label: "Total de provas", value: provas.total ?? 0, variant: "neutral" },
      { label: "Provas iniciadas hoje", value: provas.iniciadas_hoje ?? 0, variant: "muted" },
      { label: "Provas não finalizadas", value: provas.nao_finalizadas ?? 0, variant: "warning" },
      { label: "Provas finalizadas", value: provas.finalizadas ?? 0, variant: "success" },
    ],
    progressPercentage: provas.percentual_finalizadas ?? 0,
  };
}

/** Usuários com acesso ativo do SERAp Estudantes (total + últimos 30 dias). */
export async function fetchUsuariosAcessoAtivo(
  ano: number,
  bimestre: number,
): Promise<ActiveAccessUsersResponse> {
  const { usuarios } = await obterMetricas(ano, bimestre);
  // O BFF devolve null com o cache frio; não pode virar zero "real" no card.
  if (!usuarios?.com_acesso_ativo) {
    throw new Error("Usuários com acesso ativo do SERAp ainda indisponíveis");
  }
  const novos = usuarios.com_acesso_ativo.variacao_30_dias ?? 0;
  return {
    activeCount: usuarios.com_acesso_ativo.valor ?? 0,
    trend: novos > 0 ? "above" : "on-average",
    trendLabel: `${novos} novos nos últimos 30 dias`,
  };
}
