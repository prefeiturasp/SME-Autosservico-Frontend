import type { JenkinsSubproject } from "@/types/jenkinsSubproject";
import { Sistema } from "./schema"; // Importando o tipo do schema

const squads: Record<string, Sistema[]> = {
    ASCOM: [
        {
            id: "5",
            nome: "Intranet",
            zabbixQueryFrontend: "PRD - Intranet",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-Intranet/master",
            azureDevopsProjectName: "ASCOM - Comunicação",
        },
        {
            id: "2",
            nome: "Portal CEU",
            zabbixQueryFrontend: "PRD - Portal CEU",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-PortalCEU/master",
            azureDevopsProjectName: "COCEU",
        },
        {
            id: "1",
            nome: "Portal Educação",
            zabbixQueryFrontend: "PRD - Educacao",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-PortalEducacao/master",
            azureDevopsProjectName: "ASCOM - Comunicação",
        },
    ],
    CODAE: [
        {
            id: "8",
            nome: "SigPAE",
            zabbixQueryFrontend: "PRD - SIGPAE",
            zabbixQueryBackend: "PRD - SIGPAE - API",
            zabbixQueryFilasRabbitMQ: "PRD - Celery Sigpae",
            zabbixQueryJenkinsJob: "SME-SIGPAE/master",
            azureDevopsProjectName: "CODAE - Alimentação",
        },
        {
            id: "9",
            nome: "Rolê Agroecológico",
            zabbixQueryFrontend: "",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-RoleAgroecologico/master",
            azureDevopsProjectName: "CODAE - Alimentação",
        },
    ],
    COGEP: [
        {
            id: "6",
            nome: "Escolhas",
            zabbixQueryFrontend: "PRD - Escolhas",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-Escolhas/master",
            azureDevopsProjectName: "COGEP - Recursos Humanos",
        },
        {
            id: "7",
            nome: "Sigla",
            zabbixQueryFrontend: "",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-SIGLA/master",
            azureDevopsProjectName: "COGEP - Recursos Humanos",
        },
    ],
    COPED: [
        {
            id: "10",
            nome: "SGP",
            zabbixQueryFrontend: "PRD - Novo SGP",
            zabbixQueryBackend: "PRD - Novo SGP - Swagger",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-NovoSGP-Docs/master",
            azureDevopsProjectName: "COPED - Pedagógico",
        },
        {
            id: "11",
            nome: "Serap",
            zabbixQueryFrontend: "PRD - Serap",
            zabbixQueryBackend: "PRD - Serap - API",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-Serap/master",
            azureDevopsProjectName: "COPED - Pedagógico",
        },
        {
            id: "12",
            nome: "Serap Estudantes",
            zabbixQueryFrontend: "PRD - Serap Estudantes",
            zabbixQueryBackend: "PRD - Serap Estudantes - API",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-Serap-Estudantes/master",
            azureDevopsProjectName: "COPED - Pedagógico",
        },
        {
            id: "15",
            nome: "IDEP",
            zabbixQueryFrontend: "PRD - Idep",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-IDEP/master",
            azureDevopsProjectName: "COPED - Pedagógico",
        },
        {
            id: "14",
            nome: "Curriculo da Cidade",
            zabbixQueryFrontend: "PRD - Curriculo",
            zabbixQueryBackend: "PRD - Curriculo - API",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-Curriculo/master",
            azureDevopsProjectName: "COPED - Pedagógico",
        },
    ],
    COPLAN: [
        {
            id: "17",
            nome: "SigEscola",
            zabbixQueryFrontend: "PRD - PTRF - SIG Escola",
            zabbixQueryBackend: "PRD - PTRF - SIG Escola - API",
            zabbixQueryFilasRabbitMQ: "PRD - Celery PTRF",
            zabbixQueryJenkinsJob: "SME-SigEscola/master",
            azureDevopsProjectName: "COPLAN - PTRF",
        },
    ],
    COTIC: [
        {
            id: "18",
            nome: "Autosserviço",
            zabbixQueryFrontend: "PRD - AUTOSSERVICO",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-Autosservico-Frontend/master",
            azureDevopsProjectName: "COTIC - Auto Serviço",
        },
    ],
    EMFORPEF: [
        {
            id: "13",
            nome: "CDEP",
            zabbixQueryFrontend: "PRD - CDEP",
            zabbixQueryBackend: "PRD - CDEP - API",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-CDEP/master",
            azureDevopsProjectName: "EMFORPEF - Formação",
        },
        {
            id: "16",
            nome: "Conecta Formação",
            zabbixQueryFrontend: "PRD - Conecta Formacao",
            zabbixQueryBackend: "PRD - Conecta Formacao - API",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-ConectaFormacao/master",
            azureDevopsProjectName: "EMFORPEF - Formação",
        },
    ],
    GIPE: [
        {
            id: "19",
            nome: "GIPE",
            zabbixQueryFrontend: "",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "SME-GIPE/master",
            azureDevopsProjectName: "GIPE - Desenvolvimento",
        },
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
const JENKINS_SUBPROJECTS_BY_SQUAD_PROJECT: Record<
    string,
    Record<string, JenkinsSubproject[]>
> = {
    ASCOM: {
        INTRANET: [{ label: "INTRANET", key: "INTRANET/php-fpm-prod" }],
        "PORTAL CEU": [{ label: "CEU", key: "CEU/php-fpm-prod" }],
        "PORTAL EDUCACAO": [
            { label: "EDUCACAO", key: "EDUCACAO/php-fpm-prod" },
        ],
    },
    CODAE: {
        "ROLE AGROECOLOGICO": [
            { label: "ROLE-AGROECOLOGICO", key: "ROLE-AGROECOLOGICO" },
        ],
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
            {
                label: "SME-plataforma-curriculo-API",
                key: "SME-plataforma-curriculo-API",
            },
            {
                label: "SME-plataforma-curriculo-interface",
                key: "SME-plataforma-curriculo-interface",
            },
        ],
        IDEP: [
            { label: "SME-Indice_IDEP-API", key: "SME-Indice_IDEP-API" },
            { label: "SME-Indice_IDEP-Front", key: "SME-Indice_IDEP-Front" },
        ],
        SERAP: [{ label: "SME-Prova-Serap-App", key: "SME-Prova-Serap-App" }],
        "SERAP ESTUDANTES": [
            { label: "SME-PROVA-SERAP-API", key: "SME-PROVA-SERAP-API" },
            { label: "SME-Prova-Serap-App", key: "SME-Prova-Serap-App" },
            {
                label: "SME-Prova-Serap-App-Web",
                key: "SME-Prova-Serap-App-Web",
            },
            { label: "SME-PROVA-SERAP-WORKER", key: "SME-PROVA-SERAP-WORKER" },
            { label: "SME-Proximo-API", key: "SME-Proximo-API" },
            {
                label: "SME-Simulador-Prova-Serap-Api",
                key: "SME-Simulador-Prova-Serap-Api",
            },
            {
                label: "SME-Simulador-Prova-Serap-App",
                key: "SME-Simulador-Prova-Serap-App",
            },
        ],
        SGP: [{ label: "SME-NovoSGP", key: "SME-NovoSGP" }],
    },
    COPLAN: {
        SIGESCOLA: [
            { label: "PTRF-BackEnd", key: "PTRF-BackEnd" },
            { label: "PTRF-FrontEnd", key: "PTRF-FrontEnd" },
        ],
    },
    COTIC: {
        AUTOSSERVICO: [
            {
                label: "SME-Autosservico-Frontend",
                key: "SME-Autosservico-Frontend",
            },
        ],
    },
    EMFORPEF: {
        CDEP: [
            { label: "CDEP-BACKEND", key: "CDEP-BACKEND" },
            { label: "CDEP-FRONTEND", key: "CDEP-FRONTEND" },
            { label: "CDEP-WORKER", key: "CDEP-WORKER" },
        ],
        "CONECTA FORMACAO": [
            {
                label: "CONECTAFORMACAO-BACKEND",
                key: "CONECTAFORMACAO-BACKEND",
            },
            {
                label: "CONECTAFORMACAO-BACKEND-WORKER-PRs",
                key: "CONECTAFORMACAO-BACKEND-WORKER-PRs",
            },
            {
                label: "CONECTAFORMACAO-FRONTEND",
                key: "CONECTAFORMACAO-FRONTEND",
            },
            {
                label: "CONECTAFORMACAO-FRONTEND-PRs",
                key: "CONECTAFORMACAO-FRONTEND-PRs",
            },
            { label: "CONECTAFORMACAO-WORKER", key: "CONECTAFORMACAO-WORKER" },
        ],
    },
    GIPE: {
        GIPE: [
            {
                label: "Gipe-Anexos-Intercorrencias",
                key: "Gipe-Anexos-Intercorrencias",
            },
            {
                label: "Gipe-Anexos-Intercorrencias-PRs",
                key: "Gipe-Anexos-Intercorrencias-PRs",
            },
            { label: "GIPE-Backend", key: "GIPE-Backend" },
            { label: "GIPE-Backend-PRs", key: "GIPE-Backend-PRs" },
            { label: "GIPE-Frontend", key: "GIPE-Frontend" },
            { label: "GIPE-Frontend-PRs", key: "GIPE-Frontend-PRs" },
            { label: "Gipe-Intercorrencia", key: "Gipe-Intercorrencia" },
            {
                label: "Gipe-Intercorrencia-PRs",
                key: "Gipe-Intercorrencia-PRs",
            },
        ],
        "GIPE-ANEXOS-INTERCORRENCIAS": [
            {
                label: "Gipe-Anexos-Intercorrencias",
                key: "Gipe-Anexos-Intercorrencias",
            },
        ],
        "GIPE-ANEXOS-INTERCORRENCIAS-PRS": [
            {
                label: "Gipe-Anexos-Intercorrencias-PRs",
                key: "Gipe-Anexos-Intercorrencias-PRs",
            },
        ],
        "GIPE-BACKEND": [{ label: "GIPE-Backend", key: "GIPE-Backend" }],
        "GIPE-BACKEND-PRS": [
            { label: "GIPE-Backend-PRs", key: "GIPE-Backend-PRs" },
        ],
        "GIPE-FRONTEND": [{ label: "GIPE-Frontend", key: "GIPE-Frontend" }],
        "GIPE-FRONTEND-PRS": [
            { label: "GIPE-Frontend-PRs", key: "GIPE-Frontend-PRs" },
        ],
        "GIPE-INTERCORRENCIA": [
            { label: "Gipe-Intercorrencia", key: "Gipe-Intercorrencia" },
        ],
        "GIPE-INTERCORRENCIA-PRS": [
            {
                label: "Gipe-Intercorrencia-PRs",
                key: "Gipe-Intercorrencia-PRs",
            },
        ],
    },
};

// Chave principal usada pelo card "SonarQube - Indicadores de qualidade".
// Quando há múltiplos componentes no SonarQube, priorizamos o frontend/interface principal.
const SONAR_PROJECT_KEY_BY_SQUAD_PROJECT: Record<
    string,
    Record<string, string>
> = {
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

function getJenkinsSubprojectsForProject(
    squadName: string,
    projectName: string,
): JenkinsSubproject[] {
    const squadKey = normalizeName(squadName);
    const projectKey = normalizeName(projectName);
    return [
        ...(JENKINS_SUBPROJECTS_BY_SQUAD_PROJECT[squadKey]?.[projectKey] ?? []),
    ];
}

function getSonarProjectKeyForProject(
    squadName: string,
    projectName: string,
): string | undefined {
    const squadKey = normalizeName(squadName);
    const projectKey = normalizeName(projectName);
    return SONAR_PROJECT_KEY_BY_SQUAD_PROJECT[squadKey]?.[projectKey];
}

export function getSistemasPorSquad(squadName: string): Sistema[] {
    const sistemas = squads[squadName] ?? [];
    return sistemas.map((sistema) => ({
        ...sistema,
        jenkinsSubprojects: getJenkinsSubprojectsForProject(
            squadName,
            sistema.nome,
        ),
        sonarProjectKey: getSonarProjectKeyForProject(squadName, sistema.nome),
    }));
}
