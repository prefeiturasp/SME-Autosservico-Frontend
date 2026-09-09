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

vi.mock("@/hooks/useOcorrenciasTratadasPorDre", () => ({
  useOcorrenciasTratadasPorDre: () => mockQueryResult,
}));

import OcorrenciasTratadasPorDreCard from "./OcorrenciasTratadasPorDreCard";

describe("<OcorrenciasTratadasPorDreCard />", () => {
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
    render(<OcorrenciasTratadasPorDreCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciasTratadasPorDreCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciasTratadasPorDreCard systemName="GIPE" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as ocorrências tratadas por DRE.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as DREs visíveis e trunca as demais atrás do 'Ver mais DREs'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Butantã", value: 152 },
        { label: "Capela do Socorro", value: 134 },
        { label: "Freguesia/Brasilândia", value: 128 },
        { label: "Guaianases", value: 98 },
        { label: "Ipiranga", value: 87 },
        { label: "Campo Limpo", value: 74 },
      ],
    };
    render(<OcorrenciasTratadasPorDreCard systemName="GIPE" />);

    expect(screen.getByText("Ipiranga")).toBeInTheDocument();
    expect(screen.queryByText("Campo Limpo")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais DREs"));
    expect(screen.getByText("Campo Limpo")).toBeInTheDocument();
  });
});
