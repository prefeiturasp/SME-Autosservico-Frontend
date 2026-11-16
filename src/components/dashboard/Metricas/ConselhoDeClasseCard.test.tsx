import React from "react";
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

vi.mock("@/components/ui/select", async () => {
  const { selectNativo } = await import("@/__mocks__/selectNativo");
  return selectNativo;
});

vi.mock("@/hooks/usePeriodosSgp", async () => {
  const { useState } = await import("react");
  return {
    usePeriodoSgp: () => {
      const [periodo, setPeriodo] = useState("fundamental_medio:2026:0:4");
      return {
        periodo,
        setPeriodo,
        opcoes: [
          { value: "fundamental_medio:2026:0:4", label: "4º Bimestre de 2026", segmento: "fundamental_medio" },
          { value: "eja:2026:2:1", label: "EJA - 1º Bim. do 2º Sem. 2026", segmento: "eja" },
        ],
      };
    },
  };
});

type MockQueryResult = {
  data?: StatItem[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult;
let ultimoPeriodo: string | undefined;

vi.mock("@/hooks/useConselhoDeClasse", () => ({
  useConselhoDeClasse: ({ periodo }: { periodo: string }) => {
    ultimoPeriodo = periodo;
    return mockQueryResult;
  },
}));

import ConselhoDeClasseCard from "./ConselhoDeClasseCard";

describe("<ConselhoDeClasseCard />", () => {
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
    render(<ConselhoDeClasseCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("usa o período padrão do seletor", () => {
    render(<ConselhoDeClasseCard systemName="SGP" />);
    expect(screen.getByText("Conselho de classe")).toBeInTheDocument();
    expect(ultimoPeriodo).toBe("fundamental_medio:2026:0:4");
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<ConselhoDeClasseCard systemName="SGP" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<ConselhoDeClasseCard systemName="SGP" />);

    expect(
      screen.getByText("Não foi possível carregar o conselho de classe."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza esperados e situações", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Esperados para o período", value: 2480, variant: "neutral", percentage: 91.77 },
        { label: "Não iniciados", value: 204, variant: "muted", percentage: 8.23 },
        { label: "Em andamento", value: 387, variant: "neutral", percentage: 15.6 },
        { label: "Processado com sucesso", value: 1889, variant: "success", percentage: 76.17 },
      ],
    };
    render(<ConselhoDeClasseCard systemName="SGP" />);

    expect(screen.getByText("2.480")).toBeInTheDocument();
    expect(screen.getByText("1.889")).toBeInTheDocument();
    expect(screen.getByText("91,77%")).toBeInTheDocument();
  });

  it("troca para um período da EJA", async () => {
    render(<ConselhoDeClasseCard systemName="SGP" />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "eja:2026:2:1");

    expect(ultimoPeriodo).toBe("eja:2026:2:1");
  });
});
