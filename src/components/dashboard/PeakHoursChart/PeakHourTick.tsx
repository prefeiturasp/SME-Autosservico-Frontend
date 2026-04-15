'use client';

import React from 'react'
import type { XAxisTickContentProps } from "recharts";

export default function PeakHourTick({
    x,
    y,
    payload,
    peakHour,
  }: XAxisTickContentProps & { peakHour: string }) {
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