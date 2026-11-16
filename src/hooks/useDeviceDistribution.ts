import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/analytics";
import type { DeviceDistributionResponse } from "@/types/deviceDistribution";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

export function useDeviceDistribution({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<DeviceDistributionResponse>({
    queryKey: ["device-distribution", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: () => fetchAnalytics<DeviceDistributionResponse>("device-distribution", systemName, period),
  });
}
