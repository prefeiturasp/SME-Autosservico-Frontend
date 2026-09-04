import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_ROWS: TableRow[] = [
  { label: "PROF.ED.INF.E.ENS.FUND.I", value: 23 },
  { label: "AUXILIAR TÉCNICO DE EDUCAÇÃO", value: 16 },
  { label: "COORDENADOR PEDAGÓGICO", value: 11 },
  { label: "SUPERVISOR ESCOLAR", value: 5 },
  { label: "DIRETOR ESCOLAR", value: 3 },
  { label: "ASSISTENTE DE DIRETOR", value: 2 },
  { label: "AGENTE ESCOLAR", value: 1 },
];

export function useConvocacoesPorConcurso({ systemName }: Options) {
  return useQuery<TableRow[]>({
    queryKey: ["convocacoes-por-concurso", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ROWS;
    },
  });
}
