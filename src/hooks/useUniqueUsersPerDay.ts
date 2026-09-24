import { useQuery } from "@tanstack/react-query";
import type { UniqueUsersPerDayResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useUniqueUsersPerDay({ systemName }: Options) {
  return useQuery<UniqueUsersPerDayResponse>({
    queryKey: ["unique-users-per-day", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/usuarios/unicos-por-dia");
      if (!res.ok) {
        throw new Error("Falha ao buscar usuários únicos por dia");
      }
      return res.json();
    },
  });
}
