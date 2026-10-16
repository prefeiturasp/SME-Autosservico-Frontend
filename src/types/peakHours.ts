export type DeviceBreakdown = {
  desktop: number;
  mobile: number;
  tablet: number;
};

export type HourlyAccess = DeviceBreakdown & {
  hour: string;
  total: number;
};

export type PeakHoursResponse = {
  system: string;
  peakHour: string;
  data: HourlyAccess[];
};
