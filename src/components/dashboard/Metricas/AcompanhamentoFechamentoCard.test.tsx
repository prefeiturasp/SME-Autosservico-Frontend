import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AcompanhamentoFechamentoResponse, PeriodoSgpOption } from "@/types/sgpMetricas";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: (props: Readonly<React.HTMLAttributes<HTMLDivElement>>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));

vi.mock("@/components/ui/select", async () => {
  const { selectNativo } = await import("@/__mocks__/selectNativo");
  return selectNativo;
});

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

import AcompanhamentoFechamentoCard from "./AcompanhamentoFechamentoCard";

const OPCOES: PeriodoSgpOption[] = [
  { value: "fundamental_medio:2026:0:4", label: "4º Bimestre de 2026", segmento: "fundamental_medio" },
  { value: "eja:2026:2:1", label: "EJA - 1º Bim. do 2º Sem. 2026", segmento: "eja" },
];

const renderCard = (props: Partial<React.ComponentProps<typeof AcompanhamentoFechamentoCard>> = {}) =>
  render(
    <AcompanhamentoFechamentoCard
      systemName="SGP"
      periodo="fundamental_medio:2026:0:4"
      opcoes={OPCOES}
      onPeriodoChange={vi.fn()}
      {...props}
    />,
  );

describe("<AcompanhamentoFechamentoCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    renderCard({ systemName: undefined });
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("consulta o período recebido e mostra as opções do seletor", () => {
    renderCard();
    expect(screen.getByText("Acompanhamento de fechamento")).toBeInTheDocument();
    expect(ultimoPeriodo).toBe("fundamental_medio:2026:0:4");
    expect(screen.getByTestId("select-native")).toHaveValue("fundamental_medio:2026:0:4");
    expect(screen.getByRole("option", { name: "EJA - 1º Bim. do 2º Sem. 2026" })).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    renderCard();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra a mensagem do card", () => {
    mockQueryResult = { ...mockQueryResult, isError: true };
    renderCard();
    expect(
      screen.getByText("Não foi possível carregar o acompanhamento de fechamento."),
    ).toBeInTheDocument();
  });

  it("sucesso renderiza esperado e situações com percentual", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        itens: [
          { label: "Esperado para o período", value: 35179, variant: "neutral", percentage: 76.13 },
          { label: "Não iniciados", value: 8398, variant: "muted", percentage: 23.87 },
        ],
        porDre: [],
      },
    };
    renderCard();

    expect(screen.getByText("35.179")).toBeInTheDocument();
    expect(screen.getByText("76,13%")).toBeInTheDocument();
    expect(screen.getByText("23,87%")).toBeInTheDocument();
  });

  it("avisa a seção ao trocar o período", async () => {
    const onPeriodoChange = vi.fn();
    renderCard({ onPeriodoChange });

    await userEvent.selectOptions(screen.getByTestId("select-native"), "eja:2026:2:1");

    expect(onPeriodoChange).toHaveBeenCalledWith("eja:2026:2:1");
  });
});
