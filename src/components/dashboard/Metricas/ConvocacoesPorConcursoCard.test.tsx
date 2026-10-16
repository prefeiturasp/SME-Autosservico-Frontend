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

vi.mock("@/hooks/useConvocacoesPorConcurso", () => ({
  useConvocacoesPorConcurso: () => mockQueryResult,
}));

import ConvocacoesPorConcursoCard from "./ConvocacoesPorConcursoCard";

describe("<ConvocacoesPorConcursoCard />", () => {
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
    render(<ConvocacoesPorConcursoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ConvocacoesPorConcursoCard systemName="Sigla" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ConvocacoesPorConcursoCard systemName="Sigla" />);

    expect(
      screen.getByText("Não foi possível carregar as convocações por concurso."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as linhas visíveis e trunca as demais atrás do 'Ver mais'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "PROF.ED.INF.E.ENS.FUND.I", value: 23 },
        { label: "AUXILIAR TÉCNICO DE EDUCAÇÃO", value: 16 },
        { label: "COORDENADOR PEDAGÓGICO", value: 11 },
        { label: "SUPERVISOR ESCOLAR", value: 5 },
        { label: "DIRETOR ESCOLAR", value: 3 },
        { label: "ASSISTENTE DE DIRETOR", value: 2 },
        { label: "AGENTE ESCOLAR", value: 1 },
      ],
    };
    render(<ConvocacoesPorConcursoCard systemName="Sigla" />);

    expect(screen.getByText("DIRETOR ESCOLAR")).toBeInTheDocument();
    expect(screen.queryByText("ASSISTENTE DE DIRETOR")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais"));
    expect(screen.getByText("ASSISTENTE DE DIRETOR")).toBeInTheDocument();
  });
});
