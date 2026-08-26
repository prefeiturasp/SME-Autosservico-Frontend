import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Aguardando envio pelas UEs", value: 4890, variant: "warning" },
    { label: "Enviadas pelas unidades", value: 4456, variant: "success" },
    { label: "Aprovadas pelas DREs", value: 4102, variant: "success" },
    { label: "Aguardando CODAE", value: 356, variant: "warning" },
    { label: "Aprovadas por CODAE", value: 3746, variant: "success" },
  ],
};

export function useMedicoesIniciais({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["medicoes-iniciais", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
