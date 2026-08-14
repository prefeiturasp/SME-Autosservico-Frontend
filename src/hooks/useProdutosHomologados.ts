import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Total de produtos cadastrados", value: 8398, variant: "neutral" },
    { label: "Produtos homologados", value: 6853, variant: "success" },
    { label: "Solicitações de homologação no mês", value: 7530, variant: "neutral" },
    { label: "Solicitações de homologação no ano", value: 12398, variant: "neutral" },
  ],
};

export function useProdutosHomologados({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["produtos-homologados", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
