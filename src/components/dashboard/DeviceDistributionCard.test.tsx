import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DeviceDistributionResponse } from "@/types/deviceDistribution";

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
  data?: DeviceDistributionResponse;
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

vi.mock("@/hooks/useDeviceDistribution", () => ({
  useDeviceDistribution: () => mockQueryResult,
}));

import DeviceDistributionCard from "./DeviceDistributionCard";

describe("<DeviceDistributionCard />", () => {
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
    render(<DeviceDistributionCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<DeviceDistributionCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<DeviceDistributionCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar a distribuição de dispositivos.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza linhas de dispositivos com rótulos e percentuais", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        desktop: 78,
        mobile: 18,
        tablet: 4,
        warning: null,
      },
    };
    render(<DeviceDistributionCard systemName="SigPAE" />);

    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
    expect(screen.getByText("Tablet")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText("4%")).toBeInTheDocument();
  });

  it("não exibe alerta quando warning é null", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        desktop: 90,
        mobile: 8,
        tablet: 2,
        warning: null,
      },
    };
    render(<DeviceDistributionCard systemName="SigPAE" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("exibe alerta com a mensagem retornada quando warning está presente", () => {
    const warning = "18% dos acessos via mobile, mas o sistema não é responsivo.";
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        desktop: 78,
        mobile: 18,
        tablet: 4,
        warning,
      },
    };
    render(<DeviceDistributionCard systemName="SigPAE" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(warning)).toBeInTheDocument();
  });

  it("limita a barra a 100% mesmo se receber valor acima", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        desktop: 150,
        mobile: -10,
        tablet: 4,
        warning: null,
      },
    };
    render(<DeviceDistributionCard systemName="SigPAE" />);

    const desktopBar = screen.getByLabelText("Acessos via Desktop");
    expect(desktopBar).toHaveAttribute("aria-valuenow", "100");

    const mobileBar = screen.getByLabelText("Acessos via Mobile");
    expect(mobileBar).toHaveAttribute("aria-valuenow", "0");
  });
});
