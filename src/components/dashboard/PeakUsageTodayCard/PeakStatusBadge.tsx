import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PeakUsageStatus } from "@/types/peakUsageToday";

const STATUS_CONFIG: Record<
  PeakUsageStatus,
  { Icon: typeof ArrowUp; label: string; className: string }
> = {
  peak: {
    Icon: ArrowUp,
    label: "Em pico",
    className: "bg-[#D1FAE5] text-[#065F46]",
  },
  "off-peak": {
    Icon: ArrowDown,
    label: "Fora de pico",
    className: "bg-[#FEF3C7] text-[#92400E]",
  },
};

type Props = {
  readonly status: PeakUsageStatus;
};

export function PeakStatusBadge({ status }: Props) {
  const { Icon, label, className } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        className
      )}
      aria-label={`Status de pico: ${label}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
