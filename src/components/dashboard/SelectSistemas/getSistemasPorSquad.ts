import type { JenkinsSubproject } from "@/types/jenkinsSubproject";
import { Sistema } from "./schema"; // Importando o tipo do schema

type SistemaConfig = {
    id: string;
    nome: string;
    frontend?: string;
    backend?: string;
    filas?: string;
    job: string;
    azure: string;
};

function makeSistema({ id, nome, frontend = "", backend = "", filas = "", job, azure }: SistemaConfig): Sistema {
    return {
        id,
        nome,
        zabbixQueryFrontend: frontend,
        zabbixQueryBackend: backend,
        zabbixQueryFilasRabbitMQ: filas,
        zabbixQueryJenkinsJob: job,
        azureDevopsProjectName: azure,
    };
}

const squads: Record<string, Sistema[]> = {
    ASCOM: [
        makeSistema({ id: "5", nome: "Intranet", frontend: "PRD - Intranet", job: "SME-Intranet/master", azure: "ASCOM - Comunicação" }),
        makeSistema({ id: "2", nome: "Portal CEU", frontend: "PRD - Portal CEU", job: "SME-PortalCEU/master", azure: "COCEU" }),
        makeSistema({ id: "1", nome: "Portal Educação", frontend: "PRD - Educacao", job: "SME-PortalEducacao/master", azure: "ASCOM - Comunicação" }),
    ],
    CODAE: [
        makeSistema({ id: "8", nome: "SigPAE", frontend: "PRD - SIGPAE", backend: "PRD - SIGPAE - API", filas: "PRD - Celery Sigpae", job: "SME-SIGPAE/master", azure: "CODAE - Alimentação" }),
        makeSistema({ id: "9", nome: "Rolê Agroecológico", job: "SME-RoleAgroecologico/master", azure: "CODAE - Alimentação" }),
    ],
    COGEP: [
        makeSistema({ id: "6", nome: "Escolhas", frontend: "PRD - Escolhas", job: "SME-Escolhas/master", azure: "COGEP - Recursos Humanos" }),
        makeSistema({ id: "7", nome: "Sigla", job: "SME-SIGLA/master", azure: "COGEP - Recursos Humanos" }),
    ],
    COPED: [
        makeSistema({ id: "10", nome: "SGP", frontend: "PRD - Novo SGP", backend: "PRD - Novo SGP - Swagger", filas: "PRD - RabbitMQ", job: "SME-NovoSGP-Docs/master", azure: "COPED - Pedagógico" }),
        makeSistema({ id: "11", nome: "Serap", frontend: "PRD - Serap", backend: "PRD - Serap - API", filas: "PRD - RabbitMQ", job: "SME-Serap/master", azure: "COPED - Pedagógico" }),
        makeSistema({ id: "12", nome: "Serap Estudantes", frontend: "PRD - Serap Estudantes", backend: "PRD - Serap Estudantes - API", filas: "PRD - RabbitMQ", job: "SME-Serap-Estudantes/master", azure: "COPED - Pedagógico" }),
        makeSistema({ id: "15", nome: "IDEP", frontend: "PRD - Idep", job: "SME-IDEP/master", azure: "COPED - Pedagógico" }),
        makeSistema({ id: "14", nome: "Curriculo da Cidade", frontend: "PRD - Curriculo", backend: "PRD - Curriculo - API", filas: "PRD - RabbitMQ", job: "SME-Curriculo/master", azure: "COPED - Pedagógico" }),
    ],
    COPLAN: [
        makeSistema({ id: "17", nome: "SigEscola", frontend: "PRD - PTRF - SIG Escola", backend: "PRD - PTRF - SIG Escola - API", filas: "PRD - Celery PTRF", job: "SME-SigEscola/master", azure: "COPLAN - PTRF" }),
    ],
    COSERV: [
        makeSistema({ id: "20", nome: "Bens Físicos", frontend: "PRD - Portal Bens Fisicos", job: "SME-BensFisicos-FrontEnd/master", azure: "COSERV" }),
        makeSistema({ id: "21", nome: "Limpeza", frontend: "PRD - Limpeza", job: "SME-LIMPEZA-FRONTEND/master", azure: "COSERV" }),
    ],
    COTIC: [
        makeSistema({ id: "18", nome: "Autosserviço", frontend: "PRD - AUTOSSERVICO", job: "SME-Autosservico-Frontend/master", azure: "COTIC - Auto Serviço" }),
    ],
    EMFORPEF: [
        makeSistema({ id: "13", nome: "CDEP", frontend: "PRD - CDEP", backend: "PRD - CDEP - API", filas: "PRD - RabbitMQ", job: "SME-CDEP/master", azure: "EMFORPEF - Formação" }),
        makeSistema({ id: "16", nome: "Conecta Formação", frontend: "PRD - Conecta Formacao", backend: "PRD - Conecta Formacao - API", filas: "PRD - RabbitMQ", job: "SME-ConectaFormacao/master", azure: "EMFORPEF - Formação" }),
    ],
    GIPE: [
        makeSistema({ id: "19", nome: "GIPE", job: "SME-GIPE/master", azure: "GIPE - Desenvolvimento" }),
    ],
};

function normalizeName(value: string): string {
    return value
        .trim()
        .normalize("NFD")
        .replaceAll(/[̀-ͯ]/g, "")
        .replaceAll(/\s+/g, " ")
        .toUpperCase();
}

// Fonte de verdade para subprojetos de releases por Squad/Projeto.
const JENKINS_SUBPROJECTS_BY_SQUAD_PROJECT: Record<string, Record<string, JenkinsSubproject[]>> = {
    ASCOM: {
        INTRANET: [{ label: "INTRANET", key: "INTRANET/php-fpm-prod" }],
        "PORTAL CEU": [{ label: "CEU", key: "CEU/php-fpm-prod" }],
        "PORTAL EDUCACAO": [{ label: "EDUCACAO", key: "EDUCACAO/php-fpm-prod" }],
    },
    CODAE: {
        "ROLE AGROECOLOGICO": [{ label: "ROLE-AGROECOLOGICO", key: "ROLE-AGROECOLOGICO" }],
        SIGPAE: [
            { label: "Frontend", key: "Sigpae-Frontend-branchs" },
            { label: "Backend", key: "Sigpae-Backend" },
        ],
    },
    COGEP: {
        SIGLA: [{ label: "sme-sigla-frontend", key: "sme-sigla-frontend" }],
    },
    COPED: {
        "CURRICULO DA CIDADE": [
            { label: "SME-plataforma-curriculo-API", key: "SME-plataforma-curriculo-API" },
            { label: "SME-plataforma-curriculo-interface", key: "SME-plataforma-curriculo-interface" },
        ],
        IDEP: [
            { label: "SME-Indice_IDEP-API", key: "SME-Indice_IDEP-API" },
            { label: "SME-Indice_IDEP-Front", key: "SME-Indice_IDEP-Front" },
        ],
        SERAP: [{ label: "SME-Prova-Serap-App", key: "SME-Prova-Serap-App" }],
        "SERAP ESTUDANTES": [
            { label: "SME-PROVA-SERAP-API", key: "SME-PROVA-SERAP-API" },
            { label: "SME-Prova-Serap-App", key: "SME-Prova-Serap-App" },
            { label: "SME-Prova-Serap-App-Web", key: "SME-Prova-Serap-App-Web" },
            { label: "SME-PROVA-SERAP-WORKER", key: "SME-PROVA-SERAP-WORKER" },
            { label: "SME-Proximo-API", key: "SME-Proximo-API" },
            { label: "SME-Simulador-Prova-Serap-Api", key: "SME-Simulador-Prova-Serap-Api" },
            { label: "SME-Simulador-Prova-Serap-App", key: "SME-Simulador-Prova-Serap-App" },
        ],
        SGP: [{ label: "SME-NovoSGP", key: "SME-NovoSGP" }],
    },
    COPLAN: {
        SIGESCOLA: [
            { label: "PTRF-BackEnd", key: "PTRF-BackEnd" },
            { label: "PTRF-FrontEnd", key: "PTRF-FrontEnd" },
        ],
    },
    COSERV: {
        "BENS FISICOS": [
            { label: "SME-BensFisicos-BackEnd", key: "SME-BensFisicos-BackEnd" },
            { label: "SME-BensFisicos-FrontEnd", key: "SME-BensFisicos-FrontEnd" },
        ],
        LIMPEZA: [
            { label: "SME-LIMPEZA-BACKEND", key: "SME-LIMPEZA-BACKEND" },
            { label: "SME-LIMPEZA-FRONTEND", key: "SME-LIMPEZA-FRONTEND" },
        ],
    },
    COTIC: {
        AUTOSSERVICO: [{ label: "SME-Autosservico-Frontend", key: "SME-Autosservico-Frontend" }],
    },
    EMFORPEF: {
        CDEP: [
            { label: "CDEP-BACKEND", key: "CDEP-BACKEND" },
            { label: "CDEP-FRONTEND", key: "CDEP-FRONTEND" },
            { label: "CDEP-WORKER", key: "CDEP-WORKER" },
        ],
        "CONECTA FORMACAO": [
            { label: "CONECTAFORMACAO-BACKEND", key: "CONECTAFORMACAO-BACKEND" },
            { label: "CONECTAFORMACAO-BACKEND-WORKER-PRs", key: "CONECTAFORMACAO-BACKEND-WORKER-PRs" },
            { label: "CONECTAFORMACAO-FRONTEND", key: "CONECTAFORMACAO-FRONTEND" },
            { label: "CONECTAFORMACAO-FRONTEND-PRs", key: "CONECTAFORMACAO-FRONTEND-PRs" },
            { label: "CONECTAFORMACAO-WORKER", key: "CONECTAFORMACAO-WORKER" },
        ],
    },
    GIPE: {
        GIPE: [
            { label: "Gipe-Anexos-Intercorrencias", key: "Gipe-Anexos-Intercorrencias" },
            { label: "Gipe-Anexos-Intercorrencias-PRs", key: "Gipe-Anexos-Intercorrencias-PRs" },
            { label: "GIPE-Backend", key: "GIPE-Backend" },
            { label: "GIPE-Backend-PRs", key: "GIPE-Backend-PRs" },
            { label: "GIPE-Frontend", key: "GIPE-Frontend" },
            { label: "GIPE-Frontend-PRs", key: "GIPE-Frontend-PRs" },
            { label: "Gipe-Intercorrencia", key: "Gipe-Intercorrencia" },
            { label: "Gipe-Intercorrencia-PRs", key: "Gipe-Intercorrencia-PRs" },
        ],
        "GIPE-ANEXOS-INTERCORRENCIAS": [{ label: "Gipe-Anexos-Intercorrencias", key: "Gipe-Anexos-Intercorrencias" }],
        "GIPE-ANEXOS-INTERCORRENCIAS-PRS": [{ label: "Gipe-Anexos-Intercorrencias-PRs", key: "Gipe-Anexos-Intercorrencias-PRs" }],
        "GIPE-BACKEND": [{ label: "GIPE-Backend", key: "GIPE-Backend" }],
        "GIPE-BACKEND-PRS": [{ label: "GIPE-Backend-PRs", key: "GIPE-Backend-PRs" }],
        "GIPE-FRONTEND": [{ label: "GIPE-Frontend", key: "GIPE-Frontend" }],
        "GIPE-FRONTEND-PRS": [{ label: "GIPE-Frontend-PRs", key: "GIPE-Frontend-PRs" }],
        "GIPE-INTERCORRENCIA": [{ label: "Gipe-Intercorrencia", key: "Gipe-Intercorrencia" }],
        "GIPE-INTERCORRENCIA-PRS": [{ label: "Gipe-Intercorrencia-PRs", key: "Gipe-Intercorrencia-PRs" }],
    },
};

// Chave principal usada pelo card "SonarQube - Indicadores de qualidade".
// Quando há múltiplos componentes no SonarQube, priorizamos o frontend/interface principal.
const SONAR_PROJECT_KEY_BY_SQUAD_PROJECT: Record<string, Record<string, string>> = {
    ASCOM: {
        INTRANET: "SME-INTRANET",
        "PORTAL CEU": "SME-CEU",
        "PORTAL EDUCACAO": "SME-EDUCACAO",
    },
    CODAE: {
        "ROLE AGROECOLOGICO": "SME-ROLE-AGROECOLOGICO",
        SIGPAE: "SME-SIGPAE-FrontEnd",
    },
    COGEP: {
        SIGLA: "SME-SIGLA-Frontend",
    },
    COPED: {
        "CURRICULO DA CIDADE": "SME-plataforma-curriculo-interface",
        IDEP: "SME-Indice_IDEP-Front",
        SERAP: "SME-Serap-main",
        "SERAP ESTUDANTES": "SME-prova-serap-front",
        SGP: "SME-NovoSGP-WebClient",
    },
    COPLAN: {
        SIGESCOLA: "SME-PTRF-FrontEnd",
    },
    COSERV: {
        "BENS FISICOS": "SME-BensFisicos-FrontEnd",
        LIMPEZA: "SME-LIMPEZA-FRONTEND",
    },
    COTIC: {
        AUTOSSERVICO: "SME-Autosservico-Frontend",
    },
    EMFORPEF: {
        CDEP: "SME-CDEP-FRONTEND",
        "CONECTA FORMACAO": "SME-CONECTAFORMACAO-FRONTEND",
    },
    GIPE: {
        GIPE: "SME-GIPE-FRONTEND",
    },
};

function getJenkinsSubprojectsForProject(squadName: string, projectName: string): JenkinsSubproject[] {
    const squadKey = normalizeName(squadName);
    const projectKey = normalizeName(projectName);
    return [...(JENKINS_SUBPROJECTS_BY_SQUAD_PROJECT[squadKey]?.[projectKey] ?? [])];
}

function getSonarProjectKeyForProject(squadName: string, projectName: string): string | undefined {
    const squadKey = normalizeName(squadName);
    const projectKey = normalizeName(projectName);
    return SONAR_PROJECT_KEY_BY_SQUAD_PROJECT[squadKey]?.[projectKey];
}

export function getSistemasPorSquad(squadName: string): Sistema[] {
    const sistemas = squads[squadName] ?? [];
    return sistemas.map((sistema) => ({
        ...sistema,
        jenkinsSubprojects: getJenkinsSubprojectsForProject(squadName, sistema.nome),
        sonarProjectKey: getSonarProjectKeyForProject(squadName, sistema.nome),
    }));
}
