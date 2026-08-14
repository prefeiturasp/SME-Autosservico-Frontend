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
  dia: buildItems(12, 8, 2, 1, 1),
  quinzena: buildItems(58, 42, 9, 4, 3),
  mes: buildItems(110, 82, 16, 7, 5),
  trimestre: buildItems(310, 230, 45, 20, 15),
};

export function useSolicitacoesDietasEspeciais({
  systemName,
  period = DEFAULT_ACCESS_COMPARISON_PERIOD,
}: Options) {
  return useQuery<StatItem[]>({
    queryKey: ["solicitacoes-dietas-especiais", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ITEMS_BY_PERIOD[period];
    },
  });
}
