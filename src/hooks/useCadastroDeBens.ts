import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    {
      label: "Número de bens cadastrados",
      value: 18420,
      variant: "neutral",
    },
    {
      label: "Bens aguardando aprovação de cadastro",
      value: 128,
      variant: "warning",
    },
  ],
};

export function useCadastroDeBens({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["cadastro-de-bens", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
