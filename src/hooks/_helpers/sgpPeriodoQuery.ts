import { decodificarPeriodoSgp } from "@/lib/sgpPeriodo";
import { useQuery } from "@tanstack/react-query";

export type SgpPeriodoOptions = {
    systemName: string;
    periodo?: string;
};

export function useSgpPeriodoQuery<T>(
    queryKeyPrefix: string,
    rota: string,
    { systemName, periodo }: SgpPeriodoOptions,
) {
    const filtro = periodo ? decodificarPeriodoSgp(periodo) : undefined;
    return useQuery<T>({
        queryKey: [queryKeyPrefix, systemName, periodo],
        enabled: !!systemName && !!filtro,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const params = new URLSearchParams({
                ano_letivo: String(filtro?.anoLetivo),
                bimestre: String(filtro?.bimestre),
                segmento: String(filtro?.segmento),
            });
            if (filtro?.semestre)
                params.set("semestre", String(filtro.semestre));
            const res = await fetch(`${rota}?${params}`);
            if (!res.ok) {
                throw new Error(
                    `Falha ao buscar métrica do SGP (${queryKeyPrefix})`,
                );
            }
            return res.json();
        },
    });
}
