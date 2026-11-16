import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AcompanhamentoFechamentoResponse } from "@/types/sgpMetricas";

vi.mock("recharts", async () => {
  const { rechartsFalso } = await import("@/__mocks__/rechartsFalso");
  return rechartsFalso;
});

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

type MockQueryResult = {
  data?: AcompanhamentoFechamentoResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult;
let ultimoPeriodo: string | undefined;

vi.mock("@/hooks/useAcompanhamentoFechamento", () => ({
  useAcompanhamentoFechamento: ({ periodo }: { periodo: string }) => {
    ultimoPeriodo = periodo;
    return mockQueryResult;
  },
}));

import FechamentoPorDreCard from "./FechamentoPorDreCard";

const DADOS: AcompanhamentoFechamentoResponse = {
  itens: [],
  porDre: [
    {
      dre: "BT",
      previsto: 3156,
      naoIniciados: 1736,
      processadoSucesso: 980,
      processadoPendencias: 240,
      processadoErro: 200,
    },
    {
      dre: "CL",
      previsto: 0,
      naoIniciados: 0,
      processadoSucesso: 0,
      processadoPendencias: 0,
      processadoErro: 0,
    },
  ],
};

const renderCard = (systemName: string | undefined = "SGP") =>
  render(
    <FechamentoPorDreCard
      systemName={systemName}
      periodo="eja:2026:2:1"
      titulo="Fechamentos Não iniciados por DRE"
      situacao="naoIniciados"
      legenda="Não iniciados"
      cor="#1E3A8A"
    />,
  );

describe("<FechamentoPorDreCard />", () => {
  beforeEach(() => {
    ultimoPeriodo = undefined;
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra placeholder", () => {
    renderCard("");
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeleton", () => {
    mockQueryResult = { ...mockQueryResult, isFetching: true };
    renderCard();
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("erro mostra mensagem e tenta de novo", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    renderCard();

    expect(
      screen.getByText("Não foi possível carregar os fechamentos por DRE."),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Tentar novamente/ }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sem DREs no período, avisa", () => {
    mockQueryResult = { ...mockQueryResult, data: { itens: [], porDre: [] } };
    renderCard();
    expect(screen.getByText("Sem fechamentos no período.")).toBeInTheDocument();
  });

  it("desenha previstos x situação, com rótulos, cor, legenda e tooltip", () => {
    mockQueryResult = { ...mockQueryResult, data: DADOS };
    renderCard();

    expect(ultimoPeriodo).toBe("eja:2026:2:1");
    expect(screen.getByText("Fechamentos Não iniciados por DRE")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toHaveAttribute("data-pontos", "2");
    expect(screen.getByTestId("bar-valor")).toHaveAttribute("data-fill", "#1E3A8A");
    expect(screen.getAllByTestId("label-previsto")[0]).toHaveTextContent("3,2 mil");
    expect(screen.getAllByTestId("label-percentual").map((l) => l.textContent)).toEqual([
      "55%",
      "0%",
    ]);
    expect(screen.getByText("Previstos")).toBeInTheDocument();
    const tooltip = screen.getByTestId("chart-tooltip");
    expect(tooltip).toHaveTextContent("BT");
    expect(tooltip).toHaveTextContent("Total previsto: 3.156");
    expect(tooltip).toHaveTextContent("Total não iniciados: 1.736");
  });
});
