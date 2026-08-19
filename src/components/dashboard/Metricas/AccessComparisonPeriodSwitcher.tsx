import { cn } from "@/lib/utils";
import {
  ACCESS_COMPARISON_PERIODS,
  type AccessComparisonPeriod,
} from "@/types/accessComparisonPeriod";

type Props = {
  readonly value: AccessComparisonPeriod;
  readonly onChange: (next: AccessComparisonPeriod) => void;
  readonly className?: string;
  readonly name?: string;
  readonly id?: string;
};

export default function AccessComparisonPeriodSwitcher({
  value,
  onChange,
  className,
  name = "access-comparison-period",
  id,
}: Props) {
  return (
    <fieldset id={id} className={cn("inline-flex items-center gap-2", className)}>
      <legend className="sr-only">Selecionar período de comparação</legend>
      {ACCESS_COMPARISON_PERIODS.map((period) => {
        const isSelected = period.value === value;
        return (
          <label
            key={period.value}
            className={cn(
              "inline-flex cursor-pointer items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-within:ring-2 focus-within:ring-[#2563EB]",
              isSelected
                ? "border-[#1E4D8C] bg-[#1E4D8C] text-white"
                : "border-[#E2E8F0] bg-white text-[#111827] hover:bg-gray-50",
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
