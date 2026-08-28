import type { StatsCardResponse } from "@/types/metricas";
import { useQuery } from "@tanstack/react-query";

type Options = {
    systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
    items: [
        { label: "Aprovadas", value: 540, variant: "success" },
        { label: "Aguardando aprovação", value: 128, variant: "warning" },
    ],
};

export function useBaixasFisicas({ systemName }: Options) {
    return useQuery<StatsCardResponse>({
        queryKey: ["baixas-fisicas", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return MOCK_RESPONSE;
        },
    });
}
