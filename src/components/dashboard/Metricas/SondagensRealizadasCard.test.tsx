import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ProgressStatsResponse } from "@/types/metricas";

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
  data?: ProgressStatsResponse;
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

vi.mock("@/hooks/useSondagensRealizadas", () => ({
  useSondagensRealizadas: ({ bimestre }: { bimestre: string }) => {
    lastBimestreArg = bimestre;
    return mockQueryResult;
  },
}));

import SondagensRealizadasCard from "./SondagensRealizadasCard";

describe("<SondagensRealizadasCard />", () => {
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
    render(<SondagensRealizadasCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("renderiza o título e usa '2026-2' como bimestre inicial", () => {
    render(<SondagensRealizadasCard systemName="SGP" />);
    expect(screen.getByText("Sondagens realizadas")).toBeInTheDocument();
    expect(lastBimestreArg).toBe("2026-2");
    expect(screen.getByTestId("select-native")).toHaveValue("2026-2");
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<SondagensRealizadasCard systemName="SGP" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<SondagensRealizadasCard systemName="SGP" />);

    expect(
      screen.getByText("Não foi possível carregar as sondagens realizadas."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os indicadores e a barra de progresso azul-marinho até 100%", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Sondagens realizadas", value: 1243, variant: "neutral" },
          { label: "Sondagens esperadas", value: 2683, variant: "muted" },
        ],
        progressPercentage: 62.3,
      },
    };
    render(<SondagensRealizadasCard systemName="SGP" />);

    expect(screen.getByText("1.243")).toBeInTheDocument();
    expect(screen.getByText("2.683")).toBeInTheDocument();
    expect(screen.getByText("62,3%")).toBeInTheDocument();
    expect(screen.getByTestId("progress-stats-fill")).toHaveStyle({
      backgroundColor: "#1E3A8A",
    });
  });

  it("troca o bimestre ao selecionar outra opção", async () => {
    render(<SondagensRealizadasCard systemName="SGP" />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2026-1");

    expect(lastBimestreArg).toBe("2026-1");
  });
});
