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

vi.mock("@/hooks/useProdutividadeTotais", () => ({
  useProdutividadeTotais: () => mockQueryResult,
}));

import ProdutividadeTotaisCard from "./ProdutividadeTotaisCard";

describe("<ProdutividadeTotaisCard />", () => {
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
    render(<ProdutividadeTotaisCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ProdutividadeTotaisCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ProdutividadeTotaisCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar os totais de produtividade."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens mockados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Encaminhamentos realizados", value: 2870, variant: "neutral" },
          { label: "Anexos enviados", value: 4512, variant: "neutral" },
          {
            label: "Atualizações nas ocorrências",
            value: 6238,
            variant: "neutral",
          },
        ],
      },
    };
    render(<ProdutividadeTotaisCard systemName="GIPE" />);

    expect(screen.getByText("2.870")).toBeInTheDocument();
    expect(screen.getByText("4.512")).toBeInTheDocument();
    expect(screen.getByText("6.238")).toBeInTheDocument();
  });
});
