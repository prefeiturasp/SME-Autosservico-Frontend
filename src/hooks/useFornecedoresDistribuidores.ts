import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useFornecedoresDistribuidores({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["fornecedores-distribuidores", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/fornecedores-distribuidores");
      if (!res.ok) {
        throw new Error("Falha ao buscar os fornecedores e distribuidores");
      }
      return res.json();
    },
  });
}
