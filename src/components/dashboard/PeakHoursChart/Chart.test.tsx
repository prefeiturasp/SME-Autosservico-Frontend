import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { HourlyAccess } from "@/types/peakHours";

vi.mock("recharts", () => {
  function makePassthrough(testid: string) {
    function Passthrough({ children }: { readonly children?: React.ReactNode }) {
      return <div data-testid={testid}>{children}</div>;
    }
    Passthrough.displayName = `MockPassthrough(${testid})`;
    return Passthrough;
  }

  function MockBar({
    dataKey,
    shape,
  }: {
    readonly dataKey: string;
    readonly shape?: (props: Record<string, unknown>) => React.ReactNode;
  }) {
    const peakSample = { hour: "15h", desktop: 100, mobile: 20, tablet: 5, total: 125 };
    const offPeakSample = { hour: "10h", desktop: 50, mobile: 10, tablet: 2, total: 62 };
    return (
      <div data-testid={`bar-${dataKey}`}>
        <div data-testid={`bar-shape-peak-${dataKey}`}>
          {shape?.({ x: 0, y: 0, width: 10, height: 50, payload: peakSample })}
        </div>
        <div data-testid={`bar-shape-offpeak-${dataKey}`}>
          {shape?.({ x: 0, y: 0, width: 10, height: 50, payload: offPeakSample })}
        </div>
        <div data-testid={`bar-shape-empty-${dataKey}`}>
          {shape?.({ x: 0, y: 0, width: 10, height: 50, payload: undefined })}
        </div>
      </div>
    );
  }

  function MockXAxis({
    tick,
  }: {
    readonly tick?: (props: Record<string, unknown>) => React.ReactNode;
  }) {
    return (
      <div data-testid="x-axis">
        {tick?.({ x: 5, y: 10, payload: { value: "15h" } })}
      </div>
    );
  }

  function MockYAxis() {
    return <div data-testid="y-axis" />;
  }
  function MockTooltip() {
    return <div data-testid="tooltip" />;
  }
  function MockRectangle({
    fill,
    radius,
  }: {
    readonly fill?: string;
    readonly radius?: [number, number, number, number];
  }) {
    return (
      <div
        data-testid="rectangle"
        data-fill={fill}
        data-radius={radius ? radius.join(",") : "none"}
      />
    );
  }

  return {
    BarChart: makePassthrough("bar-chart"),
    Bar: MockBar,
    XAxis: MockXAxis,
    YAxis: MockYAxis,
    Tooltip: MockTooltip,
    ResponsiveContainer: makePassthrough("responsive-container"),
    Rectangle: MockRectangle,
  };
});

vi.mock("./ChartTooltip", () => ({
  default: () => <div data-testid="chart-tooltip" />,
}));

vi.mock("./ChartLegend", () => ({
  default: () => <div data-testid="chart-legend" />,
}));

vi.mock("./PeakBadge", () => ({
  default: ({ peakHour }: { readonly peakHour: string }) => (
    <div data-testid="peak-badge">{peakHour}</div>
  ),
}));

vi.mock("./PeakHourTick", () => ({
  default: ({ peakHour }: { readonly peakHour: string }) => (
    <div data-testid="peak-hour-tick">{peakHour}</div>
  ),
}));

import Chart from "./Chart";

const SAMPLE: HourlyAccess[] = [
  { hour: "14h", desktop: 100, mobile: 20, tablet: 5, total: 125 },
  { hour: "15h", desktop: 200, mobile: 40, tablet: 10, total: 250 },
];

describe("<Chart />", () => {
  it("renderiza badge, legenda e estrutura do gráfico", () => {
    render(<Chart data={SAMPLE} peakHour="15h" />);

    expect(screen.getByTestId("peak-badge")).toHaveTextContent("15h");
    expect(screen.getByTestId("chart-legend")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renderiza uma barra para cada dispositivo (desktop, mobile, tablet)", () => {
    render(<Chart data={SAMPLE} peakHour="15h" />);

    expect(screen.getByTestId("bar-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("bar-mobile")).toBeInTheDocument();
    expect(screen.getByTestId("bar-tablet")).toBeInTheDocument();
  });

  it("aplica cor do dispositivo na barra do horário de pico", () => {
    render(<Chart data={SAMPLE} peakHour="15h" />);

    const peakDesktop = screen
      .getByTestId("bar-shape-peak-desktop")
      .querySelector('[data-testid="rectangle"]');
    expect(peakDesktop?.getAttribute("data-fill")).toBe("#1F3D73");
  });

  it("aplica cor neutra na barra fora do pico", () => {
    render(<Chart data={SAMPLE} peakHour="15h" />);

    const offPeakDesktop = screen
      .getByTestId("bar-shape-offpeak-desktop")
      .querySelector('[data-testid="rectangle"]');
    expect(offPeakDesktop?.getAttribute("data-fill")).toBe("#D1D5DB");
  });

  it("aplica radius apenas na barra superior do empilhamento", () => {
    render(<Chart data={SAMPLE} peakHour="15h" />);

    const desktopShape = screen
      .getByTestId("bar-shape-peak-desktop")
      .querySelector('[data-testid="rectangle"]');
    const tabletShape = screen
      .getByTestId("bar-shape-peak-tablet")
      .querySelector('[data-testid="rectangle"]');

    expect(desktopShape?.getAttribute("data-radius")).toBe("none");
    expect(tabletShape?.getAttribute("data-radius")).toBe("3,3,0,0");
  });

  it("trata payload ausente sem quebrar (renderiza cor neutra)", () => {
    render(<Chart data={SAMPLE} peakHour="15h" />);

    const empty = screen
      .getByTestId("bar-shape-empty-desktop")
      .querySelector('[data-testid="rectangle"]');
    expect(empty?.getAttribute("data-fill")).toBe("#D1D5DB");
  });

  it("propaga peakHour para o tick customizado do XAxis", () => {
    render(<Chart data={SAMPLE} peakHour="15h" />);

    expect(screen.getByTestId("peak-hour-tick")).toHaveTextContent("15h");
  });
});
