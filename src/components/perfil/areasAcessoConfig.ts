import type { AreaAcesso } from "@/types/areaAcesso";

export const AREAS_POR_COORDENADORIA: Record<string, AreaAcesso[]> = {
    ASCOM: ["Métricas", "Analytics"],
    CODAE: ["Operacional", "Métricas", "Saúde do deploy"],
    COGEP: ["Operacional", "Métricas", "Analytics"],
    COPED: ["Operacional", "Métricas", "Analytics", "Saúde do deploy"],
    COPLAN: ["Operacional", "Métricas"],
    COSERV: ["Operacional", "Métricas", "Saúde do deploy"],
    COTIC: ["Operacional", "Métricas", "Analytics"],
    GIPE: ["Operacional", "Métricas", "Analytics", "Saúde do deploy"],
};
