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

vi.mock("@/hooks/useOcorrenciasPorPrestador", () => ({
  useOcorrenciasPorPrestador: () => mockQueryResult,
}));

import OcorrenciasPorPrestadorCard from "./OcorrenciasPorPrestadorCard";

describe("<OcorrenciasPorPrestadorCard />", () => {
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
    render(<OcorrenciasPorPrestadorCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciasPorPrestadorCard systemName="Limpeza" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciasPorPrestadorCard systemName="Limpeza" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as ocorrências por prestador.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os prestadores visíveis e trunca os demais atrás do 'Ver mais prestadores'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Prestador 1", value: 42 },
        { label: "Prestador 2", value: 32 },
        { label: "Prestador 3", value: 28 },
        { label: "Prestador 4", value: 25 },
        { label: "Prestador 5", value: 19 },
        { label: "Prestador 6", value: 14 },
      ],
    };
    render(<OcorrenciasPorPrestadorCard systemName="Limpeza" />);

    expect(screen.getByText("Prestador 5")).toBeInTheDocument();
    expect(screen.queryByText("Prestador 6")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais prestadores"));
    expect(screen.getByText("Prestador 6")).toBeInTheDocument();
  });
});
