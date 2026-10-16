import { useQuery } from "@tanstack/react-query";
import type { TodayAccessResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: TodayAccessResponse = {
  accessCount: 1838,
  trend: "on-average",
  trendLabel: "Média dos últimos 30 dias",
};

export function useTotalAcessosHojeSigla({ systemName }: Options) {
  return useQuery<TodayAccessResponse>({
    queryKey: ["total-acessos-hoje-sigla", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
