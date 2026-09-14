import { useQuery } from "@tanstack/react-query";
import type { UniqueUsersPerDayResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: UniqueUsersPerDayResponse = {
  uniqueCount: 2531,
  trend: "below",
  trendLabel: "12% abaixo da média diária",
};

export function useUsuariosUnicosSigla({ systemName }: Options) {
  return useQuery<UniqueUsersPerDayResponse>({
    queryKey: ["usuarios-unicos-sigla", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
