import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PeakUsageTodayResponse } from "@/types/peakUsageToday";

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
  data?: PeakUsageTodayResponse;
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

vi.mock("@/hooks/usePeakUsageToday", () => ({
  usePeakUsageToday: () => mockQueryResult,
}));

import PeakUsageTodayCard from "./index";

describe("<PeakUsageTodayCard />", () => {
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
    render(<PeakUsageTodayCard />);
    expect(screen.getByText("Pico de uso hoje")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<PeakUsageTodayCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<PeakUsageTodayCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar o pico de uso.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza pico como hora formatada e badge 'Fora de pico'", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", peakHour: 15, status: "off-peak" },
    };
    render(<PeakUsageTodayCard systemName="SigPAE" />);

    expect(screen.getByText("15h")).toBeInTheDocument();
    expect(screen.getByText("Fora de pico")).toBeInTheDocument();
  });

  it("renderiza badge 'Em pico' quando status = peak", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", peakHour: 9, status: "peak" },
    };
    render(<PeakUsageTodayCard systemName="SigPAE" />);

    expect(screen.getByText("9h")).toBeInTheDocument();
    expect(screen.getByText("Em pico")).toBeInTheDocument();
  });
});
