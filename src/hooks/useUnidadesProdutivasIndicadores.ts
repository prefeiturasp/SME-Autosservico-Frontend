import type { StatsCardResponse } from "@/types/metricas";
import { useQuery } from "@tanstack/react-query";

type Options = {
    systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
    items: [
        {
            label: "UPs cadastradas para o projeto",
            value: 63,
            variant: "neutral",
        },
        {
            label: "UPs em áreas de preservação ambiental e/ou mananciais",
            value: 18,
            variant: "danger",
        },
        { label: "UPs que receberam visita", value: 47, variant: "success" },
    ],
};

export function useUnidadesProdutivasIndicadores({ systemName }: Options) {
    return useQuery<StatsCardResponse>({
        queryKey: ["unidades-produtivas-indicadores", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return MOCK_RESPONSE;
        },
    });
}
