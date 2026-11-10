import "server-only";
import { bffGet } from "@/lib/bff.server";
import type { BensFisicosMetricasResponse } from "@/types/bensFisicosMetricas";
import type { UniqueUsersPerDayResponse } from "@/types/metricas";

// Contrato do BFF (espelha o serializer do Backend). Com o cache frio vem o
// mesmo formato com atualizado_em e os blocos null; obterMetricas barra esse
// caso, então quem recebe o contrato sempre tem os blocos preenchidos.
type Contrato = {
  atualizado_em: string | null;
  usuarios: {
    com_acesso_ativo: { valor: number };
    unicos_por_dia: { valor: number; variacao_percentual_30_dias: number | null };
  };
  cadastro_de_bens: {
    bens_cadastrados: number;
    aguardando_aprovacao: number;
    por_unidade_administrativa: { sigla: string; nome: string; bens: number }[];
  };
  baixas_fisicas: { aprovadas: number; aguardando_aprovacao: number };
  movimentacoes: {
    realizadas: number;
    pendentes: number;
    transferencias_realizadas: number;
  };
};

const CAMINHO_METRICAS = "/api/v1/bens-fisicos/metricas/";

/**
 * Busca o contrato no BFF. Com o cache frio, o BFF devolve o fallback
 * (atualizado_em null) e calcula em background: aqui isso vira erro, a rota
 * responde 500 e o retry do TanStack Query pergunta de novo.
 */
async function obterMetricas(): Promise<Contrato> {
  const contrato = await bffGet<Contrato>(CAMINHO_METRICAS);
  if (contrato.atualizado_em === null) {
    throw new Error("Métricas do Bens Físicos ainda indisponíveis");
  }
  return contrato;
}

/** Selo dos usuários únicos de hoje sobre a média diária de 30 dias. */
function usuariosUnicos({
  valor,
  variacao_percentual_30_dias: variacao,
}: Contrato["usuarios"]["unicos_por_dia"]): UniqueUsersPerDayResponse {
  const sentido = variacao ?? 0;
  const percentual = Math.round(Math.abs(sentido));
  if (!percentual) {
    return {
      uniqueCount: valor,
      trend: "on-average",
      trendLabel: "Na média dos últimos 30 dias",
    };
  }
  const posicao = sentido > 0 ? "acima" : "abaixo";
  return {
    uniqueCount: valor,
    trend: sentido > 0 ? "above" : "below",
    trendLabel: `${percentual}% ${posicao} da média dos últimos 30 dias`,
  };
}

/** Os cards da aba Métricas do Bens Físicos. */
export async function fetchMetricasBensFisicos(): Promise<BensFisicosMetricasResponse> {
  const { usuarios, cadastro_de_bens: cadastro, baixas_fisicas: baixas, movimentacoes } =
    await obterMetricas();
  return {
    acessoAtivo: {
      activeCount: usuarios.com_acesso_ativo.valor,
      trend: "on-average",
      trendLabel: "Últimos 30 dias",
    },
    usuariosUnicos: usuariosUnicos(usuarios.unicos_por_dia),
    cadastroDeBens: {
      items: [
        {
          label: "Número de bens cadastrados",
          value: cadastro.bens_cadastrados,
          variant: "neutral",
        },
        {
          label: "Bens aguardando aprovação de cadastro",
          value: cadastro.aguardando_aprovacao,
          variant: "warning",
        },
      ],
    },
    bensPorUnidade: cadastro.por_unidade_administrativa.map((unidade) => ({
      label: unidade.sigla,
      value: unidade.bens,
    })),
    baixasFisicas: {
      items: [
        { label: "Aprovadas", value: baixas.aprovadas, variant: "success" },
        {
          label: "Aguardando aprovação",
          value: baixas.aguardando_aprovacao,
          variant: "warning",
        },
      ],
    },
    movimentacoes: {
      items: [
        {
          label: "Movimentações realizadas",
          value: movimentacoes.realizadas,
          variant: "neutral",
        },
        {
          label: "Movimentações pendentes",
          value: movimentacoes.pendentes,
          variant: "warning",
        },
        {
          label: "Transferências realizadas",
          value: movimentacoes.transferencias_realizadas,
          variant: "neutral",
        },
      ],
    },
  };
}
