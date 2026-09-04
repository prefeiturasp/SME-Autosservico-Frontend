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

vi.mock("@/hooks/useConvocacoesPorDre", () => ({
  useConvocacoesPorDre: () => mockQueryResult,
}));

import ConvocacoesPorDreCard from "./ConvocacoesPorDreCard";

describe("<ConvocacoesPorDreCard />", () => {
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
    render(<ConvocacoesPorDreCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ConvocacoesPorDreCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ConvocacoesPorDreCard systemName="Sigla" />);

    expect(
      screen.getByText("Não foi possível carregar as convocações por DRE."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as DREs visíveis e trunca as demais atrás do 'Ver mais DREs'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Butantã", value: 142 },
        { label: "Capela do Socorro", value: 124 },
        { label: "Freguesia/Brasilândia", value: 110 },
        { label: "Guaianases", value: 96 },
        { label: "Ipiranga", value: 88 },
        { label: "Campo Limpo", value: 76 },
        { label: "Itaquera", value: 64 },
        { label: "Jaçanã/Tremembé", value: 58 },
      ],
    };
    render(<ConvocacoesPorDreCard systemName="Sigla" />);

    expect(screen.getByText("Ipiranga")).toBeInTheDocument();
    expect(screen.queryByText("Campo Limpo")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais DREs"));
    expect(screen.getByText("Campo Limpo")).toBeInTheDocument();
  });
});
