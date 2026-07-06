import { useQuery } from "@tanstack/react-query";
import type { DeviceDistributionResponse } from "@/types/deviceDistribution";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

const MOCK_RESPONSE: DeviceDistributionResponse = {
  system: "mock",
  desktop: 78,
  mobile: 18,
  tablet: 4,
  warning: "18% dos acessos via mobile, mas o sistema não é responsivo.",
};

export function useDeviceDistribution({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<DeviceDistributionResponse>({
    queryKey: ["device-distribution", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ...MOCK_RESPONSE, system: systemName };
    },
  });
}
