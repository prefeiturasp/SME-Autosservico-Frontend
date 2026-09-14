import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_ROWS: TableRow[] = [
  { label: "PROF.ENS.FUND.II E MED.-ARTES", value: 13 },
  { label: "PROF.ENS.FUND.II E MED.-BIOLOGIA", value: 8 },
  { label: "PROF.ENS.FUND.II E MED.-ED.FÍSICA", value: 8 },
  { label: "PROF.ENS.FUND.II E MED.-MATEMATICA", value: 5 },
  { label: "PROF.ENS.FUND.II E MED.-QUIMICA", value: 2 },
  { label: "PROF.ENS.FUND.II E MED.-GEOGRAFIA", value: 2 },
  { label: "PROF.ENS.FUND.II E MED.-HISTÓRIA", value: 1 },
];

export function useConvocacoesPorCargo({ systemName }: Options) {
  return useQuery<TableRow[]>({
    queryKey: ["convocacoes-por-cargo", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ROWS;
    },
  });
}
