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

vi.mock("@/hooks/useConvocacoesPorAno", () => ({
  useConvocacoesPorAno: () => mockQueryResult,
}));

import ConvocacoesPorAnoCard from "./ConvocacoesPorAnoCard";

describe("<ConvocacoesPorAnoCard />", () => {
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
    render(<ConvocacoesPorAnoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ConvocacoesPorAnoCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ConvocacoesPorAnoCard systemName="Sigla" />);

    expect(
      screen.getByText("Não foi possível carregar as convocações por ano."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza o cabeçalho 'Ano' (corrigido) e as linhas visíveis, truncando as demais atrás do 'Ver mais'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "2026", value: 542 },
        { label: "2025", value: 654 },
        { label: "2024", value: 483 },
        { label: "2023", value: 452 },
        { label: "2022", value: 348 },
        { label: "2021", value: 298 },
        { label: "2020", value: 198 },
        { label: "2019", value: 98 },
      ],
    };
    render(<ConvocacoesPorAnoCard systemName="Sigla" />);

    expect(screen.getByText("Ano")).toBeInTheDocument();
    expect(screen.getByText("2022")).toBeInTheDocument();
    expect(screen.queryByText("2021")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais"));
    expect(screen.getByText("2021")).toBeInTheDocument();
  });
});
