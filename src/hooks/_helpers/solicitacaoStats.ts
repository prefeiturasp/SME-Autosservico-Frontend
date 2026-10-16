import { useQuery } from "@tanstack/react-query";
import type { StatItem } from "@/types/metricas";
import {
  DEFAULT_ACCESS_COMPARISON_PERIOD,
  type AccessComparisonPeriod,
} from "@/types/accessComparisonPeriod";

export type SolicitacaoStatsOptions = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

type Contagens = {
  total: number;
  autorizadas: number;
  aguardando: number;
  negadas: number;
  canceladas: number;
};

type SolicitacoesPorPeriodo = Record<AccessComparisonPeriod, Contagens>;

export function buildSolicitacaoStatItems(
  total: number,
  autorizadas: number,
  aguardando: number,
  negadas: number,
  canceladas: number,
): StatItem[] {
  return [
    { label: "Total", value: total, variant: "neutral" },
    { label: "Autorizadas", value: autorizadas, variant: "success" },
    { label: "Aguardando", value: aguardando, variant: "warning" },
    { label: "Negadas", value: negadas, variant: "danger" },
    { label: "Canceladas", value: canceladas, variant: "muted" },
  ];
}

/**
 * Busca uma solicitação (dietas/alimentações) com os 4 períodos de uma vez e
 * seleciona o período atual no cliente, montando os itens do card.
 */
export function useSolicitacoesPorPeriodo(
  queryKeyPrefix: string,
  endpoint: string,
  mensagemErro: string,
  { systemName, period = DEFAULT_ACCESS_COMPARISON_PERIOD }: SolicitacaoStatsOptions,
) {
  return useQuery<SolicitacoesPorPeriodo, Error, StatItem[]>({
    queryKey: [queryKeyPrefix, systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(mensagemErro);
      }
      return res.json();
    },
    select: (data) => {
      const c = data[period];
      return buildSolicitacaoStatItems(
        c.total,
        c.autorizadas,
        c.aguardando,
        c.negadas,
        c.canceladas,
      );
    },
  });
}
