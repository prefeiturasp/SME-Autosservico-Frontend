import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ControleAcessosSgpResponse } from "@/types/sgpControleAcessos";

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { readonly children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { readonly children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { readonly children: React.ReactNode }) => (
    <div data-testid="tooltip-tempo">{children}</div>
  ),
  TooltipArrow: () => null,
}));

type MockQueryResult = {
  data?: ControleAcessosSgpResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult;

vi.mock("@/hooks/useControleAcessosSgp", () => ({
  useControleAcessosSgp: () => mockQueryResult,
}));

import ControleAcessosKpis from "./ControleAcessosKpis";

const COM_FILA: ControleAcessosSgpResponse = {
  atualizadoEm: "2026-11-10T09:30:00-03:00",
  limiteConexoes: 5000,
  conectados: 5000,
  emFila: 1467,
  filaIniciadaEm: "2026-11-10T07:41:00-03:00",
  tempoEspera: {
    mediaSegundos: 0.122,
    posicaoMedia: 8,
    testes: 3,
    atingiuLimiteTeste: false,
  },
};

describe("<ControleAcessosKpis />", () => {
  beforeEach(() => {
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("renderiza os 4 cards com fila ativa em vermelho", () => {
    mockQueryResult = { ...mockQueryResult, data: COM_FILA };
    render(<ControleAcessosKpis systemName="SGP" />);

    expect(screen.getByText("Limite de Conexões (sem fila)")).toBeInTheDocument();
    expect(screen.getByText("Fila de acessos ativa")).toBeInTheDocument();
    expect(screen.getByText("(100,00%)")).toBeInTheDocument();
    expect(screen.getByText("Não restam conexões")).toBeInTheDocument();
    expect(screen.getByText("1.467")).toHaveClass("text-[#970C0C]");
    expect(screen.getByText("Fila iniciou: 07:41 - 10/11/2026")).toBeInTheDocument();
    expect(screen.getByText("122 ms")).toBeInTheDocument();
    expect(screen.getByText("Posição média até o acesso: 8º")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-tempo")).toHaveTextContent(/teste sintético/);
  });

  it("com o cache frio, avisa que aguarda os dados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        atualizadoEm: null,
        limiteConexoes: null,
        conectados: null,
        emFila: null,
        filaIniciadaEm: null,
        tempoEspera: null,
      },
    };
    render(<ControleAcessosKpis systemName="SGP" />);

    expect(
      screen.getAllByText("Aguardando os dados do controle de acessos."),
    ).toHaveLength(4);
  });

  it("erro mostra a mensagem e tenta de novo", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ControleAcessosKpis systemName="SGP" />);

    expect(
      screen.getAllByText("Não foi possível carregar o controle de acessos."),
    ).toHaveLength(4);
    await userEvent.click(screen.getAllByRole("button", { name: /Tentar novamente/ })[0]);
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
