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

type ComparativoPorPeriodo = Record<
  AccessComparisonPeriod,
  AccessComparisonResponse
>;

export function useAccessComparison({
  systemName,
  period = DEFAULT_ACCESS_COMPARISON_PERIOD,
}: Options) {
  return useQuery<ComparativoPorPeriodo, Error, AccessComparisonResponse>({
    queryKey: ["access-comparison", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/comparativo-acessos");
      if (!res.ok) {
        throw new Error("Falha ao buscar o comparativo de acessos");
      }
      return res.json();
    },
    select: (data) => data[period],
  });
}
