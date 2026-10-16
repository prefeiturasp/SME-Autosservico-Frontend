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
let lastPeriodArg: string | undefined;

vi.mock("@/hooks/useSorteiosPorTipo", () => ({
  useSorteiosPorTipo: ({ period }: { period: string }) => {
    lastPeriodArg = period;
    return mockQueryResult;
  },
}));

import SorteiosPorTipoCard from "./SorteiosPorTipoCard";

describe("<SorteiosPorTipoCard />", () => {
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
    render(<SorteiosPorTipoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("usa 'dia' como período inicial", () => {
    render(<SorteiosPorTipoCard systemName="Intranet" />);
    expect(lastPeriodArg).toBe("dia");
    expect(screen.getByRole("radio", { name: "Dia" })).toBeChecked();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<SorteiosPorTipoCard systemName="Intranet" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<SorteiosPorTipoCard systemName="Intranet" />);

    expect(
      screen.getByText("Não foi possível carregar os resultados de sorteios por tipo.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as linhas mockadas", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [{ label: "Premiação", value: 254 }],
    };
    render(<SorteiosPorTipoCard systemName="Intranet" />);

    expect(screen.getByText("Premiação")).toBeInTheDocument();
    expect(screen.getByText("254")).toBeInTheDocument();
  });

  it("troca o período ao clicar no switcher", async () => {
    render(<SorteiosPorTipoCard systemName="Intranet" />);

    await userEvent.click(screen.getByRole("radio", { name: "Trimestre" }));

    expect(lastPeriodArg).toBe("trimestre");
    expect(screen.getByRole("radio", { name: "Trimestre" })).toBeChecked();
  });
});
