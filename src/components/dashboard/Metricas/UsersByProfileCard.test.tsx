import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UsersByProfileResponse } from "@/types/metricas";

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
  data?: UsersByProfileResponse;
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

vi.mock("@/hooks/useUsersByProfile", () => ({
  useUsersByProfile: () => mockQueryResult,
}));

import UsersByProfileCard from "./UsersByProfileCard";

describe("<UsersByProfileCard />", () => {
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
    render(<UsersByProfileCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeleton", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UsersByProfileCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UsersByProfileCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar os usuários por tipo de perfil.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza a legenda com os percentuais de cada perfil", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { codae: 10, dre: 15, ue: 75 },
    };
    render(<UsersByProfileCard systemName="SigPAE" />);

    expect(screen.getByText("CODAE")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("UE")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
