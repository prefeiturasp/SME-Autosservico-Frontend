import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
  data?: string[];
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

vi.mock("@/hooks/useUpsQueReceberamVisita", () => ({
  useUpsQueReceberamVisita: () => mockQueryResult,
}));

import UpsQueReceberamVisitaCard from "./UpsQueReceberamVisitaCard";

describe("<UpsQueReceberamVisitaCard />", () => {
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
    render(<UpsQueReceberamVisitaCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UpsQueReceberamVisitaCard systemName="Rolê Agroecológico" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UpsQueReceberamVisitaCard systemName="Rolê Agroecológico" />);

    expect(
      screen.getByText("Não foi possível carregar as UPs que receberam visita."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as UPs visíveis e trunca as demais atrás do 'Ver mais UPs'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        "Sítio Boa Esperança",
        "Horta Comunitária Jardim das Rosas",
        "Fazenda Escola Vale Verde",
        "Sítio Recanto Agroecológico",
        "Horta Comunitária Parque Novo Mundo",
        "Chácara Sementes do Amanhã",
      ],
    };
    render(<UpsQueReceberamVisitaCard systemName="Rolê Agroecológico" />);

    expect(screen.getByText("Sítio Boa Esperança")).toBeInTheDocument();
    expect(screen.queryByText("Chácara Sementes do Amanhã")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais UPs"));
    expect(screen.getByText("Chácara Sementes do Amanhã")).toBeInTheDocument();
  });
});
