import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useCronogramasEntregas({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["cronogramas-entregas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/cronogramas-entregas");
      if (!res.ok) {
        throw new Error("Falha ao buscar os cronogramas de entregas");
      }
      return res.json();
    },
  });
}
