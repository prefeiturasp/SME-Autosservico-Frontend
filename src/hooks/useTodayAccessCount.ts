import { useQuery } from "@tanstack/react-query";
import type { TodayAccessResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: TodayAccessResponse = {
  accessCount: 2453,
  trend: "on-average",
  trendLabel: "Dentro da média diária",
};

export function useTodayAccessCount({ systemName }: Options) {
  return useQuery<TodayAccessResponse>({
    queryKey: ["today-access-count", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
