export type AverageSessionTrend = "above" | "below" | "on-average";

export type AverageSessionResponse = {
  system: string;
  currentSeconds: number;
  averageSeconds: number;
  trend: AverageSessionTrend;
};
