import type { AccessComparisonResponse } from "@/types/metricas";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("./AccessComparisonChart", () => ({
  default: ({ buckets }: { readonly buckets: unknown[] }) => (
    <div data-testid="chart">
      <span data-testid="chart-buckets-length">{buckets.length}</span>
    </div>
  ),
}));

type MockQueryResult = {
  data?: AccessComparisonResponse;
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

vi.mock("@/hooks/useAccessComparison", () => ({
  useAccessComparison: () => mockQueryResult,
}));

import AccessComparisonCard from "./AccessComparisonCard";

describe("<AccessComparisonCard />", () => {
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
    render(
      <AccessComparisonCard period="trimestre" onPeriodChange={vi.fn()} />
    );
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeleton", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(
      <AccessComparisonCard
        systemName="SigPAE"
        period="trimestre"
        onPeriodChange={vi.fn()}
      />
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(
      <AccessComparisonCard
        systemName="SigPAE"
        period="trimestre"
        onPeriodChange={vi.fn()}
      />
    );

    expect(
      screen.getByText("Não foi possível carregar o comparativo de acessos.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza o gráfico e a legenda de pico quando período é trimestre", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        buckets: [
          { label: "Mês 1", value: 42300, isPeak: false },
          { label: "Mês 2", value: 58900, isPeak: true },
          { label: "Mês 3", value: 47650, isPeak: false },
        ],
      },
    };
    render(
      <AccessComparisonCard
        systemName="SigPAE"
        period="trimestre"
        onPeriodChange={vi.fn()}
      />
    );

    expect(screen.getByTestId("chart")).toBeInTheDocument();
    expect(screen.getByTestId("chart-buckets-length")).toHaveTextContent("3");
    expect(screen.getByText("Mês de pico")).toBeInTheDocument();
    expect(screen.getByText("Fora do pico")).toBeInTheDocument();
  });

  it("usa o rótulo genérico 'Período de pico' para os demais períodos", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        buckets: [
          { label: "Dia 1", value: 1820, isPeak: false },
          { label: "Dia 2", value: 2453, isPeak: true },
          { label: "Dia 3", value: 2010, isPeak: false },
        ],
      },
    };
    render(
      <AccessComparisonCard
        systemName="SigPAE"
        period="dia"
        onPeriodChange={vi.fn()}
      />
    );

    expect(screen.getByText("Período de pico")).toBeInTheDocument();
  });

  it("chama onPeriodChange ao clicar em outro período no switcher", async () => {
    const onPeriodChange = vi.fn();
    render(
      <AccessComparisonCard
        systemName="SigPAE"
        period="trimestre"
        onPeriodChange={onPeriodChange}
      />
    );

    await userEvent.click(screen.getByRole("radio", { name: "Dia" }));
    expect(onPeriodChange).toHaveBeenCalledWith("dia");
  });
});
