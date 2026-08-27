import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_ROWS: TableRow[] = [
  { label: "Capela do Socorro", value: 15 },
  { label: "Freguesia/Brasilândia", value: 11 },
  { label: "Ipiranga", value: 12 },
  { label: "Butantã", value: 9 },
  { label: "Guaianases", value: 8 },
  { label: "Campo Limpo", value: 7 },
  { label: "Itaquera", value: 7 },
  { label: "Jaçanã/Tremembé", value: 6 },
  { label: "Penha", value: 6 },
  { label: "Pirituba/Jaraguá", value: 5 },
  { label: "Santo Amaro", value: 5 },
  { label: "São Miguel", value: 4 },
  { label: "São Mateus", value: 4 },
];

export function useUesParticipantesPorDre({ systemName }: Options) {
  return useQuery<TableRow[]>({
    queryKey: ["ues-participantes-por-dre", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ROWS;
    },
  });
}
