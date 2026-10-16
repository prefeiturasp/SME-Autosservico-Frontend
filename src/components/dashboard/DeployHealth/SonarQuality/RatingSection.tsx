import { cn } from "@/lib/utils";
import type { SonarRating } from "@/types/sonarqube";
import RatingBadge from "./RatingBadge";

type RatingItem = {
  label: string;
  rating: SonarRating;
};

type Props = {
  readonly items: RatingItem[];
  readonly className?: string;
};

export default function RatingSection({ items, className }: Props) {
  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {items.map(({ label, rating }) => (
        <div key={label} className="flex flex-col items-center gap-3 py-2">
          <span className="text-sm text-[#475569]">{label}</span>
          <RatingBadge rating={rating} size="lg" ariaLabel={`${label}: ${rating}`} />
        </div>
      ))}
    </div>
  );
}
