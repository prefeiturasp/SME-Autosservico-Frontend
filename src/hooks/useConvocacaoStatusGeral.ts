import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Criadas", value: 1284, variant: "neutral" },
    { label: "Em andamento", value: 312, variant: "warning" },
    { label: "Finalizadas", value: 786, variant: "success" },
  ],
};

export function useConvocacaoStatusGeral({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["convocacao-status-geral", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
