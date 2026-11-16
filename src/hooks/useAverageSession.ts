import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/analytics";
import type { AverageSessionResponse } from "@/types/averageSession";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

export function useAverageSession({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<AverageSessionResponse>({
    queryKey: ["average-session", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: () => fetchAnalytics<AverageSessionResponse>("average-session", systemName, period),
  });
}
