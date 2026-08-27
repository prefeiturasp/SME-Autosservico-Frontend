import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_ROWS: TableRow[] = [
  { label: "Capela do Socorro", value: 42 },
  { label: "Freguesia/Brasilândia", value: 31 },
  { label: "Ipiranga", value: 36 },
  { label: "Butantã", value: 28 },
  { label: "Guaianases", value: 27 },
  { label: "Campo Limpo", value: 24 },
  { label: "Itaquera", value: 22 },
  { label: "Jaçanã/Tremembé", value: 19 },
  { label: "Penha", value: 17 },
  { label: "Pirituba/Jaraguá", value: 15 },
  { label: "Santo Amaro", value: 13 },
  { label: "São Miguel", value: 11 },
  { label: "São Mateus", value: 9 },
];

export function useAgendamentosPorDre({ systemName }: Options) {
  return useQuery<TableRow[]>({
    queryKey: ["agendamentos-por-dre", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ROWS;
    },
  });
}
