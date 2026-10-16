import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PrestacaoDeContasResponse } from "@/types/metricas";
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
  data?: PrestacaoDeContasResponse;
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

vi.mock("@/hooks/usePrestacaoDeContas", () => ({
  usePrestacaoDeContas: () => mockQueryResult,
}));

import PrestacaoDeContasCard from "./PrestacaoDeContasCard";

const BASE_FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

describe("<PrestacaoDeContasCard />", () => {
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
    render(<PrestacaoDeContasCard filtros={BASE_FILTROS} />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("renderiza o título 'Prestação de contas'", () => {
    render(
      <PrestacaoDeContasCard systemName="SigEscola" filtros={BASE_FILTROS} />,
    );
    expect(screen.getByText("Prestação de contas")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(
      <PrestacaoDeContasCard systemName="SigEscola" filtros={BASE_FILTROS} />,
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(
      <PrestacaoDeContasCard systemName="SigEscola" filtros={BASE_FILTROS} />,
    );

    expect(
      screen.getByText("Não foi possível carregar a prestação de contas."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza o destaque e os 4 indicadores, incluindo os valores em moeda", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        destaque: [
          {
            label: "UEs aptas a prestar contas pelo sistema",
            value: 3683,
            variant: "neutral",
          },
          {
            label: "Devolução ao Tesouro",
            value: 2340530,
            variant: "neutral",
            format: "currency",
          },
        ],
        items: [
          {
            label: "PCs enviadas ou em andamento com as DREs",
            value: 2490,
            variant: "neutral",
          },
          {
            label: "Créditos disponíveis para as UEs",
            value: 197248412.27,
            variant: "success",
            format: "currency",
          },
          {
            label: "Despesas registradas pelas UEs",
            value: 90490083.76,
            variant: "danger",
            format: "currency",
          },
          {
            label: "Demonstrativos financeiros gerados pelas UEs",
            value: 3683,
            variant: "neutral",
          },
        ],
      },
    };
    render(
      <PrestacaoDeContasCard systemName="SigEscola" filtros={BASE_FILTROS} />,
    );

    expect(screen.getAllByText("3.683")).toHaveLength(2);
    expect(
      screen.getByText("UEs aptas a prestar contas pelo sistema"),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 2.340.530,00")).toBeInTheDocument();
    expect(screen.getByText("2.490")).toBeInTheDocument();
    expect(screen.getByText("R$ 197.248.412,27")).toBeInTheDocument();
    expect(screen.getByText("R$ 90.490.083,76")).toBeInTheDocument();
  });
});
