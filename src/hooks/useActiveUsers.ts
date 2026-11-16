import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/analytics";
import type { ActiveUsersResponse } from "@/types/activeUsers";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
};

export function useActiveUsers({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
}: Options) {
  return useQuery<ActiveUsersResponse>({
    queryKey: ["active-users", systemName, period],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: () => fetchAnalytics<ActiveUsersResponse>("active-users", systemName, period),
  });
}
