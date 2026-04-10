"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import type { XAxisTickContentProps, BarShapeProps } from "recharts";
import type { HourlyAccess } from "@/types/peakHours";
import { DEVICE_COLORS, DEVICE_KEYS, OFF_PEAK_COLOR } from "./constants";
import ChartTooltip from "./ChartTooltip";
import ChartLegend from "./ChartLegend";
import PeakBadge from "./PeakBadge";

type Props = {
  readonly data: HourlyAccess[];
  readonly peakHour: string;
};

function PeakHourTick({
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

function createBarShape(
  deviceKey: (typeof DEVICE_KEYS)[number],
  peakHour: string,
  isTopLayer: boolean,
) {
  return function BarShape(props: BarShapeProps) {
    const entry = props.payload as HourlyAccess | undefined;
    const isPeak = entry?.hour === peakHour;
    const fill = isPeak ? DEVICE_COLORS[deviceKey] : OFF_PEAK_COLOR;
    const radius = isTopLayer
      ? ([3, 3, 0, 0] as [number, number, number, number])
      : undefined;

    return (
      <Rectangle
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        fill={fill}
        radius={radius}
      />
    );
  };
}

export default function Chart({ data, peakHour }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-end">
        <PeakBadge peakHour={peakHour} />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap="20%">
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={(props: XAxisTickContentProps) => (
              <PeakHourTick {...props} peakHour={peakHour} />
            )}
          />
          <YAxis hide />
          <Tooltip
            cursor={false}
            content={<ChartTooltip peakHour={peakHour} />}
          />
          {DEVICE_KEYS.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="devices"
              shape={createBarShape(
                key,
                peakHour,
                index === DEVICE_KEYS.length - 1,
              )}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <ChartLegend />
    </div>
  );
}
