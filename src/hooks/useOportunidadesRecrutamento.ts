import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Oportunidades cadastradas", value: 86, variant: "neutral" },
    { label: "CVs cadastrados", value: 2340, variant: "neutral" },
    { label: "Inscrições realizadas", value: 1912, variant: "warning" },
    { label: "Contratações efetivadas", value: 64, variant: "success" },
  ],
};

export function useOportunidadesRecrutamento({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["oportunidades-recrutamento-status-geral", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
