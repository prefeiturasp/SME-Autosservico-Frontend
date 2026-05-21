import type { CoordenadoriaAcesso } from "./coordenadoriaAcesso";

export interface PerfilUsuario {
    nomeCompleto: string;
    cargo: string;
    coordenadoria: string;
    cpf: string;
    email: string;
    contaAtiva: boolean;
    ultimoAcesso: string;
    tempoSessao: string;
    coordenadoriasAcesso: CoordenadoriaAcesso[];
}
