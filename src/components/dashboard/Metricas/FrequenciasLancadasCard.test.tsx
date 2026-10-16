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

vi.mock("@/hooks/useFrequenciasLancadas", () => ({
  useFrequenciasLancadas: ({ bimestre }: { bimestre: string }) => {
    lastBimestreArg = bimestre;
    return mockQueryResult;
  },
}));

import FrequenciasLancadasCard from "./FrequenciasLancadasCard";

describe("<FrequenciasLancadasCard />", () => {
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
    render(<FrequenciasLancadasCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("renderiza o título e usa '2026-2' como bimestre inicial", () => {
    render(<FrequenciasLancadasCard systemName="SGP" />);
    expect(screen.getByText("Frequências lançadas")).toBeInTheDocument();
    expect(lastBimestreArg).toBe("2026-2");
    expect(screen.getByTestId("select-native")).toHaveValue("2026-2");
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<FrequenciasLancadasCard systemName="SGP" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<FrequenciasLancadasCard systemName="SGP" />);

    expect(
      screen.getByText("Não foi possível carregar as frequências lançadas."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os indicadores e a barra de progresso laranja acima de 100%", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Lançadas", value: 18432, variant: "neutral" },
          { label: "Esperadas", value: 21760, variant: "muted" },
        ],
        progressPercentage: 122.3,
      },
    };
    render(<FrequenciasLancadasCard systemName="SGP" />);

    expect(screen.getByText("18.432")).toBeInTheDocument();
    expect(screen.getByText("21.760")).toBeInTheDocument();
    expect(screen.getByText("122,3%")).toBeInTheDocument();
    expect(screen.getByTestId("progress-stats-fill")).toHaveStyle({
      backgroundColor: "#1E3A8A",
    });
    expect(screen.getByTestId("progress-stats-fill-over")).toHaveStyle({
      backgroundColor: "#F59E0B",
    });
  });

  it("troca o bimestre ao selecionar outra opção", async () => {
    render(<FrequenciasLancadasCard systemName="SGP" />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2026-1");

    expect(lastBimestreArg).toBe("2026-1");
  });
});
