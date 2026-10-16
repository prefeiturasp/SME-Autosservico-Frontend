import { useQuery } from "@tanstack/react-query";
import type { ProgressStatsResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: ProgressStatsResponse = {
  items: [
    {
      label: "Vivências que incluíram refeição",
      value: 156,
      variant: "neutral",
    },
  ],
  progressPercentage: 84.8,
};

export function useVivenciasComRefeicao({ systemName }: Options) {
  return useQuery<ProgressStatsResponse>({
    queryKey: ["vivencias-com-refeicao", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
