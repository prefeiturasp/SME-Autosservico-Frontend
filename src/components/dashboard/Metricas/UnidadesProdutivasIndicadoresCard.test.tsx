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

vi.mock("./UpsQueReceberamVisitaCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="ups-que-receberam-visita-card">
      {systemName ?? ""}::{bare ? "bare" : "full"}
    </div>
  ),
}));

vi.mock("./PerfilResponsaveisUpsCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="perfil-responsaveis-ups-card">
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

vi.mock("@/hooks/useUnidadesProdutivasIndicadores", () => ({
  useUnidadesProdutivasIndicadores: () => mockQueryResult,
}));

import UnidadesProdutivasIndicadoresCard from "./UnidadesProdutivasIndicadoresCard";

describe("<UnidadesProdutivasIndicadoresCard />", () => {
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
    render(<UnidadesProdutivasIndicadoresCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    expect(
      screen.queryByTestId("ups-que-receberam-visita-card"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("perfil-responsaveis-ups-card"),
    ).not.toBeInTheDocument();
  });

  it("loading mostra skeletons dos indicadores", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UnidadesProdutivasIndicadoresCard systemName="Rolê Agroecológico" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UnidadesProdutivasIndicadoresCard systemName="Rolê Agroecológico" />);

    expect(
      screen.getByText(
        "Não foi possível carregar os indicadores de unidades produtivas.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os 3 indicadores e a lista de UPs no mesmo grid, em modo bare", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "UPs cadastradas para o projeto", value: 63, variant: "neutral" },
          {
            label: "UPs em áreas de preservação ambiental e/ou mananciais",
            value: 18,
            variant: "warning",
          },
          { label: "UPs que receberam visita", value: 47, variant: "neutral" },
        ],
      },
    };
    render(<UnidadesProdutivasIndicadoresCard systemName="Rolê Agroecológico" />);

    expect(screen.getByText("63")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(
      screen.getByTestId("ups-que-receberam-visita-card"),
    ).toHaveTextContent("Rolê Agroecológico::bare");
    expect(
      screen.getByTestId("perfil-responsaveis-ups-card"),
    ).toHaveTextContent("Rolê Agroecológico::bare");
  });

  it("as caixas de indicadores ficam com altura máxima de 74px, do tamanho das outras", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "UPs cadastradas para o projeto", value: 63, variant: "neutral" },
          {
            label: "UPs em áreas de preservação ambiental e/ou mananciais",
            value: 18,
            variant: "warning",
          },
          { label: "UPs que receberam visita", value: 47, variant: "neutral" },
        ],
      },
    };
    render(<UnidadesProdutivasIndicadoresCard systemName="Rolê Agroecológico" />);

    expect(screen.getByText("63").parentElement).toHaveClass("max-h-[74px]");
    expect(screen.getByText("18").parentElement).toHaveClass("max-h-[74px]");
    expect(screen.getByText("47").parentElement).toHaveClass("max-h-[74px]");
  });
});
