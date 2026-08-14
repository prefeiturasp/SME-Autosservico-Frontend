// src/app/dashboard/page.test.tsx
/* @vitest-environment jsdom */
import { withClient } from "@/__mocks__/renderWithClient";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, test, vi } from "vitest";
import Dashboard from "./page";

// 🔧 Mock do store com estado configurável por teste
type StoreState = {
    activeItem?: null | {
        title?: string;
    };
    activeProject: null | {
        nome?: string;
        zabbixQueryFrontend?: string;
        zabbixQueryBackend?: string;
        zabbixQueryFilasRabbitMQ?: string;
        sonarProjectKey?: string;
        zabbixQueryJenkinsJob?: string;
        jenkinsSubprojects?: unknown[];
    };
    activeTab?: string;
    activePeriod?: string;
    setActiveTab?: (tab: string) => void;
    setActivePeriod?: (period: string) => void;
};
let mockStoreState: StoreState = {
    activeItem: { title: "COPED" },
    activeProject: {
        nome: "Novo SGP",
        zabbixQueryFrontend: "Portal SME",
        zabbixQueryBackend: "API SME",
        zabbixQueryFilasRabbitMQ: "Filas RabbitMQ",
    },
    activeTab: "operacional",
    activePeriod: "hoje",
    setActiveTab: (tab) => {
        mockStoreState = { ...mockStoreState, activeTab: tab };
    },
    setActivePeriod: (period) => {
        mockStoreState = { ...mockStoreState, activePeriod: period };
    },
};

vi.mock("@/states/dashboard", () => ({
    __esModule: true,
    default: (selector: (s: StoreState) => unknown) => selector(mockStoreState),
}));

// 🔧 Mocks simples dos filhos
vi.mock("@/components/dashboard/CardWrapperInfoAmbientes", () => ({
    __esModule: true,
    default: ({
        title,
        children,
    }: {
        title: string;
        children: React.ReactNode;
    }) => <section data-testid={`card-${title}`}>{children}</section>,
}));

vi.mock("@/components/dashboard/DisponibilidadeDosAmbientes/Producao", () => ({
    __esModule: true,
    default: ({
        title,
        projectName,
    }: {
        title?: string;
        projectName: string;
    }) => (
        <div data-testid={`producao-${title ?? "Frontend"}`}>{projectName}</div>
    ),
}));

vi.mock("@/components/dashboard/SaudeDosServidores/Filas", () => ({
    __esModule: true,
    default: ({
        title,
        projectName,
    }: {
        title: string;
        projectName: string;
    }) => <div data-testid={`filas-${title ?? "Filas"}`}>{projectName}</div>,
}));

vi.mock("@/components/dashboard/JenkinsJob", () => ({
    __esModule: true,
    default: ({
        title,
        project,
        subprojects,
    }: {
        title?: string;
        project: string;
        subprojects?: unknown[];
    }) => (
        <div data-testid={`jenkins-${title ?? "Jenkins - Branches e Builds"}`}>
            {project}::{Array.isArray(subprojects) ? subprojects.length : 0}
        </div>
    ),
}));

vi.mock("@/components/dashboard/Releases", () => ({
    __esModule: true,
    default: ({
        title,
        project,
        subprojects,
    }: {
        title?: string;
        project: string;
        subprojects?: unknown[];
    }) => (
        <div data-testid={`releases-${title ?? "Lançamentos"}`}>
            {project}::{Array.isArray(subprojects) ? subprojects.length : 0}
        </div>
    ),
}));

vi.mock("@/components/dashboard/DeployHealth/EnvironmentHeader", () => ({
    __esModule: true,
    default: () => <div data-testid="environment-header">Ambiente</div>,
}));

vi.mock(
    "@/components/dashboard/DeployHealth/SonarQuality/SonarQualityIndicatorsCard",
    () => ({
        __esModule: true,
        default: ({
            projectName,
            className,
        }: {
            projectName: string;
            className?: string;
        }) => (
            <div data-testid="sonar-quality" className={className}>
                {projectName}
            </div>
        ),
    }),
);

vi.mock("@/components/dashboard/ActiveUsersCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="active-users-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/AverageSessionCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="average-session-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/PeakUsageTodayCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="peak-usage-today-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/UsersByPageCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="users-by-page-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/DeviceDistributionCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="device-distribution-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/PeakHoursChart", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="peak-hours-chart">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/DatabaseStatusCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="database-status-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/Metricas/ActiveUsersMetricCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="active-users-metric-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/Metricas/UniqueUsersPerDayCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="unique-users-per-day-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/Metricas/TodayAccessCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="today-access-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/Metricas/UsersByProfileCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="users-by-profile-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/Metricas/AccessComparisonCard", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="access-comparison-card">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/Metricas/AlimentacaoTerceirizadaSection", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="alimentacao-terceirizada-section">{systemName ?? ""}</div>
    ),
}));

vi.mock("@/components/dashboard/Metricas/LogisticaSection", () => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
        <div data-testid="logistica-section">{systemName ?? ""}</div>
    ),
}));

describe("Dashboard page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStoreState = {
            activeItem: { title: "COPED" },
            activeProject: {
                nome: "Novo SGP",
                zabbixQueryFrontend: "Portal SME",
                zabbixQueryBackend: "API SME",
                zabbixQueryFilasRabbitMQ: "Filas RabbitMQ",
            },
            activeTab: "operacional",
            activePeriod: "hoje",
            setActiveTab: (tab) => {
                mockStoreState = { ...mockStoreState, activeTab: tab };
            },
            setActivePeriod: (period) => {
                mockStoreState = { ...mockStoreState, activePeriod: period };
            },
        };
    });

    test("renderiza os cards e passa os nomes de projeto corretos", () => {
        render(withClient(<Dashboard />));

        // Primeiro card (Frontend)
        expect(
            screen.getByTestId("card-Disponibilidade do ambiente"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("producao-Frontend")).toHaveTextContent(
            "Portal SME",
        );

        // Segundo card (Saúde do servidor)
        expect(
            screen.getByTestId("card-Saúde do servidor (Workloads)"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("producao-API Service")).toHaveTextContent(
            "API SME",
        );

        // Filas
        expect(screen.getByTestId("filas-Fila")).toHaveTextContent(
            "Filas RabbitMQ",
        );

        // Banco de dados
        expect(screen.getByTestId("database-status-card")).toHaveTextContent(
            "Novo SGP",
        );
    });

    test("renderiza Jenkins - Branches e Builds na aba Saúde do deploy à esquerda do Sonar", () => {
        mockStoreState = {
            ...mockStoreState,
            activeItem: { title: "COPED" },
            activeProject: {
                nome: "Novo SGP",
                zabbixQueryFrontend: "Portal SME",
                zabbixQueryBackend: "API SME",
                zabbixQueryFilasRabbitMQ: "Filas RabbitMQ",
                jenkinsSubprojects: [
                    { label: "Backend", key: "SME-NovoSGP/master" },
                ],
            },
        };

        render(withClient(<Dashboard />));

        fireEvent.click(screen.getByRole("tab", { name: "Saúde do deploy" }));

        const jenkins = screen.getByTestId(
            "jenkins-Jenkins - Branches e Builds",
        );
        const sonar = screen.getByTestId("sonar-quality");

        expect(jenkins).toHaveTextContent("Novo SGP::1");
        expect(jenkins.parentElement).toHaveClass("lg:col-span-1");
        expect(sonar.parentElement).toHaveClass("lg:col-span-3");
    });

    test("renderiza o card Lançamentos na aba Operacional", () => {
        mockStoreState = {
            ...mockStoreState,
            activeItem: { title: "COPED" },
            activeProject: {
                nome: "Novo SGP",
                zabbixQueryFrontend: "Portal SME",
                zabbixQueryBackend: "API SME",
                zabbixQueryFilasRabbitMQ: "Filas RabbitMQ",
                jenkinsSubprojects: [
                    { label: "Backend", key: "SME-NovoSGP/master" },
                ],
            },
        };

        render(withClient(<Dashboard />));

        const releases = screen.getByTestId("releases-Lançamentos");

        expect(releases).toHaveTextContent("Novo SGP::1");
        expect(releases.parentElement).toHaveClass("col-span-2");
    });

    test("quando não há projeto ativo, passa strings vazias para os filhos (ramo do ??)", () => {
        mockStoreState = { ...mockStoreState, activeProject: null };

        render(withClient(<Dashboard />));

        expect(screen.getByTestId("producao-Frontend")).toHaveTextContent("");
        expect(screen.getByTestId("producao-API Service")).toHaveTextContent(
            "",
        );
        expect(screen.getByTestId("filas-Fila")).toHaveTextContent("");
        expect(screen.getByTestId("database-status-card")).toHaveTextContent(
            "",
        );
    });

    test("trima os nomes antes de passar (ramo do ?.trim())", () => {
        mockStoreState = {
            ...mockStoreState,
            activeItem: { title: "COPED" },
            activeProject: {
                nome: "   Novo SGP   ",
                zabbixQueryFrontend: "   Portal SME   ",
                zabbixQueryBackend: "   API SME   ",
                zabbixQueryFilasRabbitMQ: "   Filas RabbitMQ   ",
            },
        };

        render(withClient(<Dashboard />));

        expect(screen.getByTestId("producao-Frontend")).toHaveTextContent(
            "Portal SME",
        );
        expect(screen.getByTestId("producao-API Service")).toHaveTextContent(
            "API SME",
        );
        expect(screen.getByTestId("filas-Fila")).toHaveTextContent(
            "Filas RabbitMQ",
        );
    });

    test("deve renderizar os cards analytics ao clicar na aba Analytics", () => {
        render(withClient(<Dashboard />));

        fireEvent.click(screen.getByRole("tab", { name: "Analytics" }));

        expect(screen.getByTestId("active-users-card")).toHaveTextContent(
            "Novo SGP",
        );
        expect(screen.getByTestId("average-session-card")).toHaveTextContent(
            "Novo SGP",
        );
        expect(screen.getByTestId("peak-usage-today-card")).toHaveTextContent(
            "Novo SGP",
        );
        expect(screen.getByTestId("users-by-page-card")).toHaveTextContent(
            "Novo SGP",
        );
        expect(
            screen.getByTestId("device-distribution-card"),
        ).toHaveTextContent("Novo SGP");
        expect(screen.getByTestId("peak-hours-chart")).toHaveTextContent(
            "Novo SGP",
        );
    });

    test("quando um campo específico está undefined, cai no fallback vazio para aquele filho", () => {
        mockStoreState = {
            ...mockStoreState,
            activeItem: { title: "COPED" },
            activeProject: {
                nome: "Novo SGP",
                zabbixQueryFrontend: "Portal SME",
                zabbixQueryBackend: "API SME",
                // RabbitMQ ausente → deve virar ""
            },
        };

        render(withClient(<Dashboard />));

        expect(screen.getByTestId("producao-Frontend")).toHaveTextContent(
            "Portal SME",
        );
        expect(screen.getByTestId("producao-API Service")).toHaveTextContent(
            "API SME",
        );
        expect(screen.getByTestId("filas-Fila")).toHaveTextContent(""); // fallback
    });

    test("não exibe a aba Métricas quando o projeto ativo não é o SigPAE", () => {
        render(withClient(<Dashboard />));

        expect(
            screen.queryByRole("tab", { name: "Métricas" }),
        ).not.toBeInTheDocument();
    });

    test("exibe a aba Métricas com os cards mockados quando o projeto ativo é o SigPAE", () => {
        mockStoreState = {
            ...mockStoreState,
            activeProject: { ...mockStoreState.activeProject, nome: "SigPAE" },
        };

        render(withClient(<Dashboard />));

        fireEvent.click(screen.getByRole("tab", { name: "Métricas" }));

        expect(screen.getByTestId("active-users-metric-card")).toHaveTextContent(
            "SigPAE",
        );
        expect(screen.getByTestId("unique-users-per-day-card")).toHaveTextContent(
            "SigPAE",
        );
        expect(screen.getByTestId("today-access-card")).toHaveTextContent(
            "SigPAE",
        );
        expect(screen.getByTestId("users-by-profile-card")).toHaveTextContent(
            "SigPAE",
        );
        expect(screen.getByTestId("access-comparison-card")).toHaveTextContent(
            "SigPAE",
        );
        expect(
            screen.getByTestId("alimentacao-terceirizada-section"),
        ).toHaveTextContent("SigPAE");
        expect(screen.getByTestId("logistica-section")).toHaveTextContent(
            "SigPAE",
        );
    });

    test("volta para a aba Operacional se o projeto mudar para um sistema sem Métricas", () => {
        mockStoreState = {
            ...mockStoreState,
            activeProject: { ...mockStoreState.activeProject, nome: "SigPAE" },
        };

        const { rerender } = render(withClient(<Dashboard />));

        fireEvent.click(screen.getByRole("tab", { name: "Métricas" }));
        expect(screen.getByRole("tab", { name: "Métricas" })).toHaveAttribute(
            "aria-selected",
            "true",
        );

        mockStoreState = {
            ...mockStoreState,
            activeProject: { ...mockStoreState.activeProject, nome: "Novo SGP" },
        };
        rerender(withClient(<Dashboard />));

        expect(
            screen.queryByRole("tab", { name: "Métricas" }),
        ).not.toBeInTheDocument();
        expect(screen.getByRole("tab", { name: "Operacional" })).toHaveAttribute(
            "aria-selected",
            "true",
        );
    });
});
