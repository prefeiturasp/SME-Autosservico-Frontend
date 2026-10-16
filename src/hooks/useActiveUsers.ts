import { useQuery } from "@tanstack/react-query";
import type { ActiveUsersResponse } from "@/types/activeUsers";
import type { MetricTrend } from "@/types/metric";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

const AVERAGE_COUNT = 7563;

const TREND_TO_VARIANT: Record<
  MetricTrend,
  { activeCount: number; differencePercentage: number }
> = {
  "on-average": { activeCount: 7589, differencePercentage: 0 },
  above: { activeCount: 8929, differencePercentage: 18 },
  below: { activeCount: 6580, differencePercentage: 13 },
};

function pickRandomTrend(): MetricTrend {
  const trends: MetricTrend[] = ["on-average", "above", "below"];
  const buffer = new Uint8Array(1);
  crypto.getRandomValues(buffer);
  return trends[buffer[0] % trends.length];
}

export function useActiveUsers({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<ActiveUsersResponse>({
    queryKey: ["active-users", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const trend = pickRandomTrend();
      const variant = TREND_TO_VARIANT[trend];
      return {
        system: systemName,
        activeCount: variant.activeCount,
        averageCount: AVERAGE_COUNT,
        differencePercentage: variant.differencePercentage,
        trend,
      };
    },
  });
}
