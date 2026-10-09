import { useQuery } from "@tanstack/react-query";

/**
 * Consulta uma métrica do Intranet na rota do BFF correspondente.
 *
 * `params` (periodo/mes do seletor do card) vai na query string e entra na
 * chave de cache, para refazer a busca a cada troca de seletor.
 */
export function useIntranetMetricaQuery<T>(
  queryKeyPrefix: string,
  rota: string,
  systemName: string,
  params: Record<string, string> = {},
) {
  const query = new URLSearchParams(params).toString();
  return useQuery<T>({
    queryKey: [queryKeyPrefix, systemName, ...Object.values(params)],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch(query ? `${rota}?${query}` : rota);
      if (!res.ok) {
        throw new Error(`Falha ao buscar métrica do Intranet (${queryKeyPrefix})`);
      }
      return res.json();
    },
  });
}
