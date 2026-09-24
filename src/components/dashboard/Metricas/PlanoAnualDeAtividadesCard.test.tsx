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

vi.mock("@/hooks/usePlanoAnualDeAtividades", () => ({
  usePlanoAnualDeAtividades: () => mockQueryResult,
}));

import PlanoAnualDeAtividadesCard from "./PlanoAnualDeAtividadesCard";

const BASE_FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

describe("<PlanoAnualDeAtividadesCard />", () => {
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
    render(<PlanoAnualDeAtividadesCard filtros={BASE_FILTROS} />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(
      <PlanoAnualDeAtividadesCard
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
      <PlanoAnualDeAtividadesCard
        systemName="SigEscola"
        filtros={BASE_FILTROS}
      />,
    );

    expect(
      screen.getByText(
        "Não foi possível carregar o plano anual de atividades.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens mockados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "PAAs em andamento", value: 318, variant: "neutral" },
          { label: "PAAs finalizados", value: 1204, variant: "success" },
          { label: "PAAs em retificação", value: 42, variant: "warning" },
        ],
      },
    };
    render(
      <PlanoAnualDeAtividadesCard
        systemName="SigEscola"
        filtros={BASE_FILTROS}
      />,
    );

    expect(screen.getByText("318")).toBeInTheDocument();
    expect(screen.getByText("1.204")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
