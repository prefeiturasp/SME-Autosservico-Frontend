export type PeakUsageStatus = "peak" | "off-peak";

export type PeakUsageTodayResponse = {
  system: string;
  peakHour: number;
  status: PeakUsageStatus;
};
