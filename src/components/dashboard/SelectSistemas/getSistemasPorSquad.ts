import { Sistema } from "./schema"; // Importando o tipo do schema

// Hashtable (Record é uma forma de definir chave/valor no TS)
const squads: Record<string, Sistema[]> = {
    ASCOM: [
        { id: "1", nome: "Portal Educação", zabbixQueryFrontend: "PRD - Educacao", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
        { id: "2", nome: "Portal CEU", zabbixQueryFrontend: "PRD - Portal CEU", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
        { id: "3", nome: "Plateia", zabbixQueryFrontend: "PRD - Plateia", zabbixQueryBackend: "PRD - Plateia - API", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
        { id: "4", nome: "Plateia App", zabbixQueryFrontend: "", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
        { id: "5", nome: "Intranet", zabbixQueryFrontend: "PRD - Intranet", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
    ],
    COGEP: [
        { id: "6", nome: "Escolhas", zabbixQueryFrontend: "PRD - Escolhas", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
        { id: "7", nome: "Sigla", zabbixQueryFrontend: "", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
    ],
    CODAE: [
        { id: "8", nome: "SigPAE", zabbixQueryFrontend: "PRD - SIGPAE", zabbixQueryBackend: "PRD - SIGPAE - API", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
        { id: "9", nome: "Rolê Agroecológico", zabbixQueryFrontend: "", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
    ],
    COPED: [
        { id: "10", nome: "Novo SGP", zabbixQueryFrontend: "PRD - Novo SGP", zabbixQueryBackend: "PRD - Novo SGP - Swagger", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
        { id: "11", nome: "Serap", zabbixQueryFrontend: "PRD - Serap", zabbixQueryBackend: "PRD - Serap - API", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
        { id: "12", nome: "Serap Estudantes", zabbixQueryFrontend: "PRD - Serap Estudantes", zabbixQueryBackend: "PRD - Serap Estudantes - API", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
        { id: "13", nome: "Cdep", zabbixQueryFrontend: "PRD - CDEP", zabbixQueryBackend: "PRD - CDEP - API", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
        { id: "14", nome: "Curriculo da Cidade", zabbixQueryFrontend: "PRD - Curriculo", zabbixQueryBackend: "PRD - Curriculo - API", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
        { id: "15", nome: "IDEP", zabbixQueryFrontend: "PRD - Idep", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" },
        { id: "16", nome: "Conecta Formação", zabbixQueryFrontend: "PRD - Conecta Formacao", zabbixQueryBackend: "PRD - Conecta Formacao - API", zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ" },
    ],
    COPLAN: [{ id: "17", nome: "SigEscola", zabbixQueryFrontend: "PRD - PTRF - SIG Escola", zabbixQueryBackend: "PRD - PTRF - SIG Escola - API", zabbixQueryFilasRabbitMQ: "" }],
    COTIC: [{ id: "18", nome: "Autosserviço", zabbixQueryFrontend: "PRD - AUTOSSERVICO", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" }],
    GIPE: [{ id: "19", nome: "GIPE", zabbixQueryFrontend: "", zabbixQueryBackend: "", zabbixQueryFilasRabbitMQ: "" }],
};

export function getSistemasPorSquad(squadName: string): Sistema[] {
    return [...(squads[squadName] ?? [])]; // retorna uma cópia do array
}
