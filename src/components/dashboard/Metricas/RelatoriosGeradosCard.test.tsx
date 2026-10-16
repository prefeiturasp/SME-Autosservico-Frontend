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

vi.mock("@/hooks/useRelatoriosGerados", () => ({
  useRelatoriosGerados: () => mockQueryResult,
}));

import RelatoriosGeradosCard from "./RelatoriosGeradosCard";

describe("<RelatoriosGeradosCard />", () => {
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
    render(<RelatoriosGeradosCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<RelatoriosGeradosCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<RelatoriosGeradosCard systemName="Sigla" />);

    expect(
      screen.getByText("Não foi possível carregar os relatórios gerados."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os 10 itens mockados num grid de 4 colunas", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Laudas de Vagas", value: 412, variant: "neutral" },
          { label: "Relatório de Vagas", value: 298, variant: "neutral" },
          { label: "Laudas de Convocação", value: 386, variant: "neutral" },
          { label: "Súmulas de Reconvocados", value: 96, variant: "neutral" },
          { label: "Súmulas de Escolhas", value: 342, variant: "neutral" },
          { label: "Súmulas de Não Escolhas", value: 154, variant: "neutral" },
          {
            label: "Listagem de Escolhas por DRE",
            value: 210,
            variant: "neutral",
          },
          {
            label: "Resultados de Escolha de Vagas",
            value: 186,
            variant: "neutral",
          },
          { label: "Atas de Escolha", value: 42, variant: "neutral" },
          {
            label: "Listas de Candidatos por Sessão",
            value: 298,
            variant: "neutral",
          },
        ],
      },
    };
    render(<RelatoriosGeradosCard systemName="Sigla" />);

    expect(screen.getByText("412")).toBeInTheDocument();
    expect(screen.getByText("Laudas de Vagas")).toBeInTheDocument();
    expect(screen.getByText("42").closest("div.grid")).toHaveClass(
      "grid-cols-4",
    );
  });
});
