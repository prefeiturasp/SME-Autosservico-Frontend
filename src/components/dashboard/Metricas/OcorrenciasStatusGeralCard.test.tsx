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

vi.mock("@/hooks/useOcorrenciasStatusGeral", () => ({
  useOcorrenciasStatusGeral: () => mockQueryResult,
}));

import OcorrenciasStatusGeralCard from "./OcorrenciasStatusGeralCard";

describe("<OcorrenciasStatusGeralCard />", () => {
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
    render(<OcorrenciasStatusGeralCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciasStatusGeralCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciasStatusGeralCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar o status geral de ocorrências."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens mockados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Cadastrados", value: 1284, variant: "neutral" },
          { label: "Abertas", value: 186, variant: "success" },
          { label: "Em andamento", value: 312, variant: "warning" },
          { label: "Finalizadas", value: 786, variant: "success" },
        ],
      },
    };
    render(<OcorrenciasStatusGeralCard systemName="GIPE" />);

    expect(screen.getByText("1.284")).toBeInTheDocument();
    expect(screen.getByText("186")).toBeInTheDocument();
    expect(screen.getByText("312")).toBeInTheDocument();
    expect(screen.getByText("786")).toBeInTheDocument();
  });
});
