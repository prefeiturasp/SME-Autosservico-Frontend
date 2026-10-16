import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StatsCardResponse } from "@/types/metricas";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: (props: Readonly<React.HTMLAttributes<HTMLDivElement>>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...rest
  }: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
    <button data-testid="retry-button" {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("./BensCadastradosPorUnidadeCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="bens-cadastrados-por-unidade-card">
      {systemName ?? ""}::{bare ? "bare" : "full"}
    </div>
  ),
}));

type MockQueryResult = {
  data?: StatsCardResponse;
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

vi.mock("@/hooks/useCadastroDeBens", () => ({
  useCadastroDeBens: () => mockQueryResult,
}));

import CadastroDeBensCard from "./CadastroDeBensCard";

describe("<CadastroDeBensCard />", () => {
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

  it("sem systemName mostra um único placeholder", () => {
    render(<CadastroDeBensCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    expect(
      screen.queryByTestId("bens-cadastrados-por-unidade-card"),
    ).not.toBeInTheDocument();
  });

  it("loading mostra skeletons dos indicadores", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<CadastroDeBensCard systemName="Bens Físicos" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<CadastroDeBensCard systemName="Bens Físicos" />);

    expect(
      screen.getByText("Não foi possível carregar o cadastro de bens."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens e a tabela de unidades no mesmo card, em modo bare", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          {
            label: "Número de bens cadastrados",
            value: 18420,
            variant: "neutral",
          },
          {
            label: "Bens aguardando aprovação de cadastro",
            value: 128,
            variant: "warning",
          },
        ],
      },
    };
    render(<CadastroDeBensCard systemName="Bens Físicos" />);

    expect(screen.getByText("18.420")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(
      screen.getByTestId("bens-cadastrados-por-unidade-card"),
    ).toHaveTextContent("Bens Físicos::bare");
  });
});
