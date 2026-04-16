import { useQuery } from "@tanstack/react-query";
import type { AverageSessionResponse } from "@/types/averageSession";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: AverageSessionResponse = {
  system: "mock",
  currentSeconds: 872,
  averageSeconds: 868,
  trend: "on-average",
};

export function useAverageSession({ systemName }: Options) {
  return useQuery<AverageSessionResponse>({
    queryKey: ["average-session", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ...MOCK_RESPONSE, system: systemName };
    },
  });
}
