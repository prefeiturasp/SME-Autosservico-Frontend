export type PeriodoLetivoOption = {
  value: string;
  label: string;
};

export const PERIODO_LETIVO_OPTIONS: ReadonlyArray<PeriodoLetivoOption> = [
  { value: "2025.1", label: "Período 2025.1" },
  { value: "2025.2", label: "Período 2025.2" },
  { value: "2026.1", label: "Período 2026.1" },
  { value: "2026.2", label: "Período 2026.2" },
];

export const DEFAULT_PERIODO_LETIVO = "2026.1";
