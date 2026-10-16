import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StatsCardResponse } from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";

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

vi.mock("@/hooks/useSituacaoPatrimonial", () => ({
  useSituacaoPatrimonial: () => mockQueryResult,
}));

import SituacaoPatrimonialCard from "./SituacaoPatrimonialCard";

const BASE_FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

describe("<SituacaoPatrimonialCard />", () => {
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
    render(<SituacaoPatrimonialCard filtros={BASE_FILTROS} />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(
      <SituacaoPatrimonialCard systemName="SigEscola" filtros={BASE_FILTROS} />,
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(
      <SituacaoPatrimonialCard systemName="SigEscola" filtros={BASE_FILTROS} />,
    );

    expect(
      screen.getByText("Não foi possível carregar a situação patrimonial."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens mockados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          {
            label: "Quantidade de bens produzidos pelas UEs",
            value: 318,
            variant: "neutral",
          },
          {
            label: "Valor dos bens produzidos",
            value: 842212.85,
            variant: "neutral",
            format: "currency",
          },
        ],
      },
    };
    render(
      <SituacaoPatrimonialCard systemName="SigEscola" filtros={BASE_FILTROS} />,
    );

    expect(screen.getByText("318")).toBeInTheDocument();
    expect(screen.getByText("R$ 842.212,85")).toBeInTheDocument();
  });
});
