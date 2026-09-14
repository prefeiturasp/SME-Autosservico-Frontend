import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";
import { DEFAULT_PERIODO_LETIVO } from "@/types/periodoLetivoOption";

type Options = {
  systemName: string;
  periodo?: string;
};

const MOCK_RESPONSE_BY_PERIODO: Record<string, StatsCardResponse> = {
  "2025.1": {
    items: [
      {
        label: "Prestações de contas enviadas ou em andamento com as DREs",
        value: 1980,
        variant: "neutral",
      },
      {
        label: "Créditos disponíveis para as UEs",
        value: 152340120.5,
        variant: "success",
        format: "currency",
      },
      {
        label: "Despesas registradas pelas as UEs",
        value: 71230456.1,
        variant: "danger",
        format: "currency",
      },
      {
        label: "Demonstrativos financeiros gerados pelas UEs",
        value: 2905,
        variant: "neutral",
      },
    ],
  },
  "2025.2": {
    items: [
      {
        label: "Prestações de contas enviadas ou em andamento com as DREs",
        value: 2210,
        variant: "neutral",
      },
      {
        label: "Créditos disponíveis para as UEs",
        value: 168920340.8,
        variant: "success",
        format: "currency",
      },
      {
        label: "Despesas registradas pelas as UEs",
        value: 79845210.3,
        variant: "danger",
        format: "currency",
      },
      {
        label: "Demonstrativos financeiros gerados pelas UEs",
        value: 3240,
        variant: "neutral",
      },
    ],
  },
  "2026.1": {
    items: [
      {
        label: "Prestações de contas enviadas ou em andamento com as DREs",
        value: 2490,
        variant: "neutral",
      },
      {
        label: "Créditos disponíveis para as UEs",
        value: 197248412.27,
        variant: "success",
        format: "currency",
      },
      {
        label: "Despesas registradas pelas as UEs",
        value: 90490083.76,
        variant: "danger",
        format: "currency",
      },
      {
        label: "Demonstrativos financeiros gerados pelas UEs",
        value: 3683,
        variant: "neutral",
      },
    ],
  },
  "2026.2": {
    items: [
      {
        label: "Prestações de contas enviadas ou em andamento com as DREs",
        value: 2718,
        variant: "neutral",
      },
      {
        label: "Créditos disponíveis para as UEs",
        value: 214870650.9,
        variant: "success",
        format: "currency",
      },
      {
        label: "Despesas registradas pelas as UEs",
        value: 98120340.45,
        variant: "danger",
        format: "currency",
      },
      {
        label: "Demonstrativos financeiros gerados pelas UEs",
        value: 4012,
        variant: "neutral",
      },
    ],
  },
};

export function usePrestacaoDeContas({
  systemName,
  periodo = DEFAULT_PERIODO_LETIVO,
}: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["prestacao-de-contas", systemName, periodo],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE_BY_PERIODO[periodo];
    },
  });
}
