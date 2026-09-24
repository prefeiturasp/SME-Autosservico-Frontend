import { useQuery } from "@tanstack/react-query";
import type { TodayAccessResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useTodayAccessCount({ systemName }: Options) {
  return useQuery<TodayAccessResponse>({
    queryKey: ["today-access-count", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/usuarios/acessos-hoje");
      if (!res.ok) {
        throw new Error("Falha ao buscar acessos de hoje");
      }
      return res.json();
    },
  });
}
