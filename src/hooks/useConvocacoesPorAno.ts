import type { TableRow } from "@/types/metricas";
import { useQuery } from "@tanstack/react-query";

type Options = {
    systemName: string;
};

const MOCK_ROWS: TableRow[] = [
    { label: "2026", value: 542 },
    { label: "2025", value: 654 },
    { label: "2024", value: 483 },
    { label: "2023", value: 452 },
    { label: "2022", value: 348 },
    { label: "2021", value: 298 },
    { label: "2020", value: 198 },
    { label: "2019", value: 98 },
];

export function useConvocacoesPorAno({ systemName }: Options) {
    return useQuery<TableRow[]>({
        queryKey: ["convocacoes-por-ano", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return MOCK_ROWS;
        },
    });
}
