import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Total de relatórios gerados", value: 2123, variant: "neutral" },
    {
      label: "Total de downloads de relatórios",
      value: 6465,
      variant: "neutral",
    },
  ],
};

export function useRelatoriosTotais({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["relatorios-totais", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
