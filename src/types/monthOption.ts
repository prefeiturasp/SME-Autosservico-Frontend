export type MonthOption = {
  value: string;
  label: string;
};

export const MONTH_OPTIONS: ReadonlyArray<MonthOption> = [
  { value: "2026-02", label: "Fevereiro/2026" },
  { value: "2026-03", label: "Março/2026" },
  { value: "2026-04", label: "Abril/2026" },
  { value: "2026-05", label: "Maio/2026" },
  { value: "2026-06", label: "Junho/2026" },
  { value: "2026-07", label: "Julho/2026" },
];

export const DEFAULT_MONTH = "2026-07";
