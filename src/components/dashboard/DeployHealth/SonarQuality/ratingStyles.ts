import type { SonarRating } from "@/types/sonarqube";

type RatingStyle = {
  cardClassName: string;
  badgeClassName: string;
};

export const RATING_STYLES: Record<SonarRating, RatingStyle> = {
  A: {
    cardClassName: "bg-emerald-50/70",
    badgeClassName: "bg-emerald-100 text-emerald-800",
  },
  B: {
    cardClassName: "bg-emerald-50/70",
    badgeClassName: "bg-lime-100 text-lime-800",
  },
  C: {
    cardClassName: "bg-amber-50/60",
    badgeClassName: "bg-amber-100 text-amber-800",
  },
  D: {
    cardClassName: "bg-orange-50/60",
    badgeClassName: "bg-orange-100 text-orange-800",
  },
  E: {
    cardClassName: "bg-red-50/60",
    badgeClassName: "bg-red-100 text-red-800",
  },
};

export function ratingFromCoverage(coverage: number, minimum = 80): SonarRating {
  if (coverage >= minimum) return "A";
  if (coverage >= minimum - 10) return "B";
  if (coverage >= minimum - 30) return "C";
  if (coverage >= minimum - 50) return "D";
  return "E";
}

export function ratingFromDuplication(percent: number, maximum = 5): SonarRating {
  if (percent <= maximum) return "A";
  if (percent <= maximum + 5) return "B";
  if (percent <= maximum + 15) return "C";
  if (percent <= maximum + 25) return "D";
  return "E";
}
