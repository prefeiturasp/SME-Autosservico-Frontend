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

vi.mock("@/hooks/useRelatoriosExportadosPorFormato", () => ({
  useRelatoriosExportadosPorFormato: () => mockQueryResult,
}));

import RelatoriosExportadosPorFormatoCard from "./RelatoriosExportadosPorFormatoCard";

describe("<RelatoriosExportadosPorFormatoCard />", () => {
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
    render(<RelatoriosExportadosPorFormatoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<RelatoriosExportadosPorFormatoCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<RelatoriosExportadosPorFormatoCard systemName="Sigla" />);

    expect(
      screen.getByText(
        "Não foi possível carregar os relatórios exportados por formato.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens mockados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Excel", value: 1821, variant: "success" },
          { label: "PDF", value: 3860, variant: "danger" },
          { label: "Word", value: 890, variant: "neutral" },
        ],
      },
    };
    render(<RelatoriosExportadosPorFormatoCard systemName="Sigla" />);

    expect(screen.getByText("1.821")).toBeInTheDocument();
    expect(screen.getByText("3.860")).toBeInTheDocument();
    expect(screen.getByText("890")).toBeInTheDocument();
  });
});
