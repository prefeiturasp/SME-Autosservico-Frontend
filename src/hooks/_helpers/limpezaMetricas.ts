import { useQuery } from "@tanstack/react-query";
import type { LimpezaMetricasResponse } from "@/types/limpezaMetricas";

// Payload único simulando o formato real de backend (1 endpoint por sistema,
// ver padrão adotado a partir do GIPE): todos os hooks de card do Limpeza usam
// a MESMA queryKey e reformatam o pedaço que precisam via `select`, então
// quando o mock virar fetch real só essa função muda — nenhum card precisa
// ser alterado.
const MOCK_LIMPEZA_METRICAS: LimpezaMetricasResponse = {
    fechamentos: {
        total: 620,
        automaticoAtendido: 410,
        automaticoNaoAtendido: 55,
        fiscalAtendido: 130,
        fiscalNaoAtendido: 25,
    },
    ocorrenciasPorPrestador: [
        { label: "Prestador 1", value: 42 },
        { label: "Prestador 2", value: 32 },
        { label: "Prestador 3", value: 28 },
        { label: "Prestador 4", value: 25 },
        { label: "Prestador 5", value: 19 },
        { label: "Prestador 6", value: 14 },
        { label: "Prestador 7", value: 9 },
    ],
    valoresPagosPorPrestador: [
        { label: "Prestador 1", value: 4350 },
        { label: "Prestador 2", value: 3350 },
        { label: "Prestador 3", value: 3000 },
        { label: "Prestador 4", value: 2890 },
        { label: "Prestador 5", value: 1000 },
        { label: "Prestador 6", value: 820 },
        { label: "Prestador 7", value: 540 },
    ],
    contratos: [
        {
            termoContrato: "8613277/2026",
            prestador: "Prestador 1",
            vigencia: "até 03/2027",
        },
        {
            termoContrato: "0861221/2026",
            prestador: "Prestador 2",
            vigencia: "até 11/2026",
        },
        {
            termoContrato: "1328231/2025",
            prestador: "Prestador 3",
            vigencia: "até 07/2027",
        },
        {
            termoContrato: "3841628/2025",
            prestador: "Prestador 4",
            vigencia: "até 02/2028",
        },
        {
            termoContrato: "0123355/2025",
            prestador: "Prestador 5",
            vigencia: "até 07/2027",
        },
        {
            termoContrato: "7215490/2025",
            prestador: "Prestador 6",
            vigencia: "até 09/2026",
        },
        {
            termoContrato: "4590123/2026",
            prestador: "Prestador 7",
            vigencia: "até 12/2027",
        },
    ],
};

async function fetchLimpezaMetricas(): Promise<LimpezaMetricasResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_LIMPEZA_METRICAS;
}

export function useLimpezaMetricasQuery<T>(
    systemName: string,
    select: (data: LimpezaMetricasResponse) => T,
) {
    return useQuery({
        queryKey: ["limpeza-metricas", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        queryFn: fetchLimpezaMetricas,
        select,
    });
}
