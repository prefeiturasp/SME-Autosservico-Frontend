import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AverageSessionResponse } from "@/types/averageSession";

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
  data?: AverageSessionResponse;
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

vi.mock("@/hooks/useAverageSession", () => ({
  useAverageSession: () => mockQueryResult,
}));

import AverageSessionCard from "./AverageSessionCard";

describe("<AverageSessionCard />", () => {
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
    render(<AverageSessionCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<AverageSessionCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<AverageSessionCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar a média de sessão.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza valor formatado e badge 'Na média' quando trend = on-average", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        currentSeconds: 872,
        averageSeconds: 868,
        trend: "on-average",
      },
    };
    render(<AverageSessionCard systemName="SigPAE" />);

    expect(screen.getByText("14m 32s")).toBeInTheDocument();
    expect(screen.getByText("Na média")).toBeInTheDocument();
    expect(screen.getByText(/média: 14m 28s/)).toBeInTheDocument();
  });

  it("renderiza badge 'Acima da média' quando trend = above", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        currentSeconds: 1000,
        averageSeconds: 800,
        trend: "above",
      },
    };
    render(<AverageSessionCard systemName="SigPAE" />);
    expect(screen.getByText("Acima da média")).toBeInTheDocument();
  });

  it("renderiza badge 'Abaixo da média' quando trend = below", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        currentSeconds: 500,
        averageSeconds: 800,
        trend: "below",
      },
    };
    render(<AverageSessionCard systemName="SigPAE" />);
    expect(screen.getByText("Abaixo da média")).toBeInTheDocument();
  });
});
