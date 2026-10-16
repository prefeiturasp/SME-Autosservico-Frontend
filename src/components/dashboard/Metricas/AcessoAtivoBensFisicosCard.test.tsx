import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

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
  data?: ActiveAccessUsersResponse;
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

vi.mock("@/hooks/useAcessoAtivoBensFisicos", () => ({
  useAcessoAtivoBensFisicos: () => mockQueryResult,
}));

import AcessoAtivoBensFisicosCard from "./AcessoAtivoBensFisicosCard";

describe("<AcessoAtivoBensFisicosCard />", () => {
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
    render(<AcessoAtivoBensFisicosCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<AcessoAtivoBensFisicosCard systemName="Bens Físicos" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<AcessoAtivoBensFisicosCard systemName="Bens Físicos" />);

    expect(
      screen.getByText("Não foi possível carregar os usuários com acesso ativo."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("formata valor em pt-BR e mostra o badge de tendência", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        activeCount: 4645,
        trend: "on-average",
        trendLabel: "Média dos últimos 30 dias",
      },
    };
    render(<AcessoAtivoBensFisicosCard systemName="Bens Físicos" />);

    expect(screen.getByText("4.645")).toBeInTheDocument();
    expect(screen.getByText("Média dos últimos 30 dias")).toBeInTheDocument();
  });
});
