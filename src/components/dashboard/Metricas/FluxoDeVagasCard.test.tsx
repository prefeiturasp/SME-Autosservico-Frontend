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

vi.mock("@/hooks/useFluxoDeVagas", () => ({
  useFluxoDeVagas: () => mockQueryResult,
}));

import FluxoDeVagasCard from "./FluxoDeVagasCard";

describe("<FluxoDeVagasCard />", () => {
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

  it("sem systemName mostra placeholder", () => {
    render(<FluxoDeVagasCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<FluxoDeVagasCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<FluxoDeVagasCard systemName="Sigla" />);

    expect(
      screen.getByText("Não foi possível carregar o fluxo de vagas."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens mockados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Vagas importadas", value: 2150, variant: "neutral" },
          { label: "Vagas disponíveis", value: 1884, variant: "success" },
          { label: "Vagas preenchidas", value: 1640, variant: "success" },
          { label: "Vagas remanescentes", value: 220, variant: "warning" },
        ],
      },
    };
    render(<FluxoDeVagasCard systemName="Sigla" />);

    expect(screen.getByText("2.150")).toBeInTheDocument();
    expect(screen.getByText("1.884")).toBeInTheDocument();
    expect(screen.getByText("1.640")).toBeInTheDocument();
    expect(screen.getByText("220")).toBeInTheDocument();
  });
});
