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

export function useSolicitacaoStats(
  queryKeyPrefix: string,
  mockItemsByPeriod: Record<AccessComparisonPeriod, StatItem[]>,
  { systemName, period = DEFAULT_ACCESS_COMPARISON_PERIOD }: SolicitacaoStatsOptions,
) {
  return useQuery<StatItem[]>({
    queryKey: [queryKeyPrefix, systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockItemsByPeriod[period];
    },
  });
}
