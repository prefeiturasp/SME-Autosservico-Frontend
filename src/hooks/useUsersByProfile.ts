import { useQuery } from "@tanstack/react-query";
import type { UsersByProfileResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

export function useUsersByProfile({ systemName }: Options) {
  return useQuery<UsersByProfileResponse>({
    queryKey: ["users-by-profile", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch("/api/sigpae/usuarios/por-tipo-perfil");
      if (!res.ok) {
        throw new Error("Falha ao buscar usuários por tipo de perfil");
      }
      return res.json();
    },
  });
}
