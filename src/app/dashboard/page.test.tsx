// src/app/dashboard/page.test.tsx
import { render, screen } from "@testing-library/react";
import { vi, describe, test, beforeEach } from "vitest";
import Dashboard from "./page";
import { withClient } from "@/__mocks__/renderWithClient";

// ✅ Mock do store para controlar o estado usado na página
vi.mock("@/states/dashboard", () => {
  return {
    __esModule: true,
    default: (selector: (state: { activeProject: { zabbixQueryFrontend: string; zabbixQueryBackend: string } }) => unknown) =>
      selector({
        activeProject: {
          zabbixQueryFrontend: "Portal SME",
          zabbixQueryBackend: "API SME",
        },
      }),
  };
});

// ✅ Mock dos filhos para simplificar a renderização e permitir asserts claros
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

describe("Dashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza os cards e passa os nomes de projeto corretos", () => {
    render(withClient(<Dashboard />));

    // Primeiro card (Frontend, sem title explícito no Producao)
    expect(screen.getByTestId("card-Disponibilidade do ambiente")).toBeInTheDocument();
    expect(screen.getByTestId("producao-Frontend")).toHaveTextContent("Portal SME");

    // Segundo card (Backend, com title="API Service" no Producao)
    expect(screen.getByTestId("card-Saúde do servidor (Workloads)")).toBeInTheDocument();
    expect(screen.getByTestId("producao-API Service")).toHaveTextContent("API SME");
  });
});
