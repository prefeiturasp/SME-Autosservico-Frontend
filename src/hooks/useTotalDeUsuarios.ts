import type { StatsCardResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

export function useTotalDeUsuarios({ systemName }: Options) {
  return useGipeMetricasQuery(systemName, (data): StatsCardResponse => ({
    items: [
      {
        label: "Usuários cadastrados",
        value: data.usuarios.cadastrados,
        variant: "neutral",
      },
    ],
  }));
}
