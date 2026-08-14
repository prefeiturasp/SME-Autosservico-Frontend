import { useQuery } from "@tanstack/react-query";
import type { StatItem } from "@/types/metricas";
import {
  DEFAULT_ACCESS_COMPARISON_PERIOD,
  type AccessComparisonPeriod,
} from "@/types/accessComparisonPeriod";

type Options = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

function buildItems(
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

const MOCK_ITEMS_BY_PERIOD: Record<AccessComparisonPeriod, StatItem[]> = {
  dia: buildItems(18, 14, 2, 1, 1),
  quinzena: buildItems(95, 74, 11, 6, 4),
  mes: buildItems(175, 138, 20, 10, 7),
  trimestre: buildItems(360, 285, 32, 14, 8),
};

export function useSolicitacoesAlimentacoes({
  systemName,
  period = DEFAULT_ACCESS_COMPARISON_PERIOD,
}: Options) {
  return useQuery<StatItem[]>({
    queryKey: ["solicitacoes-alimentacoes", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ITEMS_BY_PERIOD[period];
    },
  });
}
