import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_ROWS: TableRow[] = [
  { label: "Butantã", value: 142 },
  { label: "Capela do Socorro", value: 124 },
  { label: "Freguesia/Brasilândia", value: 110 },
  { label: "Guaianases", value: 96 },
  { label: "Ipiranga", value: 88 },
  { label: "Campo Limpo", value: 76 },
  { label: "Itaquera", value: 64 },
  { label: "Jaçanã/Tremembé", value: 58 },
];

export function useConvocacoesPorDre({ systemName }: Options) {
  return useQuery<TableRow[]>({
    queryKey: ["convocacoes-por-dre", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ROWS;
    },
  });
}
