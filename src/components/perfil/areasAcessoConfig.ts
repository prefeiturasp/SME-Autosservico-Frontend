import type { AreaAcesso } from "@/types/areaAcesso";

export const AREAS_POR_COORDENADORIA: Record<string, AreaAcesso[]> = {
    ASCOM: ["Métricas"],
    CODAE: ["Operacional", "Métricas"],
    COGEP: ["Operacional"],
    COPED: ["Operacional", "Métricas"],
    COPLAN: ["Operacional", "Métricas"],
    COSERV: ["Operacional"],
    COTIC: ["Operacional"],
    GIPE: ["Operacional"],
};
