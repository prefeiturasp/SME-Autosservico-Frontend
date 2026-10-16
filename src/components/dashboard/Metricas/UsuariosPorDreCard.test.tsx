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

vi.mock("@/hooks/useUsuariosPorDre", () => ({
  useUsuariosPorDre: () => mockQueryResult,
}));

import UsuariosPorDreCard from "./UsuariosPorDreCard";

describe("<UsuariosPorDreCard />", () => {
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
    render(<UsuariosPorDreCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UsuariosPorDreCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UsuariosPorDreCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar os usuários por DRE."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza o cabeçalho 'Usuários' (corrigido) e trunca atrás do 'Ver mais DREs'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: [
        { label: "Butantã", value: 248 },
        { label: "Capela do Socorro", value: 210 },
        { label: "Freguesia/Brasilândia", value: 186 },
        { label: "Guaianases", value: 164 },
        { label: "Ipiranga", value: 142 },
        { label: "Campo Limpo", value: 121 },
      ],
    };
    render(<UsuariosPorDreCard systemName="GIPE" />);

    expect(screen.getByText("Usuários")).toBeInTheDocument();
    expect(screen.getByText("Ipiranga")).toBeInTheDocument();
    expect(screen.queryByText("Campo Limpo")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais DREs"));
    expect(screen.getByText("Campo Limpo")).toBeInTheDocument();
  });
});
