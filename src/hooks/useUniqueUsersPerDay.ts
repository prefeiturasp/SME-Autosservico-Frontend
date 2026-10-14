import { useQuery } from "@tanstack/react-query";
import type { UniqueUsersPerDayResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

// Só o SigPAE está integrado ao banco; os demais sistemas seguem em mock.
const MOCK_RESPONSE: UniqueUsersPerDayResponse = {
  uniqueCount: 3560,
  trend: "on-average",
  trendLabel: "Média dos últimos 30 dias",
};

export function useUniqueUsersPerDay({ systemName }: Options) {
  return useQuery<UniqueUsersPerDayResponse>({
    queryKey: ["unique-users-per-day", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (systemName !== "SigPAE") {
        return MOCK_RESPONSE;
      }
      const res = await fetch("/api/sigpae/usuarios/unicos-por-dia");
      if (!res.ok) {
        throw new Error("Falha ao buscar usuários únicos por dia");
      }
      return res.json();
    },
  });
}
