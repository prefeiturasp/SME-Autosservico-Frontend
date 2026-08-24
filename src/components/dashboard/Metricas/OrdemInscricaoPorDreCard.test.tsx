import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TableRow } from "@/types/metricas";

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
  data?: TableRow[];
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
let lastMonthArg: string | undefined;

vi.mock("@/hooks/useOrdemInscricaoPorDre", () => ({
  useOrdemInscricaoPorDre: ({ month }: { month: string }) => {
    lastMonthArg = month;
    return mockQueryResult;
  },
}));

import OrdemInscricaoPorDreCard from "./OrdemInscricaoPorDreCard";

const DRE_ROWS: TableRow[] = [
  { label: "Capela do Socorro", value: 15 },
  { label: "Freguesia/Brasilândia", value: 11 },
  { label: "Ipiranga", value: 12 },
  { label: "Butantã", value: 9 },
  { label: "Guaianases", value: 8 },
  { label: "Campo Limpo", value: 7 },
];

describe("<OrdemInscricaoPorDreCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastMonthArg = undefined;
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra placeholder", () => {
    render(<OrdemInscricaoPorDreCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("usa 'Julho/2026' (2026-07) como mês inicial", () => {
    render(<OrdemInscricaoPorDreCard systemName="Intranet" />);
    expect(lastMonthArg).toBe("2026-07");
    expect(screen.getByTestId("select-native")).toHaveValue("2026-07");
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OrdemInscricaoPorDreCard systemName="Intranet" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as inscrições em ordens de inscrição por DRE."
      )
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("mostra as 5 primeiras DREs e expande com 'Ver mais DREs'", async () => {
    mockQueryResult = { ...mockQueryResult, data: DRE_ROWS };
    render(<OrdemInscricaoPorDreCard systemName="Intranet" />);

    expect(screen.getByText("Guaianases")).toBeInTheDocument();
    expect(screen.queryByText("Campo Limpo")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais DREs"));

    expect(screen.getByText("Campo Limpo")).toBeInTheDocument();
  });

  it("troca o mês ao selecionar outra opção", async () => {
    render(<OrdemInscricaoPorDreCard systemName="Intranet" />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2026-03");

    expect(lastMonthArg).toBe("2026-03");
  });
});
