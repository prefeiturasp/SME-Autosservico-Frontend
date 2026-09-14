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

vi.mock("@/hooks/useValoresPagosPorPrestador", () => ({
  useValoresPagosPorPrestador: () => mockQueryResult,
}));

import ValoresPagosPorPrestadorCard from "./ValoresPagosPorPrestadorCard";

describe("<ValoresPagosPorPrestadorCard />", () => {
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
    render(<ValoresPagosPorPrestadorCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ValoresPagosPorPrestadorCard systemName="Limpeza" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ValoresPagosPorPrestadorCard systemName="Limpeza" />);

    expect(
      screen.getByText(
        "Não foi possível carregar os valores pagos por prestador.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os valores formatados como moeda, truncando atrás do 'Ver mais prestadores'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Prestador 1", value: 4350 },
        { label: "Prestador 2", value: 3350 },
        { label: "Prestador 3", value: 3000 },
        { label: "Prestador 4", value: 2890 },
        { label: "Prestador 5", value: 1000 },
        { label: "Prestador 6", value: 820 },
      ],
    };
    render(<ValoresPagosPorPrestadorCard systemName="Limpeza" />);

    expect(screen.getByText("R$ 4.350,00")).toBeInTheDocument();
    expect(screen.queryByText("Prestador 6")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais prestadores"));
    expect(screen.getByText("R$ 820,00")).toBeInTheDocument();
  });
});
