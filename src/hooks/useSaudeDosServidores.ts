import { useQuery } from "@tanstack/react-query";
import type { ProducaoStatus } from "@/actions/saude-dos-servidores";

export function useFetchSaudeDosServidoresFilas(projectName: string, host?: string) {
  return useQuery<ProducaoStatus>({
    queryKey: ["get-saude-dos-servidores-filas", projectName, host],
    enabled: !!projectName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const qs = new URLSearchParams({ project: projectName, ...(host ? { host } : {}) });
      const res = await fetch(`/api/saude-dos-servidores/filas?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao buscar status");
      return res.json();
    },
  });
}
