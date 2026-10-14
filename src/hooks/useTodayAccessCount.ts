import { useQuery } from "@tanstack/react-query";
import type { TodayAccessResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

// Só o SigPAE está integrado ao banco; os demais sistemas seguem em mock.
const MOCK_RESPONSE: TodayAccessResponse = {
  accessCount: 2453,
  trend: "below",
  trendLabel: "12% abaixo da média diária",
};

export function useTodayAccessCount({ systemName }: Options) {
  return useQuery<TodayAccessResponse>({
    queryKey: ["today-access-count", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (systemName !== "SigPAE") {
        return MOCK_RESPONSE;
      }
      const res = await fetch("/api/sigpae/usuarios/acessos-hoje");
      if (!res.ok) {
        throw new Error("Falha ao buscar acessos de hoje");
      }
      return res.json();
    },
  });
}
