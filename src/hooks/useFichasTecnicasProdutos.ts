import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Cadastradas pelos fornecedores", value: 78, variant: "neutral" },
    { label: "Aprovadas", value: 62, variant: "success" },
    { label: "Em análise", value: 9, variant: "warning" },
    { label: "Pendentes de correção", value: 7, variant: "danger" },
  ],
};

export function useFichasTecnicasProdutos({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["fichas-tecnicas-produtos", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
