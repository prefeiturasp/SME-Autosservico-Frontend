import { Skeleton } from "@/components/ui/skeleton";

const METRIC_SKELETON_KEYS = [
  "bugs",
  "coverage",
  "duplication",
  "vulnerabilities",
  "code-smells",
  "security-hotspots",
] as const;

const RATING_SKELETON_KEYS = ["reliability", "security", "maintainability"] as const;

export default function SonarQualityIndicatorsCardSkeleton() {
  return (
    <div className="flex flex-col gap-6" data-testid="sonar-quality-skeleton">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {METRIC_SKELETON_KEYS.map((key) => (
          <Skeleton key={key} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {RATING_SKELETON_KEYS.map((key) => (
          <Skeleton key={key} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
