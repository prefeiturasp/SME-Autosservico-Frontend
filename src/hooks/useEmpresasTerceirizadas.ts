import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useEmpresasTerceirizadas({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["empresas-terceirizadas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/empresas-terceirizadas");
      if (!res.ok) {
        throw new Error("Falha ao buscar as empresas terceirizadas");
      }
      return res.json();
    },
  });
}
