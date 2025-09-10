// src/app/dashboard/page.test.tsx
/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { vi, describe, test, beforeEach } from "vitest";
import Dashboard from "./page";
import { withClient } from "@/__mocks__/renderWithClient";

// 🔧 Mock do store com estado configurável por teste
type StoreState = {
  activeProject: null | {
    zabbixQueryFrontend?: string;
    zabbixQueryBackend?: string;
    zabbixQueryFilasRabbitMQ?: string;
  };
};
let mockStoreState: StoreState = {
  activeProject: {
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

describe("Dashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreState = {
      activeProject: {
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
  });

  test("quando não há projeto ativo, passa strings vazias para os filhos (ramo do ??)", () => {
    mockStoreState = { activeProject: null };

    render(withClient(<Dashboard />));

    expect(screen.getByTestId("producao-Frontend")).toHaveTextContent("");
    expect(screen.getByTestId("producao-API Service")).toHaveTextContent("");
    expect(screen.getByTestId("filas-Fila")).toHaveTextContent("");
  });

  test("trima os nomes antes de passar (ramo do ?.trim())", () => {
    mockStoreState = {
      activeProject: {
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
      activeProject: {
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
