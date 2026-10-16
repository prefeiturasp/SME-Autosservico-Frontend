import { cn } from "@/lib/utils";
import {
  ANALYTICS_PERIODS,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Props = {
  readonly value: AnalyticsPeriod;
  readonly onChange: (next: AnalyticsPeriod) => void;
  readonly className?: string;
  readonly name?: string;
};

export default function AnalyticsPeriodSwitcher({
  value,
  onChange,
  className,
  name = "analytics-period",
}: Props) {
  return (
    <fieldset
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-lg border border-[#1E3A8A] bg-white",
        className,
      )}
    >
      <legend className="sr-only">Selecionar período</legend>
      {ANALYTICS_PERIODS.map((period, index) => {
        const isSelected = period.value === value;
        return (
          <label
            key={period.value}
            className={cn(
              "inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-2 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:ring-inset",
              index > 0 && "border-l border-[#1E3A8A]",
              isSelected
                ? "bg-[#1E3A8A] text-white"
                : "bg-white text-[#1E3A8A] hover:bg-gray-50",
            )}
          >
            <input
              type="radio"
              name={name}
              value={period.value}
              checked={isSelected}
              onChange={() => onChange(period.value)}
              className="sr-only"
            />
            {period.label}
          </label>
        );
      })}
    </fieldset>
  );
}
