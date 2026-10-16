import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PeakBadge from "./PeakBadge";

describe("<PeakBadge />", () => {
    it("renderiza o horário de pico no rótulo", () => {
        render(<PeakBadge peakHour="15h" />);
        expect(screen.getByText("Pico: 15h")).toBeInTheDocument();
    });

    it("aceita formato livre de string", () => {
        render(<PeakBadge peakHour="08:30" />);
        expect(screen.getByText("Pico: 08:30")).toBeInTheDocument();
    });
});
