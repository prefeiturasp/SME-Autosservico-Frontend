import { useQuery } from "@tanstack/react-query";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useActiveAccessUsers({ systemName }: Options) {
  return useQuery<ActiveAccessUsersResponse>({
    queryKey: ["active-access-users", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/usuarios/acesso-ativo");
      if (!res.ok) {
        throw new Error("Falha ao buscar usuários com acesso ativo");
      }
      return res.json();
    },
  });
}
