import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UniqueUsersPerDayResponse } from "@/types/metricas";

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
  data?: UniqueUsersPerDayResponse;
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

vi.mock("@/hooks/useUniqueUsersPerDay", () => ({
  useUniqueUsersPerDay: () => mockQueryResult,
}));

import UniqueUsersPerDayCard from "./UniqueUsersPerDayCard";

describe("<UniqueUsersPerDayCard />", () => {
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
    render(<UniqueUsersPerDayCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UniqueUsersPerDayCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UniqueUsersPerDayCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar os usuários únicos por dia.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("formata valor em pt-BR e mostra o badge de tendência", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        uniqueCount: 3560,
        trend: "on-average",
        trendLabel: "Média dos últimos 30 dias",
      },
    };
    render(<UniqueUsersPerDayCard systemName="SigPAE" />);

    expect(screen.getByText("3.560")).toBeInTheDocument();
    expect(screen.getByText("Média dos últimos 30 dias")).toBeInTheDocument();
  });
});
