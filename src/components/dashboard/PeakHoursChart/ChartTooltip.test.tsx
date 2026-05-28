import type { HourlyAccess } from "@/types/peakHours";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChartTooltip from "./ChartTooltip";

const SAMPLE_ENTRY: HourlyAccess = {
    hour: "15h",
    desktop: 6935,
    mobile: 921,
    tablet: 246,
    total: 8102,
};

describe("<ChartTooltip />", () => {
    it("não renderiza quando inativo", () => {
        const { container } = render(
            <ChartTooltip
                active={false}
                payload={[{ payload: SAMPLE_ENTRY }]}
                peakHour="15h"
            />,
        );
        expect(container.firstChild).toBeNull();
    });

    it("não renderiza quando payload é vazio", () => {
        const { container } = render(
            <ChartTooltip active payload={[]} peakHour="15h" />,
        );
        expect(container.firstChild).toBeNull();
    });

    it("não renderiza quando payload é undefined", () => {
        const { container } = render(<ChartTooltip active peakHour="15h" />);
        expect(container.firstChild).toBeNull();
    });

    it("renderiza título com sufixo 'Pico de acesso' quando hora é pico", () => {
        render(
            <ChartTooltip
                active
                payload={[{ payload: SAMPLE_ENTRY }]}
                peakHour="15h"
            />,
        );
        expect(screen.getByText("15h - Pico de acesso")).toBeInTheDocument();
    });

    it("renderiza título com sufixo 'Acesso' quando hora não é pico", () => {
        const offPeak: HourlyAccess = { ...SAMPLE_ENTRY, hour: "08h" };
        render(
            <ChartTooltip
                active
                payload={[{ payload: offPeak }]}
                peakHour="15h"
            />,
        );
        expect(screen.getByText("08h - Acesso")).toBeInTheDocument();
    });

    it("formata total e por dispositivo em pt-BR", () => {
        render(
            <ChartTooltip
                active
                payload={[{ payload: SAMPLE_ENTRY }]}
                peakHour="15h"
            />,
        );
        expect(screen.getByText("8.102 usuários")).toBeInTheDocument();
        expect(screen.getByText("6.935")).toBeInTheDocument();
        expect(screen.getByText("921")).toBeInTheDocument();
        expect(screen.getByText("246")).toBeInTheDocument();
    });

    it("não renderiza quando payload[0].payload é undefined", () => {
        const { container } = render(
            <ChartTooltip
                active
                payload={[{ payload: undefined as unknown as HourlyAccess }]}
                peakHour="15h"
            />,
        );
        expect(container.firstChild).toBeNull();
    });
});
