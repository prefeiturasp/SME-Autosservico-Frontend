import type { AreaAcesso } from "./areaAcesso";

export interface CoordenadoriaAcesso {
    sigla: string;
    descricao: string;
    areas: AreaAcesso[];
}
