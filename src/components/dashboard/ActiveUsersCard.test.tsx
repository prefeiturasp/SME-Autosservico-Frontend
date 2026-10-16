import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ActiveUsersResponse } from "@/types/activeUsers";

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
  data?: ActiveUsersResponse;
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

vi.mock("@/hooks/useActiveUsers", () => ({
  useActiveUsers: () => mockQueryResult,
}));

import ActiveUsersCard from "./ActiveUsersCard";

describe("<ActiveUsersCard />", () => {
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
    render(<ActiveUsersCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ActiveUsersCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ActiveUsersCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar os usuários ativos.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("formata valor em pt-BR e mostra badge 'acima da média' com percentual", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        activeCount: 8398,
        averageCount: 7563,
        differencePercentage: 18,
        trend: "above",
      },
    };
    render(<ActiveUsersCard systemName="SigPAE" />);

    expect(screen.getByText("8.398")).toBeInTheDocument();
    expect(screen.getByText("18% acima da média")).toBeInTheDocument();
    expect(screen.getByText(/média: 7\.563/)).toBeInTheDocument();
  });

  it("mostra 'Na média' sem percentual quando trend = on-average", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        activeCount: 7600,
        averageCount: 7563,
        differencePercentage: 0,
        trend: "on-average",
      },
    };
    render(<ActiveUsersCard systemName="SigPAE" />);
    expect(screen.getByText("Na média")).toBeInTheDocument();
  });

  it("mostra 'abaixo da média' com percentual quando trend = below", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        activeCount: 6000,
        averageCount: 7563,
        differencePercentage: 20,
        trend: "below",
      },
    };
    render(<ActiveUsersCard systemName="SigPAE" />);
    expect(screen.getByText("20% abaixo da média")).toBeInTheDocument();
  });
});
