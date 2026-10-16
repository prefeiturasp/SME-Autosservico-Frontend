import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ProgressStatsResponse } from "@/types/metricas";

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
  data?: ProgressStatsResponse;
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

vi.mock("@/hooks/useVivenciasComRefeicao", () => ({
  useVivenciasComRefeicao: () => mockQueryResult,
}));

import VivenciasComRefeicaoCard from "./VivenciasComRefeicaoCard";

describe("<VivenciasComRefeicaoCard />", () => {
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
    render(<VivenciasComRefeicaoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<VivenciasComRefeicaoCard systemName="Rolê Agroecológico" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<VivenciasComRefeicaoCard systemName="Rolê Agroecológico" />);

    expect(
      screen.getByText("Não foi possível carregar as vivências com refeição."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza o item e a barra de progresso", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          {
            label: "Vivências que incluíram refeição",
            value: 156,
            variant: "neutral",
          },
        ],
        progressPercentage: 84.8,
      },
    };
    render(<VivenciasComRefeicaoCard systemName="Rolê Agroecológico" />);

    expect(screen.getByText("156")).toBeInTheDocument();
    expect(screen.getByText("Vivências que incluíram refeição")).toBeInTheDocument();
    expect(screen.getByText("84,8%")).toBeInTheDocument();
  });
});
