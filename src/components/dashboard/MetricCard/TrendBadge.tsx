import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricTrend } from "@/types/metric";

const TREND_CONFIG: Record<
  MetricTrend,
  { Icon: typeof ArrowRight; className: string }
> = {
  "on-average": {
    Icon: ArrowRight,
    className: "bg-[#F3F4F6] text-[#475569]",
  },
  above: {
    Icon: ArrowUp,
    className: "bg-[#D1FAE5] text-[#065F46]",
  },
  below: {
    Icon: ArrowDown,
    className: "bg-[#FCE7E7] text-[#991B1B]",
  },
};

type Props = {
  readonly trend: MetricTrend;
  readonly label: string;
};

export function TrendBadge({ trend, label }: Props) {
  const { Icon, className } = TREND_CONFIG[trend];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        className
      )}
      aria-label={`Tendência: ${label}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
