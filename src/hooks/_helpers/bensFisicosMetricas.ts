import { useQuery } from "@tanstack/react-query";
import { gipeRetryDelay } from "./gipeMetricas";
import type { BensFisicosMetricasResponse } from "@/types/bensFisicosMetricas";

const ROTA = "/api/bens-fisicos/metricas";

const TENTATIVAS = 6;

/**
 * Consulta única das métricas do Bens Físicos. Todos os hooks de card usam
 * a mesma chave, então o TanStack faz uma só requisição e cada hook recorta
 * o seu pedaço com `select`. Com o cache frio no BFF a rota responde 500 e
 * o retry pergunta de novo, com a mesma espera do GIPE.
 */
export function useBensFisicosMetricasQuery<T>(
  systemName: string,
  select: (data: BensFisicosMetricasResponse) => T,
) {
  return useQuery<BensFisicosMetricasResponse, Error, T>({
    queryKey: ["bens-fisicos-metricas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    retry: TENTATIVAS,
    retryDelay: gipeRetryDelay,
    select,
    queryFn: async () => {
      const res = await fetch(ROTA);
      if (!res.ok) {
        throw new Error("Falha ao buscar métricas do Bens Físicos");
      }
      return res.json();
    },
  });
}
