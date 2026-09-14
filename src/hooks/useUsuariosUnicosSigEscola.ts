import { useQuery } from "@tanstack/react-query";
import type { UniqueUsersPerDayResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: UniqueUsersPerDayResponse = {
  uniqueCount: 1560,
  trend: "above",
  trendLabel: "8% acima da média dos últimos 30 dias",
};

export function useUsuariosUnicosSigEscola({ systemName }: Options) {
  return useQuery<UniqueUsersPerDayResponse>({
    queryKey: ["usuarios-unicos-sig-escola", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
