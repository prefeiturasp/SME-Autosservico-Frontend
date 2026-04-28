import { useQuery } from "@tanstack/react-query";
import type {
  PeakUsageStatus,
  PeakUsageTodayResponse,
} from "@/types/peakUsageToday";

type Options = {
  systemName: string;
};

const MOCK_PEAK_HOUR = 15;

function pickRandomStatus(): PeakUsageStatus {
  const statuses: PeakUsageStatus[] = ["peak", "off-peak"];
  const buffer = new Uint8Array(1);
  crypto.getRandomValues(buffer);
  return statuses[buffer[0] % statuses.length];
}

export function usePeakUsageToday({ systemName }: Options) {
  return useQuery<PeakUsageTodayResponse>({
    queryKey: ["peak-usage-today", systemName],
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
