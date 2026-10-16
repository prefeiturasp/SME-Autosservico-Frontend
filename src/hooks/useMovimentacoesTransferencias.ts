import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Movimentações realizadas", value: 3150, variant: "neutral" },
    { label: "Movimentações pendentes", value: 214, variant: "warning" },
    { label: "Transferências realizadas", value: 892, variant: "neutral" },
  ],
};

export function useMovimentacoesTransferencias({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["movimentacoes-transferencias", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
