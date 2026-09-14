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

vi.mock("@/hooks/useConvocacoesPorCargo", () => ({
  useConvocacoesPorCargo: () => mockQueryResult,
}));

import ConvocacoesPorCargoCard from "./ConvocacoesPorCargoCard";

describe("<ConvocacoesPorCargoCard />", () => {
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
    render(<ConvocacoesPorCargoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ConvocacoesPorCargoCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ConvocacoesPorCargoCard systemName="Sigla" />);

    expect(
      screen.getByText("Não foi possível carregar as convocações por cargo."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza o cabeçalho 'Prestador' e as linhas visíveis", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "PROF.ENS.FUND.II E MED.-ARTES", value: 13 },
        { label: "PROF.ENS.FUND.II E MED.-BIOLOGIA", value: 8 },
        { label: "PROF.ENS.FUND.II E MED.-ED.FÍSICA", value: 8 },
        { label: "PROF.ENS.FUND.II E MED.-MATEMATICA", value: 5 },
        { label: "PROF.ENS.FUND.II E MED.-QUIMICA", value: 2 },
        { label: "PROF.ENS.FUND.II E MED.-GEOGRAFIA", value: 2 },
        { label: "PROF.ENS.FUND.II E MED.-HISTÓRIA", value: 1 },
      ],
    };
    render(<ConvocacoesPorCargoCard systemName="Sigla" />);

    expect(screen.getByText("Prestador")).toBeInTheDocument();
    expect(
      screen.getByText("PROF.ENS.FUND.II E MED.-QUIMICA"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("PROF.ENS.FUND.II E MED.-GEOGRAFIA"),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais"));
    expect(
      screen.getByText("PROF.ENS.FUND.II E MED.-GEOGRAFIA"),
    ).toBeInTheDocument();
  });
});
