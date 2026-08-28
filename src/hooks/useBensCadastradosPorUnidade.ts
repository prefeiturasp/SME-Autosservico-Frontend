import { useQuery } from "@tanstack/react-query";
import type { TableRow } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_ROWS: TableRow[] = [
  { label: "SME/COTIC", value: 6247 },
  { label: "SME/COPED", value: 4123 },
  { label: "SME/COPLAN", value: 3560 },
  { label: "SME/CODAE", value: 1870 },
  { label: "SME/ASCOM", value: 1328 },
  { label: "SME/COGEP", value: 980 },
  { label: "SME/GIPE", value: 742 },
  { label: "SME/COSERV", value: 510 },
];

export function useBensCadastradosPorUnidade({ systemName }: Options) {
  return useQuery<TableRow[]>({
    queryKey: ["bens-cadastrados-por-unidade", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ROWS;
    },
  });
}
