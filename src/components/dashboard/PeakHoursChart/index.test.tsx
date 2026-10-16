import type { PeakHoursResponse } from "@/types/peakHours";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("./Chart", () => ({
    default: ({
        data,
        peakHour,
    }: {
        readonly data: PeakHoursResponse["data"];
        readonly peakHour: string;
    }) => (
        <div data-testid="chart">
            <span data-testid="chart-peak-hour">{peakHour}</span>
            <span data-testid="chart-data-length">{data.length}</span>
        </div>
    ),
}));

type MockQueryResult = {
    data?: PeakHoursResponse;
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

vi.mock("@/hooks/usePeakHours", () => ({
    usePeakHours: () => mockQueryResult,
}));

import PeakHoursChart from "./index";

describe("<PeakHoursChart />", () => {
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
        render(<PeakHoursChart systemName="" />);
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    });

    it("loading mostra skeletons das barras", () => {
        mockQueryResult = { ...mockQueryResult, isLoading: true };
        render(<PeakHoursChart systemName="SigPAE" />);
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(
            24,
        );
    });

    it("isFetching mostra skeletons", () => {
        mockQueryResult = { ...mockQueryResult, isFetching: true };
        render(<PeakHoursChart systemName="SigPAE" />);
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(
            24,
        );
    });

    it("erro mostra mensagem e botão de retry", async () => {
        const refetch = vi.fn();
        mockQueryResult = { ...mockQueryResult, isError: true, refetch };
        render(<PeakHoursChart systemName="SigPAE" />);

        expect(
            screen.getByText("Não foi possível carregar os horários de pico."),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("retry-button"));
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("renderiza Chart com dados quando sucesso", () => {
        mockQueryResult = {
            ...mockQueryResult,
            data: {
                system: "SigPAE",
                peakHour: "15h",
                data: [
                    {
                        hour: "01h",
                        desktop: 320,
                        mobile: 85,
                        tablet: 22,
                        total: 427,
                    },
                    {
                        hour: "02h",
                        desktop: 180,
                        mobile: 52,
                        tablet: 15,
                        total: 247,
                    },
                ],
            },
        };
        render(<PeakHoursChart systemName="SigPAE" />);
        expect(screen.getByTestId("chart")).toBeInTheDocument();
        expect(screen.getByTestId("chart-peak-hour")).toHaveTextContent("15h");
        expect(screen.getByTestId("chart-data-length")).toHaveTextContent("2");
    });
});
