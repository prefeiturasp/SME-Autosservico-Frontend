import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ProvasResponse } from "@/types/metricas";

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
  data?: ProvasResponse;
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

vi.mock("@/hooks/useProvas", () => ({
  useProvas: ({ bimestre }: { bimestre: string }) => {
    lastBimestreArg = bimestre;
    return mockQueryResult;
  },
}));

import ProvasCard from "./ProvasCard";

describe("<ProvasCard />", () => {
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
    render(<ProvasCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("renderiza o título 'Provas' e usa '2026-2' como bimestre inicial", () => {
    render(<ProvasCard systemName="Serap" />);
    expect(screen.getByText("Provas")).toBeInTheDocument();
    expect(lastBimestreArg).toBe("2026-2");
    expect(screen.getByTestId("select-native")).toHaveValue("2026-2");
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ProvasCard systemName="Serap" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ProvasCard systemName="Serap" />);

    expect(
      screen.getByText("Não foi possível carregar os dados de provas.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os indicadores e a barra de progresso", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Total de provas", value: 8398, variant: "neutral" },
          { label: "Provas iniciadas hoje", value: 7530, variant: "muted" },
          { label: "Provas não finalizadas", value: 1853, variant: "warning" },
          { label: "Provas finalizadas", value: 6398, variant: "success" },
        ],
        progressPercentage: 96.3,
      },
    };
    render(<ProvasCard systemName="Serap" />);

    expect(screen.getByText("8.398")).toBeInTheDocument();
    expect(screen.getByText("Total de provas")).toBeInTheDocument();
    expect(screen.getByText("7.530")).toBeInTheDocument();
    expect(screen.getByText("1.853")).toBeInTheDocument();
    expect(screen.getByText("6.398")).toBeInTheDocument();
    expect(screen.getByText("96,3%")).toBeInTheDocument();
    expect(screen.getByTestId("provas-progress-fill")).toHaveStyle({
      width: "96.3%",
    });
  });

  it("troca o bimestre ao selecionar outra opção", async () => {
    render(<ProvasCard systemName="Serap" />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2026-1");

    expect(lastBimestreArg).toBe("2026-1");
  });
});
