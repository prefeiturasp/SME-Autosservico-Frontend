import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Cadastrados", value: 612, variant: "neutral" },
    { label: "Realizados", value: 498, variant: "success" },
    { label: "Ativos", value: 77, variant: "warning" },
    { label: "Encerrados", value: 37, variant: "danger" },
  ],
};

export function useSorteiosStatusGeral({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["sorteios-status-geral", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
