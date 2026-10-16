import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StatItem } from "@/types/metricas";

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
  data?: StatItem[];
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
let lastBimestreArg: string | undefined;

vi.mock("@/hooks/useAcompanhamentoFechamento", () => ({
  useAcompanhamentoFechamento: ({ bimestre }: { bimestre: string }) => {
    lastBimestreArg = bimestre;
    return mockQueryResult;
  },
}));

import AcompanhamentoFechamentoCard from "./AcompanhamentoFechamentoCard";

describe("<AcompanhamentoFechamentoCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastBimestreArg = undefined;
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra placeholder", () => {
    render(<AcompanhamentoFechamentoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("renderiza o título e usa '2026-2' como bimestre inicial", () => {
    render(<AcompanhamentoFechamentoCard systemName="SGP" />);
    expect(screen.getByText("Acompanhamento de fechamento")).toBeInTheDocument();
    expect(lastBimestreArg).toBe("2026-2");
    expect(screen.getByTestId("select-native")).toHaveValue("2026-2");
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<AcompanhamentoFechamentoCard systemName="SGP" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<AcompanhamentoFechamentoCard systemName="SGP" />);

    expect(
      screen.getByText("Não foi possível carregar o acompanhamento de fechamento."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os 4 indicadores", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Não iniciados", value: 8398, variant: "muted" },
        { label: "Processado com sucesso", value: 7530, variant: "success" },
        { label: "Processado com pendências", value: 6853, variant: "warning" },
        { label: "Processado com erro", value: 12398, variant: "danger" },
      ],
    };
    render(<AcompanhamentoFechamentoCard systemName="SGP" />);

    expect(screen.getByText("8.398")).toBeInTheDocument();
    expect(screen.getByText("7.530")).toBeInTheDocument();
    expect(screen.getByText("6.853")).toBeInTheDocument();
    expect(screen.getByText("12.398")).toBeInTheDocument();
  });

  it("troca o bimestre ao selecionar outra opção", async () => {
    render(<AcompanhamentoFechamentoCard systemName="SGP" />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2026-1");

    expect(lastBimestreArg).toBe("2026-1");
  });
});
