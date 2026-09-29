import { useQuery } from "@tanstack/react-query";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

// Sistemas já integrados ao banco; os demais seguem em mock.
const ROTAS_REAIS: Record<string, string> = {
  SigPAE: "/api/sigpae/usuarios/acesso-ativo",
  SGP: "/api/sgp/usuarios/acesso-ativo",
};

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
      const rota = ROTAS_REAIS[systemName];
      if (!rota) {
        return MOCK_RESPONSE;
      }
      const res = await fetch(rota);
      if (!res.ok) {
        throw new Error("Falha ao buscar usuários com acesso ativo");
      }
      return res.json();
    },
  });
}
