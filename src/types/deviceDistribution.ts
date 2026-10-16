export type DeviceType = "desktop" | "mobile" | "tablet";

export type DeviceDistributionResponse = {
  system: string;
  desktop: number;
  mobile: number;
  tablet: number;
  warning: string | null;
};
