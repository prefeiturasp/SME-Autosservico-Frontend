import { useQuery } from "@tanstack/react-query";
import type {
  PeakUsageStatus,
  PeakUsageTodayResponse,
} from "@/types/peakUsageToday";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

const MOCK_PEAK_HOUR = 15;

function pickRandomStatus(): PeakUsageStatus {
  const statuses: PeakUsageStatus[] = ["peak", "off-peak"];
  const buffer = new Uint8Array(1);
  crypto.getRandomValues(buffer);
  return statuses[buffer[0] % statuses.length];
}

export function usePeakUsageToday({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<PeakUsageTodayResponse>({
    queryKey: ["peak-usage-today", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        system: systemName,
        peakHour: MOCK_PEAK_HOUR,
        status: pickRandomStatus(),
      };
    },
  });
}
