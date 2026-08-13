import { useQuery } from "@tanstack/react-query";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: ActiveAccessUsersResponse = {
  activeCount: 8398,
  trend: "above",
  trendLabel: "453 novos nos últimos 30 dias",
};

export function useActiveAccessUsers({ systemName }: Options) {
  return useQuery<ActiveAccessUsersResponse>({
    queryKey: ["active-access-users", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
