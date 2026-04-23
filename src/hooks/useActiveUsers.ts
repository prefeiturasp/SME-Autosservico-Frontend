import { useQuery } from "@tanstack/react-query";
import type { ActiveUsersResponse } from "@/types/activeUsers";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: ActiveUsersResponse = {
  system: "mock",
  activeCount: 8398,
  averageCount: 7563,
  differencePercentage: 18,
  trend: "above",
};

export function useActiveUsers({ systemName }: Options) {
  return useQuery<ActiveUsersResponse>({
    queryKey: ["active-users", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ...MOCK_RESPONSE, system: systemName };
    },
  });
}
