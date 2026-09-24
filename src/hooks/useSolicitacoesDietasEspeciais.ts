import { useQuery } from "@tanstack/react-query";
import type { StatItem } from "@/types/metricas";
import {
  DEFAULT_ACCESS_COMPARISON_PERIOD,
  type AccessComparisonPeriod,
} from "@/types/accessComparisonPeriod";
import {
  buildSolicitacaoStatItems,
  type SolicitacaoStatsOptions,
} from "./_helpers/solicitacaoStats";

type Contagens = {
  total: number;
  autorizadas: number;
  aguardando: number;
  negadas: number;
  canceladas: number;
};

type PorPeriodo = Record<AccessComparisonPeriod, Contagens>;

export function useSolicitacoesDietasEspeciais({
  systemName,
  period = DEFAULT_ACCESS_COMPARISON_PERIOD,
}: SolicitacaoStatsOptions) {
  return useQuery<PorPeriodo, Error, StatItem[]>({
    queryKey: ["solicitacoes-dietas-especiais", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/dietas-especiais");
      if (!res.ok) {
        throw new Error("Falha ao buscar as solicitações de dietas especiais");
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
