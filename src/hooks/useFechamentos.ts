import type { StatsCardResponse } from "@/types/metricas";
import { useLimpezaMetricasQuery } from "./_helpers/limpezaMetricas";

type Options = {
    systemName: string;
};

export function useFechamentos({ systemName }: Options) {
    return useLimpezaMetricasQuery(systemName, (data): StatsCardResponse => {
        const {
            total,
            automaticoAtendido,
            automaticoNaoAtendido,
            fiscalAtendido,
            fiscalNaoAtendido,
        } = data.fechamentos;
        return {
            items: [
                { label: "Total", value: total, variant: "neutral" },
                {
                    label: "Automático atendido",
                    value: automaticoAtendido,
                    variant: "success",
                },
                {
                    label: "Automático não atendido",
                    value: automaticoNaoAtendido,
                    variant: "danger",
                },
                {
                    label: "Fiscal atendido",
                    value: fiscalAtendido,
                    variant: "success",
                },
                {
                    label: "Fiscal não atendido",
                    value: fiscalNaoAtendido,
                    variant: "danger",
                },
            ],
        };
    });
}
