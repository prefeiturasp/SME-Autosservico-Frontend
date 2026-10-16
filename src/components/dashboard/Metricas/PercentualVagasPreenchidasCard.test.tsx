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

vi.mock("@/hooks/usePercentualVagasPreenchidas", () => ({
  usePercentualVagasPreenchidas: () => mockQueryResult,
}));

import PercentualVagasPreenchidasCard from "./PercentualVagasPreenchidasCard";

describe("<PercentualVagasPreenchidasCard />", () => {
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
    render(<PercentualVagasPreenchidasCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<PercentualVagasPreenchidasCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<PercentualVagasPreenchidasCard systemName="Sigla" />);

    expect(
      screen.getByText(
        "Não foi possível carregar o percentual de vagas preenchidas.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza a barra de progresso, sem itens acima", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { items: [], progressPercentage: 88.2 },
    };
    render(<PercentualVagasPreenchidasCard systemName="Sigla" />);

    expect(screen.getByText("88,2%")).toBeInTheDocument();
    expect(screen.getByTestId("progress-stats-fill")).toHaveStyle({
      width: "88.20%",
    });
  });
});
