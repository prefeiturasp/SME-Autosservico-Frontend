import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { LimpezaContratoRow } from "@/types/limpezaMetricas";

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
  data?: LimpezaContratoRow[];
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

vi.mock("@/hooks/useContratos", () => ({
  useContratos: () => mockQueryResult,
}));

import ContratosCard from "./ContratosCard";

describe("<ContratosCard />", () => {
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
    render(<ContratosCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    expect(screen.getByText("Contratos")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ContratosCard systemName="Limpeza" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ContratosCard systemName="Limpeza" />);

    expect(
      screen.getByText("Não foi possível carregar os contratos."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as 3 colunas com as linhas visíveis, truncando as demais atrás do 'Ver mais contratos'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        {
          termoContrato: "8613277/2026",
          prestador: "Prestador 1",
          vigencia: "até 03/2027",
        },
        {
          termoContrato: "0861221/2026",
          prestador: "Prestador 2",
          vigencia: "até 11/2026",
        },
        {
          termoContrato: "1328231/2025",
          prestador: "Prestador 3",
          vigencia: "até 07/2027",
        },
        {
          termoContrato: "3841628/2025",
          prestador: "Prestador 4",
          vigencia: "até 02/2028",
        },
        {
          termoContrato: "0123355/2025",
          prestador: "Prestador 5",
          vigencia: "até 07/2027",
        },
        {
          termoContrato: "7215490/2025",
          prestador: "Prestador 6",
          vigencia: "até 09/2026",
        },
      ],
    };
    render(<ContratosCard systemName="Limpeza" />);

    expect(screen.getByText("Termo do contrato")).toBeInTheDocument();
    expect(screen.getByText("Prestador")).toBeInTheDocument();
    expect(screen.getByText("Vigência")).toBeInTheDocument();
    expect(screen.getByText("0123355/2025")).toBeInTheDocument();
    expect(screen.getByText("até 02/2028")).toBeInTheDocument();
    expect(screen.queryByText("7215490/2025")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais contratos"));
    expect(screen.getByText("7215490/2025")).toBeInTheDocument();
  });
});
