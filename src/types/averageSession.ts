import type { MetricTrend } from "./metric";

export type AverageSessionResponse = {
  system: string;
  currentSeconds: number;
  averageSeconds: number;
  trend: MetricTrend;
};
