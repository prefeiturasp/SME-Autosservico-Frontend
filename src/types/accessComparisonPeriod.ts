export type AccessComparisonPeriod = "dia" | "quinzena" | "mes" | "trimestre";

export type AccessComparisonPeriodInfo = {
  value: AccessComparisonPeriod;
  label: string;
};

export const ACCESS_COMPARISON_PERIODS: ReadonlyArray<AccessComparisonPeriodInfo> = [
  { value: "dia", label: "Dia" },
  { value: "quinzena", label: "Quinzena" },
  { value: "mes", label: "Mês" },
  { value: "trimestre", label: "Trimestre" },
];

export const DEFAULT_ACCESS_COMPARISON_PERIOD: AccessComparisonPeriod = "trimestre";
