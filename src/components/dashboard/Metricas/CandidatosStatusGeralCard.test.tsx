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

vi.mock("@/hooks/useCandidatosStatusGeral", () => ({
  useCandidatosStatusGeral: () => mockQueryResult,
}));

import CandidatosStatusGeralCard from "./CandidatosStatusGeralCard";

describe("<CandidatosStatusGeralCard />", () => {
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
    render(<CandidatosStatusGeralCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<CandidatosStatusGeralCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<CandidatosStatusGeralCard systemName="Sigla" />);

    expect(
      screen.getByText("Não foi possível carregar o status geral de candidatos."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os 8 itens mockados num grid de 4 colunas", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Candidatos habilitados", value: 3240, variant: "neutral" },
          { label: "Candidatos convocados", value: 1980, variant: "neutral" },
          { label: "Candidatos reconvocados", value: 342, variant: "neutral" },
          {
            label: "Candidatos que realizaram escolha",
            value: 1640,
            variant: "success",
          },
          {
            label: "Candidatos que não realizaram escolha",
            value: 298,
            variant: "danger",
          },
          { label: "Pendentes de escolha", value: 42, variant: "warning" },
          { label: "Candidatos autorizados", value: 1720, variant: "neutral" },
          {
            label: "Candidatos em lista específica",
            value: 186,
            variant: "normal",
          },
        ],
      },
    };
    render(<CandidatosStatusGeralCard systemName="Sigla" />);

    expect(screen.getByText("3.240")).toBeInTheDocument();
    expect(screen.getByText("186").closest("div.grid")).toHaveClass(
      "grid-cols-4",
    );
  });
});
