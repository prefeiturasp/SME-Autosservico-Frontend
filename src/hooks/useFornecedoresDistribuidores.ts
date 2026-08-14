import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Total de empresas fornecedoras cadastradas", value: 123, variant: "neutral" },
    { label: "Total de empresas fornecedoras ativas", value: 85, variant: "success" },
  ],
};

export function useFornecedoresDistribuidores({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["fornecedores-distribuidores", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
