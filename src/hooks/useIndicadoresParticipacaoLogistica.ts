import type { StatsCardResponse } from "@/types/metricas";
import { useQuery } from "@tanstack/react-query";

type Options = {
    systemName: string;
};

const MOCK_RESPONSE: StatsCardResponse = {
    items: [
        { label: "Vivências realizadas", value: 184, variant: "neutral" },
        {
            label: "Estudantes que participaram das vivências",
            value: 4453,
            variant: "success",
        },
        {
            label: "Estudantes inscritos nas vivências",
            value: 5862,
            variant: "normal",
        },
        {
            label: "Participantes que participam das vivências",
            value: 12398,
            variant: "success",
        },
        {
            label: "Educadores que participaram das vivências",
            value: 6853,
            variant: "success",
        },
        { label: "Refeições para estudantes", value: 6853, variant: "neutral" },
        { label: "Kits distribuídos", value: 12398, variant: "neutral" },
    ],
};

export function useIndicadoresParticipacaoLogistica({ systemName }: Options) {
    return useQuery<StatsCardResponse>({
        queryKey: ["indicadores-participacao-logistica", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return MOCK_RESPONSE;
        },
    });
}
