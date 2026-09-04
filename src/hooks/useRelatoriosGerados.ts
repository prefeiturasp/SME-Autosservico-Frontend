import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Laudas de Vagas", value: 412, variant: "neutral" },
    { label: "Relatório de Vagas", value: 298, variant: "neutral" },
    { label: "Laudas de Convocação", value: 386, variant: "neutral" },
    { label: "Súmulas de Reconvocados", value: 96, variant: "neutral" },
    { label: "Súmulas de Escolhas", value: 342, variant: "neutral" },
    { label: "Súmulas de Não Escolhas", value: 154, variant: "neutral" },
    { label: "Listagem de Escolhas por DRE", value: 210, variant: "neutral" },
    {
      label: "Resultados de Escolha de Vagas",
      value: 186,
      variant: "neutral",
    },
    { label: "Atas de Escolha", value: 42, variant: "neutral" },
    {
      label: "Listas de Candidatos por Sessão",
      value: 298,
      variant: "neutral",
    },
  ],
};

export function useRelatoriosGerados({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["relatorios-gerados", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
