"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { AccessComparisonBucket } from "@/types/metricas";

type Props = {
  readonly buckets: AccessComparisonBucket[];
};

const PEAK_COLOR = "#1E3A8A";
const OFF_PEAK_COLOR = "#D1D5DB";

export default function AccessComparisonChart({ buckets }: Props) {
  const chartData = buckets.map((bucket) => ({
    ...bucket,
    fill: bucket.isPeak ? PEAK_COLOR : OFF_PEAK_COLOR,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barCategoryGap="30%">
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#6B7280" }}
        />
        <YAxis hide />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
