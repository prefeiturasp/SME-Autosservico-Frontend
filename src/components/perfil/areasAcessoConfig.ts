import type { AreaAcesso } from "@/types/areaAcesso";

export const AREAS_POR_COORDENADORIA: Record<string, AreaAcesso[]> = {
    ASCOM: ["Analytics"],
    CODAE: ["Operacional", "Saúde do deploy"],
    COGEP: ["Operacional", "Métricas", "Analytics"],
    COPED: ["Operacional", "Métricas", "Analytics", "Saúde do deploy"],
    COPLAN: ["Operacional"],
    COTIC: ["Operacional", "Métricas", "Analytics"],
    GIPE: ["Operacional", "Métricas", "Analytics", "Saúde do deploy"],
};
