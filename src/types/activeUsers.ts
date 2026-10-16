import type { MetricTrend } from "./metric";

export type ActiveUsersResponse = {
  system: string;
  activeCount: number;
  averageCount: number;
  differencePercentage: number;
  trend: MetricTrend;
};
