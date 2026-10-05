import type { AreaAcesso } from "@/types/areaAcesso";

export const AREAS_POR_COORDENADORIA: Record<string, AreaAcesso[]> = {
    ASCOM: ["Métricas", "Analytics"],
    CODAE: ["Operacional", "Métricas"],
    COGEP: ["Operacional", "Métricas", "Analytics"],
    COPED: ["Operacional", "Métricas", "Analytics"],
    COPLAN: ["Operacional", "Métricas"],
    COSERV: ["Operacional", "Métricas"],
    COTIC: ["Operacional", "Métricas", "Analytics"],
    GIPE: ["Operacional", "Métricas", "Analytics"],
};
