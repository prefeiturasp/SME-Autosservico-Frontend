import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ProfileDistributionResponse } from "@/types/metricas";

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
  data?: ProfileDistributionResponse;
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

vi.mock("@/hooks/useUsuariosPorTipoDePerfil", () => ({
  useUsuariosPorTipoDePerfil: () => mockQueryResult,
}));

import UsuariosPorTipoDePerfilCard from "./UsuariosPorTipoDePerfilCard";

describe("<UsuariosPorTipoDePerfilCard />", () => {
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
    render(<UsuariosPorTipoDePerfilCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeleton", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UsuariosPorTipoDePerfilCard systemName="GIPE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UsuariosPorTipoDePerfilCard systemName="GIPE" />);

    expect(
      screen.getByText("Não foi possível carregar os usuários por tipo de perfil."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza a legenda com os 6 perfis e seus percentuais", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        items: [
          { label: "Diretor", percentage: 28, color: "#3B82F6" },
          { label: "Assistente de direção", percentage: 5, color: "#1E3A8A" },
          { label: "Ponto focal", percentage: 12, color: "#F59E0B" },
          { label: "Ponto focal admin", percentage: 18, color: "#A16207" },
          { label: "GIPE", percentage: 15, color: "#10B981" },
          { label: "GIPE admin", percentage: 22, color: "#065F46" },
        ],
      },
    };
    render(<UsuariosPorTipoDePerfilCard systemName="GIPE" />);

    expect(screen.getByText("Diretor")).toBeInTheDocument();
    expect(screen.getByText("28%")).toBeInTheDocument();
    expect(screen.getByText("GIPE admin")).toBeInTheDocument();
    expect(screen.getByText("22%")).toBeInTheDocument();
  });
});
