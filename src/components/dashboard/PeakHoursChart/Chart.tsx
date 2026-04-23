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
import type { BarShapeProps, XAxisTickContentProps } from "recharts";
import type { HourlyAccess } from "@/types/peakHours";
import { DEVICE_COLORS, DEVICE_KEYS, OFF_PEAK_COLOR } from "./constants";
import ChartTooltip from "./ChartTooltip";
import ChartLegend from "./ChartLegend";
import PeakBadge from "./PeakBadge";
import PeakHourTick from "./PeakHourTick";

type Props = {
  readonly data: HourlyAccess[];
  readonly peakHour: string;
};

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

function renderPeakHourTick(
  peakHour: string,
  props: XAxisTickContentProps,
) {
  return <PeakHourTick {...props} peakHour={peakHour} />;
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
            tick={renderPeakHourTick.bind(null, peakHour)}
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
