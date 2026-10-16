import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AccessComparisonResponse } from "@/types/metricas";

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
  default: ({
    buckets,
    barCategoryGap,
    highlightPeakLabel,
  }: {
    readonly buckets: unknown[];
    readonly barCategoryGap?: number | string;
    readonly highlightPeakLabel?: boolean;
  }) => (
    <div data-testid="chart">
      <span data-testid="chart-buckets-length">{buckets.length}</span>
      <span data-testid="chart-bar-category-gap">{String(barCategoryGap)}</span>
      <span data-testid="chart-highlight-peak-label">
        {String(highlightPeakLabel)}
      </span>
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

vi.mock("@/hooks/useOcorrenciasPorMes", () => ({
  useOcorrenciasPorMes: () => mockQueryResult,
}));

import OcorrenciasPorMesCard from "./OcorrenciasPorMesCard";

describe("<OcorrenciasPorMesCard />", () => {
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
    render(<OcorrenciasPorMesCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeleton", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciasPorMesCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciasPorMesCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar as ocorrências por mês."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza o gráfico e só a legenda 'Mês de pico', sem 'Fora do pico'", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        buckets: [
          { label: "Fevereiro/26", value: 214, isPeak: false },
          { label: "Março/26", value: 386, isPeak: true },
          { label: "Abril/26", value: 198, isPeak: false },
        ],
      },
    };
    render(<OcorrenciasPorMesCard systemName="GIPE" />);

    expect(screen.getByTestId("chart")).toBeInTheDocument();
    expect(screen.getByTestId("chart-buckets-length")).toHaveTextContent("3");
    expect(screen.getByTestId("chart-bar-category-gap")).toHaveTextContent("5");
    expect(screen.getByTestId("chart-highlight-peak-label")).toHaveTextContent(
      "true",
    );
    expect(screen.getByText("Mês de pico")).toBeInTheDocument();
    expect(screen.queryByText("Fora do pico")).not.toBeInTheDocument();
  });
});
