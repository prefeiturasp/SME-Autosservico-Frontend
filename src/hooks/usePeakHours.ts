import { useQuery } from "@tanstack/react-query";
import type { PeakHoursResponse } from "@/types/peakHours";
import { PEAK_HOURS_MOCK } from "@/components/dashboard/PeakHoursChart/mockData";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

async function fetchPeakHours(systemName: string): Promise<PeakHoursResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ...PEAK_HOURS_MOCK, system: systemName };
}

export function usePeakHours({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<PeakHoursResponse>({
    queryKey: ["peak-hours", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: () => fetchPeakHours(systemName),
  });
}
