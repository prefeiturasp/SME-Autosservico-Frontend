import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SerieAcessosSgpResponse } from "@/types/sgpControleAcessos";

vi.mock("recharts", async () => {
  const { rechartsFalso } = await import("@/__mocks__/rechartsFalso");
  return rechartsFalso;
});

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

type MockQueryResult = {
  data?: SerieAcessosSgpResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult;
let ultimaGranularidade: string | undefined;

vi.mock("@/hooks/useControleAcessosSgp", () => ({
  useSerieAcessosSgp: ({ granularidade }: { granularidade: string }) => {
    ultimaGranularidade = granularidade;
    return mockQueryResult;
  },
}));

import AcompanhamentoAcessosCard from "./AcompanhamentoAcessosCard";

const SERIE: SerieAcessosSgpResponse = {
  granularidade: "hora",
  pontos: [
    { label: "08:00", total: 5100, emFilaMax: 100, filaAtiva: true },
    { label: "09:00", total: 4000, emFilaMax: 0, filaAtiva: false },
  ],
};

describe("<AcompanhamentoAcessosCard />", () => {
  beforeEach(() => {
    ultimaGranularidade = undefined;
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra placeholder", () => {
    render(<AcompanhamentoAcessosCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeleton", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<AcompanhamentoAcessosCard systemName="SGP" />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("erro mostra mensagem e tenta de novo", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<AcompanhamentoAcessosCard systemName="SGP" />);

    await userEvent.click(screen.getByRole("button", { name: /Tentar novamente/ }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("série vazia (cache frio) avisa que aguarda os dados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { granularidade: "hora", pontos: [] },
    };
    render(<AcompanhamentoAcessosCard systemName="SGP" />);
    expect(screen.getByText("Aguardando os dados de acessos.")).toBeInTheDocument();
  });

  it("desenha a linha, marca a fila em vermelho e mostra o tooltip", () => {
    mockQueryResult = { ...mockQueryResult, data: SERIE };
    const { container } = render(<AcompanhamentoAcessosCard systemName="SGP" />);

    expect(ultimaGranularidade).toBe("hora");
    expect(screen.getByTestId("line-chart")).toHaveAttribute("data-pontos", "2");
    const pontos = container.querySelectorAll("circle");
    expect(pontos[0]).toHaveAttribute("fill", "#970C0C");
    expect(pontos[1]).toHaveAttribute("fill", "#3B82F6");
    expect(screen.getByTestId("y-tick")).toHaveTextContent("6 mil");
    const tooltip = screen.getByTestId("chart-tooltip");
    expect(tooltip).toHaveTextContent("Total de acessos: 5.100");
    expect(tooltip).toHaveTextContent("Fila ativa (máx. 100 em espera)");
    expect(screen.getByText("Ativação da fila de espera")).toBeInTheDocument();
  });

  it("troca a granularidade pelo alternador", async () => {
    mockQueryResult = { ...mockQueryResult, data: SERIE };
    render(<AcompanhamentoAcessosCard systemName="SGP" />);

    await userEvent.click(screen.getByLabelText("Mês"));

    expect(ultimaGranularidade).toBe("mes");
    expect(screen.getByLabelText("Mês")).toBeChecked();
  });
});
