import { cn } from "@/lib/utils";
import type { SonarRating } from "@/types/sonarqube";
import RatingBadge from "./RatingBadge";
import { RATING_STYLES } from "./ratingStyles";

type Props = {
  readonly label: string;
  readonly value: string;
  readonly helperText?: string;
  readonly rating?: SonarRating;
  readonly className?: string;
};

export default function SonarMetricCard({
  label,
  value,
  helperText,
  rating,
  className,
}: Props) {
  const cardTone = rating ? RATING_STYLES[rating].cardClassName : "bg-gray-50";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg p-4",
        cardTone,
        className,
      )}
    >
      <span className="text-sm text-[#475569]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-[#111827]">{value}</span>
        {rating ? <RatingBadge rating={rating} size="sm" /> : null}
      </div>
      {helperText ? (
        <span className="text-xs text-[#6B7280]">{helperText}</span>
      ) : null}
    </div>
  );
}
