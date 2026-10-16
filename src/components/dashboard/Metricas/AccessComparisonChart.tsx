"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { AccessComparisonBucket } from "@/types/metricas";

type Props = {
  readonly buckets: AccessComparisonBucket[];
  readonly barCategoryGap?: number | string;
  readonly highlightPeakLabel?: boolean;
};

const PEAK_COLOR = "#1E3A8A";
const OFF_PEAK_COLOR = "#D1D5DB";
const DEFAULT_BAR_CATEGORY_GAP = "30%";
const TICK_COLOR = "#6B7280";
const PEAK_TICK_COLOR = "#111827";

type TickProps = {
  readonly x?: number | string;
  readonly y?: number | string;
  readonly payload?: { value: string };
};

function PeakAwareTick(peakLabel: string | undefined) {
  function Tick({ x, y, payload }: TickProps) {
    const isPeak = payload?.value === peakLabel;
    const yOffset = (typeof y === "number" ? y : Number(y ?? 0)) + 12;
    return (
      <text
        x={x}
        y={yOffset}
        textAnchor="middle"
        fontSize={12}
        fontWeight={isPeak ? "bold" : "normal"}
        fill={isPeak ? PEAK_TICK_COLOR : TICK_COLOR}
      >
        {payload?.value}
      </text>
    );
  }
  Tick.displayName = "PeakAwareTick";
  return Tick;
}

export default function AccessComparisonChart({
  buckets,
  barCategoryGap,
  highlightPeakLabel,
}: Props) {
  const chartData = buckets.map((bucket) => ({
    ...bucket,
    fill: bucket.isPeak ? PEAK_COLOR : OFF_PEAK_COLOR,
  }));

  const peakLabel = buckets.find((bucket) => bucket.isPeak)?.label;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        barCategoryGap={barCategoryGap ?? DEFAULT_BAR_CATEGORY_GAP}
      >
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={
            highlightPeakLabel
              ? PeakAwareTick(peakLabel)
              : { fontSize: 12, fill: TICK_COLOR }
          }
        />
        <YAxis hide />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
