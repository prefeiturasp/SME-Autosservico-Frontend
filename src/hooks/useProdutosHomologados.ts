import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useProdutosHomologados({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["produtos-homologados", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/produtos-homologados");
      if (!res.ok) {
        throw new Error("Falha ao buscar os produtos homologados");
      }
      return res.json();
    },
  });
}
