import { useQuery } from "@tanstack/react-query";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";

export type SgpBimestreOptions = {
  systemName: string;
  bimestre?: string;
};

/**
 * Consulta uma métrica do SGP no BFF por ano letivo + bimestre.
 *
 * O valor do bimestre vem do seletor no formato "ANO-BIMESTRE" (ex.: "2026-2")
 * e é quebrado nos parâmetros de query da rota. A chave de cache inclui
 * systemName + bimestre para refazer a busca a cada troca.
 */
export function useSgpBimestreQuery<T>(
  queryKeyPrefix: string,
  rota: string,
  { systemName, bimestre = DEFAULT_BIMESTRE }: SgpBimestreOptions,
) {
  return useQuery<T>({
    queryKey: [queryKeyPrefix, systemName, bimestre],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [anoLetivo, numeroBimestre] = bimestre.split("-");
      const params = new URLSearchParams({
        ano_letivo: anoLetivo,
        bimestre: numeroBimestre,
      });
      const res = await fetch(`${rota}?${params}`);
      if (!res.ok) {
        throw new Error(`Falha ao buscar métrica do SGP (${queryKeyPrefix})`);
      }
      return res.json();
    },
  });
}
