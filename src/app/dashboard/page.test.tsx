// src/app/dashboard/page.test.tsx
/* @vitest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { vi, describe, test, beforeEach } from "vitest";
import Dashboard from "./page";
import { withClient } from "@/__mocks__/renderWithClient";

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
};
let mockStoreState: StoreState = {
  activeItem: { title: "COPED" },
  activeProject: {
    nome: "Novo SGP",
    zabbixQueryFrontend: "Portal SME",
    zabbixQueryBackend: "API SME",
    zabbixQueryFilasRabbitMQ: "Filas RabbitMQ",
  },
};

vi.mock("@/states/dashboard", () => ({
  __esModule: true,
  default: (selector: (s: StoreState) => unknown) => selector(mockStoreState),
}));

// 🔧 Mocks simples dos filhos
vi.mock("@/components/dashboard/CardWrapperInfoAmbientes", () => ({
  __esModule: true,
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section data-testid={`card-${title}`}>{children}</section>
  ),
}));

vi.mock("@/components/dashboard/DisponibilidadeDosAmbientes/Producao", () => ({
  __esModule: true,
  default: ({ title, projectName }: { title?: string; projectName: string }) => (
    <div data-testid={`producao-${title ?? "Frontend"}`}>{projectName}</div>
  ),
}));

vi.mock("@/components/dashboard/SaudeDosServidores/Filas", () => ({
  __esModule: true,
  default: ({ title, projectName }: { title: string; projectName: string }) => (
    <div data-testid={`filas-${title ?? "Filas"}`}>{projectName}</div>
  ),
}));

vi.mock("@/components/dashboard/JenkinsJob", () => ({
  __esModule: true,
  default: ({ title, project, subprojects }: { title?: string; project: string; subprojects?: unknown[] }) => (
    <div data-testid={`jenkins-${title ?? "Jenkins - Branches e Builds"}`}>
      {project}::{Array.isArray(subprojects) ? subprojects.length : 0}
    </div>
  ),
}));

vi.mock("@/components/dashboard/DeployHealth/EnvironmentHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="environment-header">Ambiente</div>,
}));

vi.mock("@/components/dashboard/DeployHealth/SonarQuality/SonarQualityIndicatorsCard", () => ({
  __esModule: true,
  default: ({ projectName, className }: { projectName: string; className?: string }) => (
    <div data-testid="sonar-quality" className={className}>
      {projectName}
    </div>
  ),
}));

vi.mock("@/components/dashboard/DatabaseStatusCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="database-status-card">{systemName ?? ""}</div>
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
    };
  });

  test("renderiza os cards e passa os nomes de projeto corretos", () => {
    render(withClient(<Dashboard />));

    // Primeiro card (Frontend)
    expect(screen.getByTestId("card-Disponibilidade do ambiente")).toBeInTheDocument();
    expect(screen.getByTestId("producao-Frontend")).toHaveTextContent("Portal SME");

    // Segundo card (Saúde do servidor)
    expect(screen.getByTestId("card-Saúde do servidor (Workloads)")).toBeInTheDocument();
    expect(screen.getByTestId("producao-API Service")).toHaveTextContent("API SME");

    // Filas
    expect(screen.getByTestId("filas-Fila")).toHaveTextContent("Filas RabbitMQ");

    // Banco de dados
    expect(screen.getByTestId("database-status-card")).toHaveTextContent("Novo SGP");
  });

  test("renderiza Jenkins - Branches e Builds na aba Saúde do deploy à esquerda do Sonar", () => {
    mockStoreState = {
      activeItem: { title: "COPED" },
      activeProject: {
        nome: "Novo SGP",
        zabbixQueryFrontend: "Portal SME",
        zabbixQueryBackend: "API SME",
        zabbixQueryFilasRabbitMQ: "Filas RabbitMQ",
        jenkinsSubprojects: [{ label: "Backend", key: "SME-NovoSGP/master" }],
      },
    };

    render(withClient(<Dashboard />));

    fireEvent.click(screen.getByRole("tab", { name: "Saúde do deploy" }));

    const jenkins = screen.getByTestId("jenkins-Jenkins - Branches e Builds");
    const sonar = screen.getByTestId("sonar-quality");

    expect(jenkins).toHaveTextContent("Novo SGP::1");
    expect(jenkins.parentElement).toHaveClass("lg:col-span-1");
    expect(sonar).toHaveClass("lg:col-span-3");
  });

  test("quando não há projeto ativo, passa strings vazias para os filhos (ramo do ??)", () => {
    mockStoreState = { activeProject: null };

    render(withClient(<Dashboard />));

    expect(screen.getByTestId("producao-Frontend")).toHaveTextContent("");
    expect(screen.getByTestId("producao-API Service")).toHaveTextContent("");
    expect(screen.getByTestId("filas-Fila")).toHaveTextContent("");
    expect(screen.getByTestId("database-status-card")).toHaveTextContent("");
  });

  test("trima os nomes antes de passar (ramo do ?.trim())", () => {
    mockStoreState = {
      activeItem: { title: "COPED" },
      activeProject: {
        nome: "   Novo SGP   ",
        zabbixQueryFrontend: "   Portal SME   ",
        zabbixQueryBackend: "   API SME   ",
        zabbixQueryFilasRabbitMQ: "   Filas RabbitMQ   ",
      },
    };

    render(withClient(<Dashboard />));

    expect(screen.getByTestId("producao-Frontend")).toHaveTextContent("Portal SME");
    expect(screen.getByTestId("producao-API Service")).toHaveTextContent("API SME");
    expect(screen.getByTestId("filas-Fila")).toHaveTextContent("Filas RabbitMQ");
  });

  test("quando um campo específico está undefined, cai no fallback vazio para aquele filho", () => {
    mockStoreState = {
      activeItem: { title: "COPED" },
      activeProject: {
        nome: "Novo SGP",
        zabbixQueryFrontend: "Portal SME",
        zabbixQueryBackend: "API SME",
        // RabbitMQ ausente → deve virar ""
      },
    };

    render(withClient(<Dashboard />));

    expect(screen.getByTestId("producao-Frontend")).toHaveTextContent("Portal SME");
    expect(screen.getByTestId("producao-API Service")).toHaveTextContent("API SME");
    expect(screen.getByTestId("filas-Fila")).toHaveTextContent(""); // fallback
  });
});
