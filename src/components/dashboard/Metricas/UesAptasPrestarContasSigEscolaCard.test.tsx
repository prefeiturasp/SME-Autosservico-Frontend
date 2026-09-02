import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UesAptasPrestarContasResponse } from "@/types/metricas";

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
  data?: UesAptasPrestarContasResponse;
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

vi.mock("@/hooks/useUesAptasPrestarContasSigEscola", () => ({
  useUesAptasPrestarContasSigEscola: () => mockQueryResult,
}));

import UesAptasPrestarContasSigEscolaCard from "./UesAptasPrestarContasSigEscolaCard";

describe("<UesAptasPrestarContasSigEscolaCard />", () => {
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
    render(<UesAptasPrestarContasSigEscolaCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UesAptasPrestarContasSigEscolaCard systemName="SigEscola" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UesAptasPrestarContasSigEscolaCard systemName="SigEscola" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as UEs aptas a prestar contas.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("formata valor em pt-BR e mostra o badge de tendência", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        count: 1644,
        trend: "above",
        trendLabel: "13 novos nos últimos 30 dias",
      },
    };
    render(<UesAptasPrestarContasSigEscolaCard systemName="SigEscola" />);

    expect(screen.getByText("1.644")).toBeInTheDocument();
    expect(screen.getByText("13 novos nos últimos 30 dias")).toBeInTheDocument();
  });
});
