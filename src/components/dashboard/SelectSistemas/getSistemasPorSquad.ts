import { Sistema } from "./schema"; // Importando o tipo do schema

// Hashtable (Record é uma forma de definir chave/valor no TS)
const squads: Record<string, Sistema[]> = {
    ASCOM: [
        { id: "1", nome: "Portal Educação", zabbixQueryFrontend: "PRD - Educacao", zabbixQueryBackend: "" },
        { id: "2", nome: "Portal CEU", zabbixQueryFrontend: "PRD - Portal CEU", zabbixQueryBackend: "" },
        { id: "3", nome: "Plateia", zabbixQueryFrontend: "PRD - Plateia", zabbixQueryBackend: "PRD - Plateia - API" },
        { id: "4", nome: "Plateia App", zabbixQueryFrontend: "", zabbixQueryBackend: "" },
        { id: "5", nome: "Intranet", zabbixQueryFrontend: "PRD - Intranet", zabbixQueryBackend: "" },
    ],
    COGEP: [
        { id: "6", nome: "Escolhas", zabbixQueryFrontend: "PRD - Escolhas", zabbixQueryBackend: "" },
        { id: "7", nome: "Sigla", zabbixQueryFrontend: "", zabbixQueryBackend: "" },
    ],
    CODAE: [
        { id: "8", nome: "SigPAE", zabbixQueryFrontend: "PRD - SIGPAE", zabbixQueryBackend: "PRD - SIGPAE - API" },
        { id: "9", nome: "Rolê Agroecológico", zabbixQueryFrontend: "", zabbixQueryBackend: "" },
    ],
    COPED: [
        { id: "10", nome: "Novo SGP", zabbixQueryFrontend: "PRD - Novo SGP", zabbixQueryBackend: "PRD - Novo SGP - Swagger" },
        { id: "11", nome: "Serap", zabbixQueryFrontend: "PRD - Serap", zabbixQueryBackend: "" },
        { id: "12", nome: "Serap Estudantes", zabbixQueryFrontend: "PRD - Serap Estudantes", zabbixQueryBackend: "PRD - Serap Estudantes - API" },
        { id: "13", nome: "Cdep", zabbixQueryFrontend: "PRD - CDEP", zabbixQueryBackend: "PRD - CDEP - API" },
        { id: "14", nome: "Curriculo da Cidade", zabbixQueryFrontend: "PRD - Curriculo", zabbixQueryBackend: "PRD - Curriculo - API" },
        { id: "15", nome: "IDEP", zabbixQueryFrontend: "PRD - Idep", zabbixQueryBackend: "" },
        { id: "16", nome: "Conecta Formação", zabbixQueryFrontend: "PRD - Conecta Formacao", zabbixQueryBackend: "PRD - Conecta Formacao - API" },
    ],
    COPLAN: [{ id: "17", nome: "SigEscola", zabbixQueryFrontend: "PRD - PTRF - SIG Escola", zabbixQueryBackend: "PRD - PTRF - SIG Escola - API" }],
    COTIC: [{ id: "18", nome: "Autosserviço", zabbixQueryFrontend: "PRD - AUTOSSERVICO", zabbixQueryBackend: "" }],
    GIPE: [{ id: "19", nome: "GIPE", zabbixQueryFrontend: "", zabbixQueryBackend: "" }],
};

export function getSistemasPorSquad(squadName: string): Sistema[] {
    return [...(squads[squadName] ?? [])]; // retorna uma cópia do array
}
