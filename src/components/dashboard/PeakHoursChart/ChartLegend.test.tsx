import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChartLegend from "./ChartLegend";
import { DEVICE_KEYS, DEVICE_LABELS } from "./constants";

describe("<ChartLegend />", () => {
    it("renderiza um item por dispositivo", () => {
        render(<ChartLegend />);
        DEVICE_KEYS.forEach((key) => {
            expect(screen.getByText(DEVICE_LABELS[key])).toBeInTheDocument();
        });
    });

    it("inclui item 'Fora do pico'", () => {
        render(<ChartLegend />);
        expect(screen.getByText("Fora do pico")).toBeInTheDocument();
    });
});
