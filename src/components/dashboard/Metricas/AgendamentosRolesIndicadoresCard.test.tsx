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

vi.mock("./AgendamentosPorDreCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="agendamentos-por-dre-card">
      {systemName ?? ""}::{bare ? "bare" : "full"}
    </div>
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

vi.mock("@/hooks/useAgendamentosRolesIndicadores", () => ({
  useAgendamentosRolesIndicadores: () => mockQueryResult,
}));

import AgendamentosRolesIndicadoresCard from "./AgendamentosRolesIndicadoresCard";

describe("<AgendamentosRolesIndicadoresCard />", () => {
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

  it("sem systemName mostra um único placeholder", () => {
    render(<AgendamentosRolesIndicadoresCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    expect(
      screen.queryByTestId("agendamentos-por-dre-card"),
    ).not.toBeInTheDocument();
  });

  it("loading mostra skeletons dos indicadores", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<AgendamentosRolesIndicadoresCard systemName="Rolê Agroecológico" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<AgendamentosRolesIndicadoresCard systemName="Rolê Agroecológico" />);

    expect(
      screen.getByText(
        "Não foi possível carregar os indicadores de agendamentos e rolês.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os 4 indicadores e propaga systemName em modo bare pro card de Agendamentos por DRE", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [{ label: "Agendamentos totais", value: 268, variant: "neutral" }],
      },
    };
    render(<AgendamentosRolesIndicadoresCard systemName="Rolê Agroecológico" />);

    expect(screen.getByText("268")).toBeInTheDocument();
    expect(screen.getByText("Agendamentos totais")).toBeInTheDocument();
    expect(screen.getByTestId("agendamentos-por-dre-card")).toHaveTextContent(
      "Rolê Agroecológico::bare",
    );
  });
});
