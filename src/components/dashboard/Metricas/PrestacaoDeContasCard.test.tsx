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

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: Readonly<{
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }>) => (
    <select
      data-testid="select-native"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: Readonly<{ value: string; children: React.ReactNode }>) => (
    <option value={value}>{children}</option>
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
let lastPeriodoArg: string | undefined;

vi.mock("@/hooks/usePrestacaoDeContas", () => ({
  usePrestacaoDeContas: ({ periodo }: { periodo: string }) => {
    lastPeriodoArg = periodo;
    return mockQueryResult;
  },
}));

import PrestacaoDeContasCard from "./PrestacaoDeContasCard";

describe("<PrestacaoDeContasCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastPeriodoArg = undefined;
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra placeholder", () => {
    render(<PrestacaoDeContasCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("renderiza o título 'Prestação de contas' e usa '2026.1' como período inicial", () => {
    render(<PrestacaoDeContasCard systemName="SigEscola" />);
    expect(screen.getByText("Prestação de contas")).toBeInTheDocument();
    expect(lastPeriodoArg).toBe("2026.1");
    expect(screen.getByTestId("select-native")).toHaveValue("2026.1");
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<PrestacaoDeContasCard systemName="SigEscola" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<PrestacaoDeContasCard systemName="SigEscola" />);

    expect(
      screen.getByText("Não foi possível carregar a prestação de contas."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os 4 indicadores, incluindo os valores em moeda", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          {
            label: "Prestações de contas enviadas ou em andamento com as DREs",
            value: 2490,
            variant: "neutral",
          },
          {
            label: "Créditos disponíveis para as UEs",
            value: 197248412.27,
            variant: "success",
            format: "currency",
          },
          {
            label: "Despesas registradas pelas as UEs",
            value: 90490083.76,
            variant: "danger",
            format: "currency",
          },
          {
            label: "Demonstrativos financeiros gerados pelas UEs",
            value: 3683,
            variant: "neutral",
          },
        ],
      },
    };
    render(<PrestacaoDeContasCard systemName="SigEscola" />);

    expect(screen.getByText("2.490")).toBeInTheDocument();
    expect(screen.getByText("R$ 197.248.412,27")).toBeInTheDocument();
    expect(screen.getByText("R$ 90.490.083,76")).toBeInTheDocument();
    expect(screen.getByText("3.683")).toBeInTheDocument();
  });

  it("troca o período ao selecionar outra opção", async () => {
    render(<PrestacaoDeContasCard systemName="SigEscola" />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2025.1");

    expect(lastPeriodoArg).toBe("2025.1");
  });
});
