import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Cadastrados", value: 432, variant: "neutral" },
    { label: "Realizados", value: 243, variant: "success" },
    { label: "Ativos", value: 54, variant: "warning" },
    { label: "Encerrados", value: 23, variant: "danger" },
  ],
};

export function useOrdemInscricaoStatusGeral({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["ordem-inscricao-status-geral", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
