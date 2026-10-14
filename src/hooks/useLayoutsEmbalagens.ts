import { useQuery } from "@tanstack/react-query";
import type { StatsCardResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useLayoutsEmbalagens({ systemName }: Options) {
  return useQuery<StatsCardResponse>({
    queryKey: ["layouts-embalagens", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/layouts-embalagens");
      if (!res.ok) {
        throw new Error("Falha ao buscar os layouts de embalagens");
      }
      return res.json();
    },
  });
}
