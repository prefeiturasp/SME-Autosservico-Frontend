export type AnalyticsPeriod = "hoje" | "7-dias" | "30-dias";

export type AnalyticsPeriodInfo = {
  value: AnalyticsPeriod;
  label: string;
  peakCardTitle: string;
};

export const ANALYTICS_PERIODS: ReadonlyArray<AnalyticsPeriodInfo> = [
  {
    value: "hoje",
    label: "Hoje",
    peakCardTitle: "Pico de uso hoje",
  },
  {
    value: "7-dias",
    label: "7 dias",
    peakCardTitle: "Dia de maior pico",
  },
  {
    value: "30-dias",
    label: "30 dias",
    peakCardTitle: "Período de maior pico",
  },
];

export const DEFAULT_ANALYTICS_PERIOD: AnalyticsPeriod = "hoje";

export function getPeakCardTitle(period: AnalyticsPeriod): string {
  return (
    ANALYTICS_PERIODS.find((p) => p.value === period)?.peakCardTitle ??
    ANALYTICS_PERIODS[0].peakCardTitle
  );
}

export type DashboardTab =
  | "operacional"
  | "metricas"
  | "analytics"
  | "saude-deploy";
