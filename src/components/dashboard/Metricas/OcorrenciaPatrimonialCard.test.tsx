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

vi.mock("@/hooks/useOcorrenciaPatrimonial", () => ({
  useOcorrenciaPatrimonial: () => mockQueryResult,
}));

import OcorrenciaPatrimonialCard from "./OcorrenciaPatrimonialCard";

describe("<OcorrenciaPatrimonialCard />", () => {
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
    render(<OcorrenciaPatrimonialCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<OcorrenciaPatrimonialCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<OcorrenciaPatrimonialCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar as ocorrências patrimoniais."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza as linhas visíveis e trunca as demais atrás do 'Ver mais'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Dano material", value: 86 },
        { label: "Depredação ou vandalismo", value: 64 },
        { label: "Ocorrência com câmera/Smart Sampa", value: 38 },
        { label: "Furto", value: 28 },
        { label: "Invasão", value: 22 },
        { label: "Outros", value: 14 },
      ],
    };
    render(<OcorrenciaPatrimonialCard systemName="GIPE" />);

    expect(screen.getByText("Invasão")).toBeInTheDocument();
    expect(screen.queryByText("Outros")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais"));
    expect(screen.getByText("Outros")).toBeInTheDocument();
  });
});
