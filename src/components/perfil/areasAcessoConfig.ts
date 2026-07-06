import type { AreaAcesso } from "@/types/areaAcesso";

export const AREAS_POR_COORDENADORIA: Record<string, AreaAcesso[]> = {
    ASCOM: ["Analytics"],
    CODAE: ["Operacional", "Saúde do deploy"],
    COGEP: ["Operacional", "Analytics"],
    COPED: ["Operacional", "Analytics", "Saúde do deploy"],
    COPLAN: ["Operacional"],
    COTIC: ["Operacional", "Analytics"],
    GIPE: ["Operacional", "Analytics", "Saúde do deploy"],
};
