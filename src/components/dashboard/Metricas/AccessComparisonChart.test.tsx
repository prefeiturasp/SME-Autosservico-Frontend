import type { AccessComparisonBucket } from "@/types/metricas";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", () => {
  function makePassthrough(testid: string) {
    function Passthrough({
      children,
    }: {
      readonly children?: React.ReactNode;
    }) {
      return <div data-testid={testid}>{children}</div>;
    }
    Passthrough.displayName = `MockPassthrough(${testid})`;
    return Passthrough;
  }

  function MockBarChart({
    data,
    barCategoryGap,
    children,
  }: {
    readonly data: Array<AccessComparisonBucket & { fill: string }>;
    readonly barCategoryGap?: number | string;
    readonly children?: React.ReactNode;
  }) {
    return (
      <div data-testid="bar-chart" data-bar-category-gap={String(barCategoryGap)}>
        {data.map((bucket) => (
          <div key={bucket.label} data-testid={`bucket-${bucket.label}`}>
            <span data-testid="bucket-value">{bucket.value}</span>
            <span data-testid="bucket-fill">{bucket.fill}</span>
          </div>
        ))}
        {children}
      </div>
    );
  }

  function MockBar({ dataKey }: { readonly dataKey: string }) {
    return <div data-testid="bar" data-key={dataKey} />;
  }

  type TickRenderer = (props: {
    payload: { value: string };
  }) => React.ReactNode;

  function MockXAxis({
    dataKey,
    tick,
  }: {
    readonly dataKey: string;
    readonly tick?: TickRenderer | object;
  }) {
    return (
      <div data-testid="x-axis" data-key={dataKey}>
        {typeof tick === "function" && (
          <svg data-testid="x-axis-custom-tick-mes-2">
            {tick({ payload: { value: "Mês 2" } })}
          </svg>
        )}
      </div>
    );
  }

  function MockYAxis() {
    return <div data-testid="y-axis" />;
  }

  return {
    BarChart: MockBarChart,
    Bar: MockBar,
    XAxis: MockXAxis,
    YAxis: MockYAxis,
    ResponsiveContainer: makePassthrough("responsive-container"),
  };
});

import AccessComparisonChart from "./AccessComparisonChart";

const BUCKETS: AccessComparisonBucket[] = [
  { label: "Mês 1", value: 42300, isPeak: false },
  { label: "Mês 2", value: 58900, isPeak: true },
  { label: "Mês 3", value: 47650, isPeak: false },
];

describe("<AccessComparisonChart />", () => {
  it("renderiza um bucket para cada item recebido", () => {
    render(<AccessComparisonChart buckets={BUCKETS} />);

    expect(screen.getByTestId("bucket-Mês 1")).toBeInTheDocument();
    expect(screen.getByTestId("bucket-Mês 2")).toBeInTheDocument();
    expect(screen.getByTestId("bucket-Mês 3")).toBeInTheDocument();
  });

  it("aplica a cor de pico apenas no bucket marcado como isPeak", () => {
    render(<AccessComparisonChart buckets={BUCKETS} />);

    const peakFill = screen
      .getByTestId("bucket-Mês 2")
      .querySelector('[data-testid="bucket-fill"]');
    const offPeakFill = screen
      .getByTestId("bucket-Mês 1")
      .querySelector('[data-testid="bucket-fill"]');

    expect(peakFill).toHaveTextContent("#1E3A8A");
    expect(offPeakFill).toHaveTextContent("#D1D5DB");
  });

  it("preserva o valor de cada bucket", () => {
    render(<AccessComparisonChart buckets={BUCKETS} />);

    expect(
      screen.getByTestId("bucket-Mês 2").querySelector('[data-testid="bucket-value"]')
    ).toHaveTextContent("58900");
  });

  it("usa '30%' de barCategoryGap por padrão, sem highlightPeakLabel", () => {
    render(<AccessComparisonChart buckets={BUCKETS} />);

    expect(screen.getByTestId("bar-chart")).toHaveAttribute(
      "data-bar-category-gap",
      "30%",
    );
    expect(
      screen.queryByTestId("x-axis-custom-tick-mes-2"),
    ).not.toBeInTheDocument();
  });

  it("repassa um barCategoryGap customizado", () => {
    render(<AccessComparisonChart buckets={BUCKETS} barCategoryGap={5} />);

    expect(screen.getByTestId("bar-chart")).toHaveAttribute(
      "data-bar-category-gap",
      "5",
    );
  });

  it("com highlightPeakLabel, o tick do mês de pico fica em #111827 bold 12px", () => {
    render(<AccessComparisonChart buckets={BUCKETS} highlightPeakLabel />);

    const tickText = screen.getByText("Mês 2");
    expect(tickText).toHaveAttribute("fill", "#111827");
    expect(tickText).toHaveAttribute("font-weight", "bold");
    expect(tickText).toHaveAttribute("font-size", "12");
  });
});
