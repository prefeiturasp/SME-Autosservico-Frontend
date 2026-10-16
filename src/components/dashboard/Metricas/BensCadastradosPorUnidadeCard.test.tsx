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

vi.mock("@/hooks/useBensCadastradosPorUnidade", () => ({
  useBensCadastradosPorUnidade: () => mockQueryResult,
}));

import BensCadastradosPorUnidadeCard from "./BensCadastradosPorUnidadeCard";

describe("<BensCadastradosPorUnidadeCard />", () => {
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
    render(<BensCadastradosPorUnidadeCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<BensCadastradosPorUnidadeCard systemName="Bens Físicos" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<BensCadastradosPorUnidadeCard systemName="Bens Físicos" />);

    expect(
      screen.getByText(
        "Não foi possível carregar os bens cadastrados por unidade administrativa.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as unidades visíveis e trunca as demais atrás do 'Ver mais'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "SME/COTIC", value: 6247 },
        { label: "SME/COPED", value: 4123 },
        { label: "SME/COPLAN", value: 3560 },
        { label: "SME/CODAE", value: 1870 },
        { label: "SME/ASCOM", value: 1328 },
        { label: "SME/COGEP", value: 980 },
      ],
    };
    render(<BensCadastradosPorUnidadeCard systemName="Bens Físicos" />);

    expect(screen.getByText("SME/COTIC")).toBeInTheDocument();
    expect(screen.getByText("SME/ASCOM")).toBeInTheDocument();
    expect(screen.queryByText("SME/COGEP")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais"));
    expect(screen.getByText("SME/COGEP")).toBeInTheDocument();
  });
});
