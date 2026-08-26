import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Cadastrados", value: 71, variant: "neutral" },
    { label: "Aprovados", value: 54, variant: "success" },
    { label: "Aguardando CODAE", value: 12, variant: "warning" },
    { label: "Pendentes de correção", value: 5, variant: "danger" },
  ],
};

export function useLayoutsEmbalagens({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["layouts-embalagens", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
