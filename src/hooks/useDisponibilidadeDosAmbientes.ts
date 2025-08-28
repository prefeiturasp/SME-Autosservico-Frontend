import { useQuery } from "@tanstack/react-query";
import type { ProducaoStatus } from "@/actions/disponibilidade-dos-ambientes";

export function useFetchDisponibilidadeDosAmbientesProducao(projectName: string, host?: string) {
  return useQuery<ProducaoStatus>({
    queryKey: ["get-disponibilidade-dos-ambientes-producao", projectName, host],
    enabled: !!projectName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const qs = new URLSearchParams({ project: projectName, ...(host ? { host } : {}) });
      const res = await fetch(`/api/disponibilidade-dos-ambientes/producao?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao buscar status");
      return res.json();
    },
  });
}
