import { useQuery } from "@tanstack/react-query";
import type { AccessComparisonResponse } from "@/types/metricas";
import {
  DEFAULT_ACCESS_COMPARISON_PERIOD,
  type AccessComparisonPeriod,
} from "@/types/accessComparisonPeriod";

type Options = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

const MOCK_BUCKETS_BY_PERIOD: Record<AccessComparisonPeriod, AccessComparisonResponse> = {
  dia: {
    buckets: [
      { label: "Dia 1", value: 1820, isPeak: false },
      { label: "Dia 2", value: 2453, isPeak: true },
      { label: "Dia 3", value: 2010, isPeak: false },
    ],
  },
  quinzena: {
    buckets: [
      { label: "Quinzena 1", value: 15230, isPeak: false },
      { label: "Quinzena 2", value: 19870, isPeak: true },
      { label: "Quinzena 3", value: 16940, isPeak: false },
    ],
  },
  mes: {
    buckets: [
      { label: "Semana 1", value: 9020, isPeak: false },
      { label: "Semana 2", value: 12480, isPeak: true },
      { label: "Semana 3", value: 10310, isPeak: false },
    ],
  },
  trimestre: {
    buckets: [
      { label: "Mês 1", value: 42300, isPeak: false },
      { label: "Mês 2", value: 58900, isPeak: true },
      { label: "Mês 3", value: 47650, isPeak: false },
    ],
  },
};

export function useAccessComparison({
  systemName,
  period = DEFAULT_ACCESS_COMPARISON_PERIOD,
}: Options) {
  return useQuery<AccessComparisonResponse>({
    queryKey: ["access-comparison", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_BUCKETS_BY_PERIOD[period];
    },
  });
}
