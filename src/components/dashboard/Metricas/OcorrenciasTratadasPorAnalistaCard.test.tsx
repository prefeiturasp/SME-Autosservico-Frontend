import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnalistaTableRow } from "@/types/metricas";

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
  data?: AnalistaTableRow[];
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

vi.mock("@/hooks/useOcorrenciasTratadasPorAnalista", () => ({
  useOcorrenciasTratadasPorAnalista: () => mockQueryResult,
}));

import OcorrenciasTratadasPorAnalistaCard from "./OcorrenciasTratadasPorAnalistaCard";

describe("<OcorrenciasTratadasPorAnalistaCard />", () => {
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
    render(<OcorrenciasTratadasPorAnalistaCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    expect(
      screen.getByText("Ocorrências tratadas por analista"),
    ).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciasTratadasPorAnalistaCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciasTratadasPorAnalistaCard systemName="GIPE" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as ocorrências tratadas por analista.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as 3 colunas com as linhas visíveis, truncando as demais atrás do 'Ver mais analistas'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { analista: "Ana Luzia Souza", ocorrenciasTratadas: 180, tempoMedio: "4,8 dias" },
        { analista: "Juliana Prado", ocorrenciasTratadas: 144, tempoMedio: "5,6 dias" },
        { analista: "Vitor Barbosa", ocorrenciasTratadas: 138, tempoMedio: "6,2 dias" },
        { analista: "Tamires Serra", ocorrenciasTratadas: 128, tempoMedio: "7,1 dias" },
        {
          analista: "Pedro Henrique Costa",
          ocorrenciasTratadas: 95,
          tempoMedio: "7,9 dias",
        },
        { analista: "Rafael Nogueira", ocorrenciasTratadas: 82, tempoMedio: "8,4 dias" },
      ],
    };
    render(<OcorrenciasTratadasPorAnalistaCard systemName="GIPE" />);

    expect(screen.getByText("Analista")).toBeInTheDocument();
    expect(screen.getByText("Ocorrências tratadas")).toBeInTheDocument();
    expect(screen.getByText("Tempo médio")).toBeInTheDocument();
    expect(screen.getByText("Pedro Henrique Costa")).toBeInTheDocument();
    expect(screen.getByText("95")).toBeInTheDocument();
    expect(screen.getByText("7,9 dias")).toBeInTheDocument();
    expect(screen.queryByText("Rafael Nogueira")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais analistas"));
    expect(screen.getByText("Rafael Nogueira")).toBeInTheDocument();
  });
});
