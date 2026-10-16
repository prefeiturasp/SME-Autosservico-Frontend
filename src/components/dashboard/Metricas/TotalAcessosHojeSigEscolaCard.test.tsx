import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TodayAccessResponse } from "@/types/metricas";
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
  data?: TodayAccessResponse;
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

vi.mock("@/hooks/useTotalAcessosHojeSigEscola", () => ({
  useTotalAcessosHojeSigEscola: () => mockQueryResult,
}));

import TotalAcessosHojeSigEscolaCard from "./TotalAcessosHojeSigEscolaCard";

const BASE_FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

describe("<TotalAcessosHojeSigEscolaCard />", () => {
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
    render(<TotalAcessosHojeSigEscolaCard filtros={BASE_FILTROS} />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(
      <TotalAcessosHojeSigEscolaCard
        systemName="SigEscola"
        filtros={BASE_FILTROS}
      />,
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(
      <TotalAcessosHojeSigEscolaCard
        systemName="SigEscola"
        filtros={BASE_FILTROS}
      />,
    );

    expect(
      screen.getByText("Não foi possível carregar os acessos de hoje."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("formata valor em pt-BR e mostra o badge de tendência", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        accessCount: 944,
        trend: "above",
        trendLabel: "13 novos nos últimos 30 dias",
      },
    };
    render(
      <TotalAcessosHojeSigEscolaCard
        systemName="SigEscola"
        filtros={BASE_FILTROS}
      />,
    );

    expect(screen.getByText("944")).toBeInTheDocument();
    expect(
      screen.getByText("13 novos nos últimos 30 dias"),
    ).toBeInTheDocument();
  });
});
