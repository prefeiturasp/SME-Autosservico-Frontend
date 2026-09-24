import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useFichasTecnicasProdutos({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["fichas-tecnicas-produtos", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/fichas-tecnicas-produtos");
      if (!res.ok) {
        throw new Error("Falha ao buscar as fichas técnicas de produtos");
      }
      return res.json();
    },
  });
}
