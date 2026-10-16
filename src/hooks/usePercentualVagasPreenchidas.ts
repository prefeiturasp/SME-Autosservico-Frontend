import { useQuery } from "@tanstack/react-query";
import type { ProgressStatsResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: ProgressStatsResponse = {
  items: [],
  progressPercentage: 88.2,
};

export function usePercentualVagasPreenchidas({ systemName }: Options) {
  return useQuery<ProgressStatsResponse>({
    queryKey: ["percentual-vagas-preenchidas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
