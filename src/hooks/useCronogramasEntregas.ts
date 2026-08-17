import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Aguardando", value: 65, variant: "warning" },
    { label: "Enviadas", value: 58, variant: "success" },
    { label: "Aprovadas", value: 52, variant: "success" },
  ],
};

export function useCronogramasEntregas({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["cronogramas-entregas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
