import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StatItem } from "@/types/metricas";

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
  data?: StatItem[];
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
let lastPeriodArg: string | undefined;

vi.mock("@/hooks/useSolicitacoesAlimentacoes", () => ({
  useSolicitacoesAlimentacoes: ({ period }: { period: string }) => {
    lastPeriodArg = period;
    return mockQueryResult;
  },
}));

import SolicitacoesAlimentacoesCard from "./SolicitacoesAlimentacoesCard";

describe("<SolicitacoesAlimentacoesCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastPeriodArg = undefined;
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra placeholder", () => {
    render(<SolicitacoesAlimentacoesCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("usa 'trimestre' como período inicial", () => {
    render(<SolicitacoesAlimentacoesCard systemName="SigPAE" />);
    expect(lastPeriodArg).toBe("trimestre");
    expect(screen.getByRole("radio", { name: "Trimestre" })).toBeChecked();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<SolicitacoesAlimentacoesCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<SolicitacoesAlimentacoesCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar as solicitações de alimentações.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens mockados", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [{ label: "Total", value: 360, variant: "neutral" }],
    };
    render(<SolicitacoesAlimentacoesCard systemName="SigPAE" />);

    expect(screen.getByText("360")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("troca o período ao clicar no switcher", async () => {
    render(<SolicitacoesAlimentacoesCard systemName="SigPAE" />);

    await userEvent.click(screen.getByRole("radio", { name: "Dia" }));

    expect(lastPeriodArg).toBe("dia");
    expect(screen.getByRole("radio", { name: "Dia" })).toBeChecked();
  });
});
