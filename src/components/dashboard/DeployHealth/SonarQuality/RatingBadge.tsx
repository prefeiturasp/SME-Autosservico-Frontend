import { cn } from "@/lib/utils";
import type { SonarRating } from "@/types/sonarqube";
import { RATING_STYLES } from "./ratingStyles";

type Props = {
  readonly rating: SonarRating;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
  readonly ariaLabel?: string;
};

const SIZE_CLASSES: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-6 min-w-6 px-1.5 text-xs",
  md: "h-8 min-w-8 px-2 text-sm",
  lg: "h-12 min-w-12 px-3 text-2xl",
};

export default function RatingBadge({
  rating,
  size = "md",
  className,
  ariaLabel,
}: Props) {
  const style = RATING_STYLES[rating];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-bold",
        SIZE_CLASSES[size],
        style.badgeClassName,
        className,
      )}
      aria-label={ariaLabel ?? `Rating ${rating}`}
    >
      {rating}
    </span>
  );
}
