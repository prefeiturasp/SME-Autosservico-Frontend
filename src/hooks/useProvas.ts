import { useQuery } from "@tanstack/react-query";
import type { ProvasResponse } from "@/types/metricas";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";

type Options = {
  systemName: string;
  bimestre?: string;
};

const MOCK_RESPONSE_BY_BIMESTRE: Record<string, ProvasResponse> = {
  "2025-3": {
    items: [
      { label: "Total de provas", value: 6920, variant: "neutral" },
      { label: "Provas iniciadas hoje", value: 5410, variant: "muted" },
      { label: "Provas não finalizadas", value: 2340, variant: "warning" },
      { label: "Provas finalizadas", value: 4580, variant: "success" },
    ],
    progressPercentage: 78.5,
  },
  "2025-4": {
    items: [
      { label: "Total de provas", value: 7650, variant: "neutral" },
      { label: "Provas iniciadas hoje", value: 6180, variant: "muted" },
      { label: "Provas não finalizadas", value: 2010, variant: "warning" },
      { label: "Provas finalizadas", value: 5640, variant: "success" },
    ],
    progressPercentage: 84.2,
  },
  "2026-1": {
    items: [
      { label: "Total de provas", value: 7890, variant: "neutral" },
      { label: "Provas iniciadas hoje", value: 6970, variant: "muted" },
      { label: "Provas não finalizadas", value: 2210, variant: "warning" },
      { label: "Provas finalizadas", value: 5680, variant: "success" },
    ],
    progressPercentage: 89.1,
  },
  "2026-2": {
    items: [
      { label: "Total de provas", value: 8398, variant: "neutral" },
      { label: "Provas iniciadas hoje", value: 7530, variant: "muted" },
      { label: "Provas não finalizadas", value: 1853, variant: "warning" },
      { label: "Provas finalizadas", value: 6398, variant: "success" },
    ],
    progressPercentage: 96.3,
  },
};

export function useProvas({ systemName, bimestre = DEFAULT_BIMESTRE }: Options) {
  return useQuery<ProvasResponse>({
    queryKey: ["provas", systemName, bimestre],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE_BY_BIMESTRE[bimestre];
    },
  });
}
