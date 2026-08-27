import type { TableRow } from "@/types/metricas";
import { useTableStats, type TableStatsOptions } from "./_helpers/tableStats";

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

export function useUesParticipantesPorDre(options: TableStatsOptions) {
  return useTableStats("ues-participantes-por-dre", MOCK_ROWS, options);
}
