import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PeakHourTick from "./PeakHourTick";

type TickProps = React.ComponentProps<typeof PeakHourTick>;

function renderTick(props: Partial<TickProps>) {
    return render(
        <svg>
            <PeakHourTick {...(props as TickProps)} />
        </svg>,
    );
}

describe("<PeakHourTick />", () => {
    it("renderiza valor com peso normal quando não é pico", () => {
        const { container } = renderTick({
            x: 10,
            y: 20,
            payload: { value: "10h" } as TickProps["payload"],
            peakHour: "15h",
        });
        const text = container.querySelector("text");
        expect(text).not.toBeNull();
        expect(text?.textContent).toBe("10h");
        expect(text?.getAttribute("font-weight")).toBe("400");
        expect(text?.getAttribute("fill")).toBe("#9CA3AF");
    });

    it("renderiza valor em negrito quando é pico", () => {
        const { container } = renderTick({
            x: 10,
            y: 20,
            payload: { value: "15h" } as TickProps["payload"],
            peakHour: "15h",
        });
        const text = container.querySelector("text");
        expect(text?.getAttribute("font-weight")).toBe("700");
        expect(text?.getAttribute("fill")).toBe("#1F2937");
    });

    it("trata payload ausente como string vazia", () => {
        const { container } = renderTick({
            x: 10,
            y: 20,
            peakHour: "15h",
        });
        const text = container.querySelector("text");
        expect(text?.textContent).toBe("");
    });
});
