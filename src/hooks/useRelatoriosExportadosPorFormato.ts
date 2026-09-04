import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
  items: [
    { label: "Excel", value: 1821, variant: "success" },
    { label: "PDF", value: 3860, variant: "danger" },
    { label: "Word", value: 890, variant: "neutral" },
  ],
};

export function useRelatoriosExportadosPorFormato({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["relatorios-exportados-por-formato", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
