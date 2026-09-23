import { ALL_DRES_VALUE } from "@/types/dreOption";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { ALL_UES_VALUE } from "@/types/ueOption";

export type SigEscolaScenario = "baseline" | "intervalo" | "intervalo-butanta";

export function resolveSigEscolaScenario(
    filtros: SigEscolaFiltros,
): SigEscolaScenario {
    if (filtros.modo !== "intervalo" || filtros.ue !== ALL_UES_VALUE) {
        return "baseline";
    }
    if (filtros.dre === "butanta") {
        return "intervalo-butanta";
    }
    if (filtros.dre === ALL_DRES_VALUE) {
        return "intervalo";
    }
    return "baseline";
}
