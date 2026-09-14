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

vi.mock("@/hooks/usePerfisMaisUtilizados", () => ({
  usePerfisMaisUtilizados: () => mockQueryResult,
}));

import PerfisMaisUtilizadosCard from "./PerfisMaisUtilizadosCard";

describe("<PerfisMaisUtilizadosCard />", () => {
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
    render(<PerfisMaisUtilizadosCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<PerfisMaisUtilizadosCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<PerfisMaisUtilizadosCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar os perfis mais utilizados."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza todas as linhas sem truncar, sem botão 'ver mais'", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Diretor", value: 681 },
        { label: "GIPE admin", value: 598 },
        { label: "Ponto focal admin", value: 467 },
        { label: "GIPE", value: 342 },
        { label: "Ponto focal", value: 244 },
        { label: "Assistente de direção", value: 130 },
      ],
    };
    render(<PerfisMaisUtilizadosCard systemName="GIPE" />);

    expect(screen.getByText("Assistente de direção")).toBeInTheDocument();
    expect(screen.queryByText("Ver mais")).not.toBeInTheDocument();
  });
});
