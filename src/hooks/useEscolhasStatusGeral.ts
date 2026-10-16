import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Escolhas realizadas", value: 1640, variant: "success" },
    { label: "Escolhas não realizadas", value: 298, variant: "danger" },
    {
      label: "Escolhas alteradas - ação judicial",
      value: 24,
      variant: "warning",
    },
  ],
};

export function useEscolhasStatusGeral({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["escolhas-status-geral", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
