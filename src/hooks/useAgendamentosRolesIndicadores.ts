import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Agendamentos totais", value: 268, variant: "neutral" },
    { label: "Agendamentos na última semana", value: 24, variant: "neutral" },
    { label: "Rolês concluídos até o momento", value: 152, variant: "success" },
    { label: "Rolês previstos para a semana", value: 18, variant: "warning" },
  ],
};

export function useAgendamentosRolesIndicadores({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["agendamentos-roles-indicadores", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
