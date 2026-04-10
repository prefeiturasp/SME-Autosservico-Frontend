import { useQuery } from "@tanstack/react-query";
import type { PeakHoursResponse } from "@/types/peakHours";
import { PEAK_HOURS_MOCK } from "@/components/dashboard/PeakHoursChart/mockData";

type Options = {
  systemName: string;
};

// TODO: substituir mock por chamada real a API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchPeakHours(systemName: string): Promise<PeakHoursResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return PEAK_HOURS_MOCK;
}

export function usePeakHours({ systemName }: Options) {
  return useQuery<PeakHoursResponse>({
    queryKey: ["peak-hours", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: () => fetchPeakHours(systemName),
  });
}
