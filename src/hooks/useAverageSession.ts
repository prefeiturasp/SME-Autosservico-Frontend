import { useQuery } from "@tanstack/react-query";
import type { AverageSessionResponse } from "@/types/averageSession";
import type { MetricTrend } from "@/types/metric";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

const AVERAGE_SECONDS = 868;

const TREND_TO_CURRENT_SECONDS: Record<MetricTrend, number> = {
  "on-average": 872,
  above: 1085,
  below: 615,
};

function pickRandomTrend(): MetricTrend {
  const trends: MetricTrend[] = ["on-average", "above", "below"];
  const buffer = new Uint8Array(1);
  crypto.getRandomValues(buffer);
  return trends[buffer[0] % trends.length];
}

export function useAverageSession({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<AverageSessionResponse>({
    queryKey: ["average-session", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const trend = pickRandomTrend();
      return {
        system: systemName,
        currentSeconds: TREND_TO_CURRENT_SECONDS[trend],
        averageSeconds: AVERAGE_SECONDS,
        trend,
      };
    },
  });
}
