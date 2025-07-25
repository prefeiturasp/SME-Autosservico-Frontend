import { Sistema } from "./schema"; // Importando o tipo do schema

// Hashtable (Record é uma forma de definir chave/valor no TS)
const squads: Record<string, Sistema[]> = {
    ASCOM: [
        { id: "1", nome: "Portal Educação" },
        { id: "2", nome: "Portal CEU" },
        { id: "3", nome: "Plateia" },
        { id: "4", nome: "Plateia App" },
        { id: "5", nome: "Intranet" },
    ],
    COGEP: [
        { id: "6", nome: "Escolhas" },
        { id: "7", nome: "Sigla" },
    ],
    CODAE: [
        { id: "8", nome: "SigPAE" },
        { id: "9", nome: "Rolê Agroecológico" },
    ],
    COPED: [
        { id: "10", nome: "Novo SGP" },
        { id: "11", nome: "Serap" },
        { id: "12", nome: "Serap Estudantes" },
        { id: "13", nome: "Cdep" },
        { id: "14", nome: "Curriculo da Cidade" },
        { id: "15", nome: "IDEP" },
        { id: "16", nome: "Conecta Formação" },
    ],
    COPLAN: [{ id: "17", nome: "SigEscola" }],
    COTIC: [{ id: "18", nome: "Autosserviço" }],
    GIPE: [{ id: "19", nome: "GIPE" }],
};

export function getSistemasPorSquad(squadName: string): Sistema[] {
    return [...(squads[squadName] ?? [])]; // retorna uma cópia do array
}
