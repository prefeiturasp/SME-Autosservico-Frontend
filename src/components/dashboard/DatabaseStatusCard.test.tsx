import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DatabaseStatusResponse } from "@/types/database";

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

type MockQueryResult = {
  data?: DatabaseStatusResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult = {
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
};

vi.mock("@/hooks/useDatabaseStatus", () => ({
  useDatabaseStatus: () => mockQueryResult,
}));

import DatabaseStatusCard from "./DatabaseStatusCard";

describe("<DatabaseStatusCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName → mostra 'Selecione um projeto'", () => {
    render(<DatabaseStatusCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading → mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<DatabaseStatusCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro → mostra mensagem + botão retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<DatabaseStatusCard systemName="SigPAE" />);

    expect(screen.getByText("Não foi possível carregar o status.")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sem banco de dados (hasDatabase: false) → mostra 'Sem banco de dados'", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "Escolhas", hasDatabase: false, instances: [] },
    };
    render(<DatabaseStatusCard systemName="Escolhas" />);
    expect(screen.getByText("Sem banco de dados")).toBeInTheDocument();
  });

  it("sucesso com 1 instância disponível → mostra título fixo e badge verde", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "Portal Educação",
        hasDatabase: true,
        instances: [
          { label: "MySQL", dbType: "mysql", available: true },
        ],
      },
    };
    render(<DatabaseStatusCard systemName="Portal Educação" />);

    expect(screen.getByText("Banco de dados principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Status: Disponível")).toBeInTheDocument();
    expect(screen.getByText("Disponível")).toBeInTheDocument();
  });

  it("sucesso com 1 instância indisponível → badge vermelho", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "Portal Educação",
        hasDatabase: true,
        instances: [
          { label: "MySQL", dbType: "mysql", available: false },
        ],
      },
    };
    render(<DatabaseStatusCard systemName="Portal Educação" />);

    expect(screen.getByLabelText("Status: Indisponível")).toBeInTheDocument();
    expect(screen.getByText("Indisponível")).toBeInTheDocument();
  });

  it("sucesso com 2 instâncias (escrita/leitura) → mostra ambas", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "Novo SGP",
        hasDatabase: true,
        instances: [
          { label: "PostgreSQL (Escrita)", dbType: "postgresql", available: true, role: "escrita" },
          { label: "PostgreSQL (Leitura)", dbType: "postgresql", available: false, role: "leitura" },
        ],
      },
    };
    render(<DatabaseStatusCard systemName="Novo SGP" />);

    expect(screen.getByText("Banco de dados principal (Escrita)")).toBeInTheDocument();
    expect(screen.getByText("Banco de dados principal (Leitura)")).toBeInTheDocument();
    expect(screen.getByLabelText("Status: Disponível")).toBeInTheDocument();
    expect(screen.getByLabelText("Status: Indisponível")).toBeInTheDocument();
  });
});
