import { useQuery } from "@tanstack/react-query";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: ActiveAccessUsersResponse = {
  activeCount: 4645,
  trend: "on-average",
  trendLabel: "Média dos últimos 30 dias",
};

export function useAcessoAtivoBensFisicos({ systemName }: Options) {
  return useQuery<ActiveAccessUsersResponse>({
    queryKey: ["acesso-ativo-bens-fisicos", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
