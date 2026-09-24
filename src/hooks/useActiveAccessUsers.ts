import { useQuery } from "@tanstack/react-query";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

// Só o SigPAE está integrado ao banco; os demais sistemas seguem em mock.
const MOCK_RESPONSE: ActiveAccessUsersResponse = {
  activeCount: 8398,
  trend: "above",
  trendLabel: "453 novos nos últimos 30 dias",
};

export function useActiveAccessUsers({ systemName }: Options) {
  return useQuery<ActiveAccessUsersResponse>({
    queryKey: ["active-access-users", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (systemName !== "SigPAE") {
        return MOCK_RESPONSE;
      }
      const res = await fetch("/api/sigpae/usuarios/acesso-ativo");
      if (!res.ok) {
        throw new Error("Falha ao buscar usuários com acesso ativo");
      }
      return res.json();
    },
  });
}
