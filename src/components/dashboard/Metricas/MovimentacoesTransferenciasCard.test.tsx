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

vi.mock("@/hooks/useMovimentacoesTransferencias", () => ({
  useMovimentacoesTransferencias: () => mockQueryResult,
}));

import MovimentacoesTransferenciasCard from "./MovimentacoesTransferenciasCard";

describe("<MovimentacoesTransferenciasCard />", () => {
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
    render(<MovimentacoesTransferenciasCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<MovimentacoesTransferenciasCard systemName="Bens Físicos" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<MovimentacoesTransferenciasCard systemName="Bens Físicos" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as movimentações e transferências.",
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
          { label: "Movimentações realizadas", value: 3150, variant: "neutral" },
          { label: "Movimentações pendentes", value: 214, variant: "warning" },
          { label: "Transferências realizadas", value: 892, variant: "neutral" },
        ],
      },
    };
    render(<MovimentacoesTransferenciasCard systemName="Bens Físicos" />);

    expect(screen.getByText("3.150")).toBeInTheDocument();
    expect(screen.getByText("Movimentações realizadas")).toBeInTheDocument();
    expect(screen.getByText("214")).toBeInTheDocument();
    expect(screen.getByText("Movimentações pendentes")).toBeInTheDocument();
    expect(screen.getByText("892")).toBeInTheDocument();
    expect(screen.getByText("Transferências realizadas")).toBeInTheDocument();
  });
});
