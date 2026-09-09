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

vi.mock("@/hooks/useOcorrenciasPorPeriodoLetivo", () => ({
  useOcorrenciasPorPeriodoLetivo: () => mockQueryResult,
}));

import OcorrenciasPorPeriodoLetivoCard from "./OcorrenciasPorPeriodoLetivoCard";

describe("<OcorrenciasPorPeriodoLetivoCard />", () => {
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
    render(<OcorrenciasPorPeriodoLetivoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciasPorPeriodoLetivoCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciasPorPeriodoLetivoCard systemName="GIPE" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as ocorrências por período letivo.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza todas as linhas sem truncar, sem botão 'ver mais'", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "1º Bimestre", value: 298 },
        { label: "2º Bimestre", value: 342 },
        { label: "3º Bimestre", value: 386 },
        { label: "4º Bimestre", value: 258 },
        { label: "Geral", value: 1284 },
      ],
    };
    render(<OcorrenciasPorPeriodoLetivoCard systemName="GIPE" />);

    expect(screen.getByText("Geral")).toBeInTheDocument();
    expect(screen.queryByText("Ver mais")).not.toBeInTheDocument();
  });
});
