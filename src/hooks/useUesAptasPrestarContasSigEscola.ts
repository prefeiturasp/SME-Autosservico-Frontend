import { useQuery } from "@tanstack/react-query";
import type { UesAptasPrestarContasResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: UesAptasPrestarContasResponse = {
  count: 1644,
  trend: "above",
  trendLabel: "13 novos nos últimos 30 dias",
};

export function useUesAptasPrestarContasSigEscola({ systemName }: Options) {
  return useQuery<UesAptasPrestarContasResponse>({
    queryKey: ["ues-aptas-prestar-contas-sig-escola", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
