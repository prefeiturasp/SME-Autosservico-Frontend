import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Vagas importadas", value: 2150, variant: "neutral" },
    { label: "Vagas disponíveis", value: 1884, variant: "success" },
    { label: "Vagas preenchidas", value: 1640, variant: "success" },
    { label: "Vagas remanescentes", value: 220, variant: "warning" },
  ],
};

export function useFluxoDeVagas({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["fluxo-de-vagas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
