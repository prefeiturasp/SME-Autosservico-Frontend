import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Total de empresas terceirizadas cadastradas", value: 54, variant: "neutral" },
    { label: "Total de empresas terceirizadas ativas", value: 23, variant: "success" },
  ],
};

export function useEmpresasTerceirizadas({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["empresas-terceirizadas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
