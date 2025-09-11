import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ZabbixStatus } from "@/types/zabbix";

import ZabbixStatusCard from "./ZabbixStatusCard";

// ---- Mocks leves para manter os testes rápidos/estáveis ----
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="retry-button" {...rest}>
      {children}
    </button>
  ),
}));

/**
 * Tipo LEVE usado nos testes (apenas os campos que o componente consome).
 * Evita o union complexo do TanStack e a exigência de `data: undefined` em alguns ramos.
 */
type LiteQuery = {
  data?: Partial<ZabbixStatus>;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  refetch?: () => void;
};

// Cast centralizado: transforma LiteQuery no tipo do TanStack só para satisfazer o TS nos testes.
const asQuery = (partial: LiteQuery) =>
  partial as unknown as UseQueryResult<ZabbixStatus, unknown>;

// Fábrica minimalista para montar o "resultado" do hook
const makeQuery = (overrides: LiteQuery = {}) =>
  asQuery({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  });

describe("<ZabbixStatusCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o hint quando projectName está ausente", () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        className="bg-muted p-3"
        query={makeQuery()}
        emptyProjectHint="Selecione um projeto por favor"
      />
    );

    expect(screen.getByText("Produção")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione um projeto por favor")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Status:/)).not.toBeInTheDocument();
  });

  it("renderiza estado de loading (isLoading)", () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        className="bg-muted p-3"
        projectName="Projeto X"
        query={makeQuery({ isLoading: true })}
      />
    );

    expect(screen.getByText("Produção")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("renderiza estado de fetching (isFetching)", () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        className="bg-muted p-3"
        projectName="Projeto X"
        query={makeQuery({ isFetching: true })}
      />
    );

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("renderiza erro quando isError=true e chama refetch ao clicar", async () => {
    const refetch = vi.fn();
    render(
      <ZabbixStatusCard
        title="Produção"
        className="bg-muted p-3"
        projectName="Projeto X"
        query={makeQuery({ isError: true, refetch })}
      />
    );

    expect(
      screen.getByText("Não foi possível carregar o status.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza erro quando data é undefined (mesmo sem isError)", () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        className="bg-muted p-3"
        projectName="Projeto X"
        query={makeQuery({ isError: false, data: undefined })}
      />
    );

    expect(
      screen.getByText("Não foi possível carregar o status.")
    ).toBeInTheDocument();
  });

  it("sucesso: available=true e incidents_recent=false (message undefined) => subtítulo 'Sem incidentes recentes' + pílula 'Disponível'", () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        className="custom-class"
        projectName="Projeto X"
        query={makeQuery({
          data: {
            available: true,
            incidents_recent: false,
            message: undefined,
            lastIncidentAt: undefined,
          },
        })}
      />
    );

    // className aplicada na raiz
    expect(screen.getByText("Produção").parentElement).toHaveClass(
      "custom-class"
    );

    expect(screen.getByText("Sem incidentes recentes")).toBeInTheDocument();

    const pill = screen.getByLabelText("Status: Disponível");
    expect(pill).toBeInTheDocument();
    expect(screen.getByText("Disponível")).toBeInTheDocument();
  });

  it("sucesso: available=true e incidents_recent=true (message undefined) => subtítulo 'Houve incidentes recentes'", () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        projectName="Projeto X"
        query={makeQuery({
          data: {
            available: true,
            incidents_recent: true,
            message: undefined,
            lastIncidentAt: undefined,
          },
        })}
      />
    );

    expect(screen.getByText("Houve incidentes recentes")).toBeInTheDocument();
    const pill = screen.getByLabelText("Status: Disponível");
    expect(pill).toBeInTheDocument();
  });

  it('sucesso: message === "Houve incidentes recentes" + lastIncidentAt => subtítulo com data', () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        projectName="Projeto X"
        query={makeQuery({
          data: {
            available: true,
            incidents_recent: true,
            message: "Houve incidentes recentes",
            lastIncidentAt: "04/09/2025 10:37",
          },
        })}
      />
    );

    expect(
      screen.getByText("Houve incidentes recentes - 04/09/2025 10:37")
    ).toBeInTheDocument();
  });

  it("sucesso: available=false => pílula 'Indisponível' e mantém mensagem customizada", () => {
    render(
      <ZabbixStatusCard
        title="Produção"
        projectName="Projeto X"
        query={makeQuery({
          data: {
            available: false,
            incidents_recent: true,
            message: "Há incidentes ativos",
            lastIncidentAt: "01/01/2025 08:00",
          },
        })}
      />
    );

    const pill = screen.getByLabelText("Status: Indisponível");
    expect(pill).toBeInTheDocument();
    expect(screen.getByText("Indisponível")).toBeInTheDocument();
    expect(screen.getByText("Há incidentes ativos")).toBeInTheDocument();
  });
});
