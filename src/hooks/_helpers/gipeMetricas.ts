import { useQuery } from "@tanstack/react-query";
import { useGipeFiltros } from "@/states/gipe";
import type { GipeMetricasResponse } from "@/types/gipeMetricas";
import type { StatItem } from "@/types/metricas";

const ROTA = "/api/gipe/metricas";

// Com o cache frio a rota responde 500 enquanto o BFF coleta no Backend
// (~10 s por ano). 6 retentativas com 1, 2, 4, 8, 8 e 8 s cobrem ~31 s.
const TENTATIVAS = 6;
export const gipeRetryDelay = (tentativa: number) =>
  Math.min(1000 * 2 ** tentativa, 8000);

/**
 * Consulta única das métricas do GIPE, pelo ano letivo do filtro. Todos os
 * hooks de card usam a mesma chave, então o TanStack faz uma só requisição
 * por ano e cada hook recorta o seu pedaço com `select`. Na troca de ano os
 * cards ficam em carregamento, sem mostrar os números do ano anterior.
 */
export function useGipeMetricasQuery<T>(
  systemName: string,
  select: (data: GipeMetricasResponse) => T,
) {
  const anoLetivo = useGipeFiltros((state) => state.anoLetivo);
  return useQuery<GipeMetricasResponse, Error, T>({
    queryKey: ["gipe-metricas", systemName, anoLetivo],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    retry: TENTATIVAS,
    retryDelay: gipeRetryDelay,
    select,
    queryFn: async () => {
      const res = await fetch(`${ROTA}?ano_letivo=${anoLetivo}`);
      if (!res.ok) {
        throw new Error("Falha ao buscar métricas do GIPE");
      }
      return res.json();
    },
  });
}

type StatItemTalvezNulo = Omit<StatItem, "value"> & { value: number | null };

/**
 * Tira do card os itens sem dado: o Backend manda null quando o GIPE não
 * tem fonte (dentro/fora do prazo) ou base de cálculo (tempo médio sem
 * ocorrência finalizada). Nulo não pode virar zero "real" no card.
 */
export const semValorNulo = (items: StatItemTalvezNulo[]): StatItem[] =>
  items.filter((item): item is StatItem => item.value !== null);
