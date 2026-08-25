import type { MetricTrend } from "@/types/metric";

export type ActiveAccessUsersResponse = {
  activeCount: number;
  trend: MetricTrend;
  trendLabel: string;
};

export type UniqueUsersPerDayResponse = {
  uniqueCount: number;
  trend: MetricTrend;
  trendLabel: string;
};

export type TodayAccessResponse = {
  accessCount: number;
  trend: MetricTrend;
  trendLabel: string;
};

export type UsersByProfileResponse = {
  codae: number;
  dre: number;
  ue: number;
};

export type AccessComparisonBucket = {
  label: string;
  value: number;
  isPeak: boolean;
};

export type AccessComparisonResponse = {
  buckets: AccessComparisonBucket[];
};

export type StatVariant = "neutral" | "success" | "warning" | "danger" | "muted";

export type StatItem = {
  label: string;
  value: number;
  variant: StatVariant;
};

export type StatsCardResponse = {
  items: StatItem[];
};

export type TableRow = {
  label: string;
  value: number;
};

export type ProvasResponse = {
  items: StatItem[];
  progressPercentage: number;
};

export type ProgressStatsResponse = {
  items: StatItem[];
  progressPercentage: number;
};
