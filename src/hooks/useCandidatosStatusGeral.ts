import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Candidatos habilitados", value: 3240, variant: "neutral" },
    { label: "Candidatos convocados", value: 1980, variant: "neutral" },
    { label: "Candidatos reconvocados", value: 342, variant: "neutral" },
    {
      label: "Candidatos que realizaram escolha",
      value: 1640,
      variant: "success",
    },
    {
      label: "Candidatos que não realizaram escolha",
      value: 298,
      variant: "danger",
    },
    { label: "Pendentes de escolha", value: 42, variant: "warning" },
    { label: "Candidatos autorizados", value: 1720, variant: "neutral" },
    {
      label: "Candidatos em lista específica",
      value: 186,
      variant: "normal",
    },
  ],
};

export function useCandidatosStatusGeral({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["candidatos-status-geral", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
