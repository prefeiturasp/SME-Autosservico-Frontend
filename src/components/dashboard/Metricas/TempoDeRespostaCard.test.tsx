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

vi.mock("@/hooks/useTempoDeResposta", () => ({
  useTempoDeResposta: () => mockQueryResult,
}));

import TempoDeRespostaCard from "./TempoDeRespostaCard";

describe("<TempoDeRespostaCard />", () => {
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
    render(<TempoDeRespostaCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<TempoDeRespostaCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<TempoDeRespostaCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar o tempo de resposta."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os valores em dias com os selos de tendência", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          {
            label: "Tempo médio de resolução",
            value: 6.4,
            variant: "neutral",
            format: "days",
            trend: "above",
            trendLabel: "14% mais rápido nos últimos 30 dias",
          },
          {
            label: "Tempo médio até a primeira tratativa",
            value: 1.2,
            variant: "neutral",
            format: "days",
            trend: "below",
            trendLabel: "2% mais lento nos últimos 30 dias",
          },
        ],
      },
    };
    render(<TempoDeRespostaCard systemName="GIPE" />);

    expect(screen.getByText("6,4 dias")).toBeInTheDocument();
    expect(screen.getByText("1,2 dias")).toBeInTheDocument();
    expect(
      screen.getByText("14% mais rápido nos últimos 30 dias"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("2% mais lento nos últimos 30 dias"),
    ).toBeInTheDocument();
  });
});
