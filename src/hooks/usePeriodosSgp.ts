import { periodoPadraoSgp } from "@/lib/sgpPeriodo";
import type { PeriodoSgpOption } from "@/types/sgpMetricas";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Options = {
    systemName: string;
};

const INTERVALO_SEM_OPCOES_MS = 5_000;

export function usePeriodosSgp({ systemName }: Options) {
    return useQuery<PeriodoSgpOption[]>({
        queryKey: ["sgp-periodos", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        refetchInterval: (query) =>
            query.state.data?.length ? false : INTERVALO_SEM_OPCOES_MS,
        queryFn: async () => {
            const res = await fetch("/api/sgp/periodos");
            if (!res.ok) {
                throw new Error("Falha ao buscar os períodos do SGP");
            }
            return res.json();
        },
    });
}

export function usePeriodoSgp(systemName: string) {
    const { data: opcoes = [] } = usePeriodosSgp({ systemName });
    const [selecionado, setSelecionado] = useState<string>();
    return {
        periodo: selecionado ?? periodoPadraoSgp(opcoes),
        setPeriodo: setSelecionado,
        opcoes,
    };
}
