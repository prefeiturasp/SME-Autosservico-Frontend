import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ALL_DRES_VALUE } from "@/types/dreOption";
import type {
  SigEscolaMetricasResponse,
  SigEscolaOpcoes,
} from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { ALL_UES_VALUE } from "@/types/ueOption";

export type SigEscolaQueryOptions = {
  systemName: string;
  filtros: SigEscolaFiltros;
};

const ROTA = "/api/sigescola/metricas";

/**
 * Converte os filtros da tela na query string da rota, só com o que filtra.
 * Período vazio = período corrente (o Backend resolve); "Todas" não vai.
 */
export function sigEscolaQueryString(filtros: SigEscolaFiltros): string {
  const params = new URLSearchParams();
  if (filtros.modo === "intervalo") {
    params.set("data_inicio", filtros.dataInicio);
    params.set("data_fim", filtros.dataFim);
  } else if (filtros.periodo) {
    params.set("periodo", filtros.periodo);
  }
  if (filtros.dre !== ALL_DRES_VALUE) params.set("dre", filtros.dre);
  if (filtros.ue !== ALL_UES_VALUE) params.set("ue", filtros.ue);
  return params.toString();
}

// Com o cache frio a rota responde 500 enquanto o BFF coleta no Backend
// (~11 s). 6 retentativas com 1, 2, 4, 8, 8 e 8 s cobrem ~30 s.
const TENTATIVAS = 6;
export const sigEscolaRetryDelay = (tentativa: number) =>
  Math.min(1000 * 2 ** tentativa, 8000);

/**
 * No modo intervalo, só consulta com as duas datas preenchidas e em ordem
 * (AAAA-MM-DD compara como texto); senão o Backend responderia 400.
 */
const filtrosCompletos = ({ modo, dataInicio, dataFim }: SigEscolaFiltros) =>
  modo !== "intervalo" || (!!dataInicio && !!dataFim && dataInicio <= dataFim);

/**
 * Consulta única das métricas do SIG-Escola. Os três cards e a barra de
 * filtros usam a mesma chave, então o TanStack faz uma só requisição por
 * combinação de filtros e cada hook recorta o seu pedaço com `select`.
 * `keepPreviousData` mantém a combinação anterior na tela enquanto a nova
 * carrega (os cards já mostram o loading por `isFetching`).
 */
export function useSigEscolaMetricas<T>(
  { systemName, filtros }: SigEscolaQueryOptions,
  select: (dados: SigEscolaMetricasResponse) => T,
) {
  const query = sigEscolaQueryString(filtros);
  return useQuery<SigEscolaMetricasResponse, Error, T>({
    queryKey: ["sigescola-metricas", systemName, query],
    enabled: !!systemName && filtrosCompletos(filtros),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: TENTATIVAS,
    retryDelay: sigEscolaRetryDelay,
    select,
    queryFn: async () => {
      const res = await fetch(query ? `${ROTA}?${query}` : ROTA);
      if (!res.ok) {
        throw new Error("Falha ao buscar métricas do SIG-Escola");
      }
      return res.json();
    },
  });
}

const selecionarOpcoes = (dados: SigEscolaMetricasResponse) => dados.opcoes;

/**
 * Opções reais dos filtros: período resolvido, períodos e UEs da DRE.
 * Guarda as últimas carregadas: se a combinação nova falhar, a barra de
 * filtros não esvazia (o `keepPreviousData` só cobre enquanto carrega).
 */
export function useSigEscolaOpcoes(options: SigEscolaQueryOptions) {
  const { data } = useSigEscolaMetricas(options, selecionarOpcoes);
  const ultimas = useRef<SigEscolaOpcoes | undefined>(undefined);
  useEffect(() => {
    if (data) ultimas.current = data;
  }, [data]);
  return { data: data ?? ultimas.current };
}
