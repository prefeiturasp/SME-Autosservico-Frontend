export const DEVICE_COLORS = {
  desktop: "#1F3D73",
  mobile: "#4A90D9",
  tablet: "#5BC0BE",
} as const;

export const OFF_PEAK_COLOR = "#D1D5DB";

export const DEVICE_LABELS: Record<string, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
};

export const DEVICE_KEYS = ["desktop", "mobile", "tablet"] as const;
