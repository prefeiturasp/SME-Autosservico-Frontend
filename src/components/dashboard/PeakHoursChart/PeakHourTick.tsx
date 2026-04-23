"use client";

import type { XAxisTickContentProps } from "recharts";

type Props = XAxisTickContentProps & { readonly peakHour: string };

export default function PeakHourTick({ x, y, payload, peakHour }: Props) {
  const value = String(payload?.value ?? "");
  const isPeak = value === peakHour;
  return (
    <text
      x={Number(x)}
      y={Number(y) + 14}
      textAnchor="middle"
      fontSize={12}
      fontWeight={isPeak ? 700 : 400}
      fill={isPeak ? "#1F2937" : "#9CA3AF"}
    >
      {value}
    </text>
  );
}
