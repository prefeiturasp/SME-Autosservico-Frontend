import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/analytics";
import type { PeakHoursResponse } from "@/types/peakHours";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

export function usePeakHours({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<PeakHoursResponse>({
    queryKey: ["peak-hours", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: () => fetchAnalytics<PeakHoursResponse>("peak-hours", systemName, period),
  });
}
