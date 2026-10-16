import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useMedicoesIniciais({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["medicoes-iniciais", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/medicoes-iniciais");
      if (!res.ok) {
        throw new Error("Falha ao buscar as medições iniciais");
      }
      return res.json();
    },
  });
}
