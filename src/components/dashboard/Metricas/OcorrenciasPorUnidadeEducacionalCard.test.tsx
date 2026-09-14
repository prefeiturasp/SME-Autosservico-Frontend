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

vi.mock("@/hooks/useOcorrenciasPorUnidadeEducacional", () => ({
  useOcorrenciasPorUnidadeEducacional: () => mockQueryResult,
}));

import OcorrenciasPorUnidadeEducacionalCard from "./OcorrenciasPorUnidadeEducacionalCard";

describe("<OcorrenciasPorUnidadeEducacionalCard />", () => {
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
    render(<OcorrenciasPorUnidadeEducacionalCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciasPorUnidadeEducacionalCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciasPorUnidadeEducacionalCard systemName="GIPE" />);

    expect(
      screen.getByText(
        "Não foi possível carregar as ocorrências por unidade educacional.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as UEs visíveis e trunca as demais atrás do 'Ver mais UEs'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "CEI PARC. PAU BRASIL", value: 34 },
        { label: "CEI PARC. JD. ARPOADOR", value: 29 },
        { label: "CEMEI MORUMBI", value: 26 },
        { label: "CEMEI IRAPARÁ", value: 22 },
        { label: "EMEF ADALGIZA SEGURADO DA SILVEIRA PROFA", value: 19 },
        { label: "EMEI JARDIM CELESTE", value: 15 },
      ],
    };
    render(<OcorrenciasPorUnidadeEducacionalCard systemName="GIPE" />);

    expect(
      screen.getByText("EMEF ADALGIZA SEGURADO DA SILVEIRA PROFA"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("EMEI JARDIM CELESTE"),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais UEs"));
    expect(screen.getByText("EMEI JARDIM CELESTE")).toBeInTheDocument();
  });
});
