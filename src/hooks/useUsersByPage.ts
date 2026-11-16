import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/analytics";
import type { UsersByPageResponse } from "@/types/usersByPage";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
  coordenadoria?: string;
};

export function useUsersByPage({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
  coordenadoria,
}: Options) {
  return useQuery<UsersByPageResponse>({
    queryKey: ["users-by-page", systemName, period, coordenadoria],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: () => fetchAnalytics<UsersByPageResponse>("users-by-page", systemName, period),
  });
}
