import { useQuery } from "@tanstack/react-query";
import type { UniqueUsersPerDayResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: UniqueUsersPerDayResponse = {
  uniqueCount: 3560,
  trend: "above",
  trendLabel: "8% acima da média dos últimos 30 dias",
};

export function useUniqueUsersPerDay({ systemName }: Options) {
  return useQuery<UniqueUsersPerDayResponse>({
    queryKey: ["unique-users-per-day", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
